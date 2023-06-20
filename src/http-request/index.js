import axios from 'axios';
import qs from 'qs';
import store from 'store';
import { merge } from 'xe-utils';
import { ERROR_HANDLERS, AXIOS_CONFIG } from './configs';
import { utilFn } from 'utils';
import { encrypt, decrypt } from 'utils/encryption';

class HttpRequest {
  constructor(errorHandlers, axiosConfig = {}) {
    this.errorHandlers = errorHandlers;
    this.axios = axios.create(axiosConfig);
    this.key = 'b131fc7009d604ff80d9b760fb52c0a2'; // 密钥
    this.interceptors();
  }

  interceptors() {
    // 请求拦截器
    this.axios.interceptors.request.use(
      async (config) => {
        // 登录逻辑判断
        if (import.meta.env.VUE_APP_OPEN_PUBLIC_AGENT === 'true' && config.isUseToken !== false) {
          if (import.meta.env.NODE_ENV === 'production')
            config.headers['Authorization'] = `Bearer ${store.state.user.token}` || '';
          else config.headers['token'] = `${store.state.user.token}` || '';
        }

        // 公共请求方法封装
        if (import.meta.env.VUE_APP_OPEN_PUBLIC_AGENT === 'true' && config.isPublicAgent !== false) {
          if (config.url.indexOf('/flowable/model/saveModel') > 0 ) {
            const { url } = config;
            // 截取ID
            const modelId = url.split('/').pop();
            // 转发请求地址
            config.url = `${import.meta.env.VITE_APP_BASE_API}/cnpdg/zhgyl/saveModel/${modelId}`;
            config.headers['Content-Type'] = 'application/json; charset=utf-8';
          } else {
            const { url, responseType: dataType, method: type } = config;
            const rParams = {
              type,
              dataType,
              url,
              params: config.params || config.data,
            };
            const request1 = `${import.meta.env.VITE_APP_BASE_API}/cnpdg/zhgyl/request`;
            const request2 = `${import.meta.env.VITE_APP_BASE_API}/cnpdg/zhgyl/requestPodOne`;
            const request3 = `${import.meta.env.VITE_APP_BASE_API}/cnpdg/zhgyl/requestPodTwo`;
            const requestList = [request1, request2, request3];
            const index = Math.floor(Math.random() * requestList.length);
            // 转发请求地址
            config.url = requestList[index];
            // 转发请求方式
            config.method = 'POST';
            config.headers['Content-Type'] = 'application/json; charset=utf-8';
            // 转发请求参数
            config.data = rParams;
            config.params = '';
          }
        }

        // 加密解密
        if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
          config.data = qs.stringify(config.data);
        }
        if (import.meta.env.VITE_APP_DATA_ENCRYPT === 'true' && config.isEncryption !== false) {
          if (utilFn._isNotEmpty(config.data)) {
            config.data = {
              encryptStr: encrypt(JSON.stringify(config.data), this.key),
            };
          } else if (utilFn._isNotEmpty(config.params)) {
            config.params = {
              encryptStr: encrypt(JSON.stringify(config.params), this.key),
            };
          }
        }
        // 加上请求前缀
        if (
          config.url.startsWith('http://') ||
          config.url.startsWith('https://') ||
          config.url.startsWith('www') ||
          import.meta.env.NODE_ENV !== 'production'
        ) {
          return config;
        } else {
          config.url = `${import.meta.env.VITE_VITE_APP_WEB_SITE}${config.url}`;
          return config;
        }
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.axios.interceptors.response.use(
      // 请求成功
      (response) => {
        // 获取后端返回的错误码
        const { code } = response.data;
        // 执行自定义的错误处理函数
        if (code && import.meta.env.VITE_APP_DATA_ENCRYPT !== 'true') {
          const errorHandler = this.errorHandlers[code];

          if (code == 500) return Promise.reject(response.data.msg);
          else typeof errorHandler === 'function' && errorHandler();
        }
        // 解密
        if (import.meta.env.VITE_APP_DATA_ENCRYPT === 'true' && response.config.isEncryption !== false) {
          if (typeof response.data.data !== 'string') {
            // return Promise.resolve(response.data);
          } else {
            try {
              response.data.data = JSON.parse(decrypt(response.data.data, this.key));
            } catch (err) {
              // return Promise.resolve(response.data);
            }
          }
        }

        // 公共请求方法封装
        if (
          import.meta.env.VUE_APP_OPEN_PUBLIC_AGENT === 'true' &&
          response.config.isPublicAgent !== false
        ) {
          const data = response.data.data;

          if (data.type !== 'json') {
            return Promise.resolve(data.responseEntity.body);
          } else {
            return Promise.resolve(JSON.parse(data.responseEntity.body));
          }
        }

        return Promise.resolve(response.data);
      },
      // 错误处理
      (error) => {
        if (error.response) {
          // 获取http请求错误码
          const { status } = error.response;
          // 执行自定义的错误处理函数
          const errorHandler = this.errorHandlers[status];
          typeof errorHandler === 'function' && errorHandler();
        }
        console.log(error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * fetch
   * @param {String} type   [request type]
   * @param {String} path   [request url path]
   * @param {Object} param  [request params]
   * @param {Object} config  [axios config]
   */
  fetch(type, path, param = {}, config = {}) {
    return new Promise((resolve, reject) => {
      this.axios[type](path, param, config)
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  /**
   * get
   * @param {String} path   [request url path]
   * @param {Object} param  [request params]
   * @param {Object} config  [axios config]
   */
  get(path, param = {}, config = {}) {
    return this.fetch('get', path, {
      params: param,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'indices' });
      },
      ...config,
    });
  }

  /**
   * post
   * @param {String} path   [request url path]
   * @param {Object} param  [request params]
   * @param {Object} config  [axios config]
   */
  post(path, param = {}, config = {}) {
    return this.fetch('post', path, param, config);
  }

  /**
   * put
   * @param {String} path   [request url path]
   * @param {Object} param  [request params]
   * @param {Object} config  [axios config]
   */
  put(path, param = {}, config = {}) {
    return this.fetch('put', path, param, config);
  }

  /**
   * delete(url参数)
   * @param {String} path   [request url path]
   * @param {Object} param  [request params]
   * @param {Object} config  [axios config]
   */
  delete(path, param = {}, config = {}) {
    return this.fetch('delete', path, {
      params: param,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'indices' });
      },
      ...config,
    });
  }

  /**
   * deletePost(post参数)
   * @param {String} path   [request url path]
   * @param {Object} param  [request params]
   * @param {Object} config  [axios config]
   */
  deletePost(path, param = {}, config = {}) {
    return this.fetch('delete', path, {
      data: param,
      ...config,
    });
  }

  /**
   * 文件上传方法
   * @param {*} path
   * @param {*} params
   * @param {Object} config  [axios config]
   */
  formData(path, params, config = {}) {
    const formData = new FormData();
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });

    const defaultFormDataConfig = {
      method: 'post',
      data: formData,
      headers: {
        'content-type': 'multipart/form-data;charset=UTF-8',
      },
    };
    return new Promise((resolve, reject) => {
      this.axios(path, merge(defaultFormDataConfig, config))
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }
}

const http = new HttpRequest(ERROR_HANDLERS, AXIOS_CONFIG);

export default http;
