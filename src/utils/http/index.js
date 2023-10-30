import axios from 'axios'
import qs from 'qs'
import { merge } from 'xe-utils'
import { reqReject, reqResolve, resReject, resResolve } from './interceptors'

export class HttpRequest {
  constructor(options = {}) {
    const service = axios.create({
      // 默认配置
      timeout: 12000,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Language': 'zh-CN',
      },
      withCredentials: true,
      ...options,
    });

    // 请求拦截器
    service.interceptors.request.use(reqResolve, reqReject)
    // 响应拦截器
    service.interceptors.response.use(resResolve, resReject)

    this.axios = service
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

// 初始化请求实例
export const request = new HttpRequest({
  baseURL: import.meta.env.VITE_BASE_API,
})

// 如果还有其他请求, 可以再创建一个 axios 实例
// export const request_xxx = new HttpRequest({
//   baseURL: 'xxx',
// })
