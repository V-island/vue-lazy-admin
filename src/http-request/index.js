import axios from 'axios';
import qs from 'qs';
import { merge, isEmpty } from 'xe-utils';
import { useAuthStore } from 'store/auth';
import { ERROR_HANDLERS, AXIOS_CONFIG } from './configs';

class HttpRequest {
  constructor(errorHandlers, axiosConfig = {}) {
    this.errorHandlers = errorHandlers;
    this.axios = axios.create(axiosConfig);
    this.interceptors();
  }

  interceptors() {
    // 请求拦截器
    this.axios.interceptors.request.use(
      async (config) => {
        const useAuth = useAuthStore();
        // 登录逻辑判断
        if (import.meta.env.NODE_ENV === 'production' && config.isUseToken !== false)
          config.headers['Authorization'] = `Bearer ${useAuth.token}` || '';

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
        const result = import.meta.env.VITE_APP_SIMULATION_LOGIN != 'true' ? response.data : this.formatJsonServer(response.data);
        // 获取后端返回的错误码
        const { code } = result;
        // 执行自定义的错误处理函数
        const errorHandler = this.errorHandlers[code];

        if (code == 500) return Promise.reject(result.message);
        else typeof errorHandler === 'function' && errorHandler();

        return Promise.resolve(result);
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

        return Promise.reject(error);
      },
    );
  }

  // 格式化json-server返回值
  formatJsonServer(data) {
    const response = {
      data,
      code: 200,
      message: '请求成功'
    }
    if (isEmpty(data)) {
      response.code = 405;
      response.message = null;
    }

    return response;
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
