import { Modal, message } from 'ant-design-vue';
import { clearAppState, toLoginPage } from 'utils';

export const ERROR_HANDLERS = {
  // 异常处理：支持 400/401/403/404/405/413/414/500/502/504或其它任意错误码
  401: () => {
    clearAppState();
    Modal.warning({
      title: '提示',
      content: '长时间未操作，需要重新登录。',
      onOk: () => {
        toLoginPage('#/login')
      }
    });
  },
  403: () => {
    message.error(`未授权，拒绝访问`);
  },
  404: () => {
    message.error(`请求地址出错`);
  },
  408: () => {
    message.error(`请求超时`);
  },
  500: () => {
    message.error(`服务器内部错误`);
  },
  501: () => {
    message.error(`服务未实现`);
  },
  502: () => {
    message.error(`网关错误`);
  },
  503: () => {
    message.error(`服务不可用`);
  },
  504: () => {
    message.error(`网关超时`);
  },
  505: () => {
    message.error(`HTTP版本不受支持`);
  },
};

export const AXIOS_CONFIG = {
  timeout: 1000 * 180,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept-Language': 'zh-CN',
  },
  withCredentials: true,
};
