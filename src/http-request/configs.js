import { Modal, message } from 'ant-design-vue';
import { clearAppState } from 'utils';
import { useRouter } from 'vue-router';

export const ERROR_HANDLERS = {
  // 异常处理：支持 400/401/403/404/405/413/414/500/502/504或其它任意错误码
  401: () => {
    clearAppState();
    Modal.warning({
      title: '提示',
      content: '长时间未操作，需要重新登录。',
      onOk: () => {
        const router = useRouter();
        router.push({
          name: 'login',
        });
      }
    });
  },
  403: () => {
    message.error({ message: `未授权，拒绝访问`, duration: 5000 });
  },
  404: () => {
    message.error({ message: `请求地址出错`, duration: 5000 });
  },
  408: () => {
    message.error({ message: `请求超时`, duration: 5000 });
  },
  500: () => {
    message.error({ message: `服务器内部错误`, duration: 5000 });
  },
  501: () => {
    message.error({ message: `服务未实现`, duration: 5000 });
  },
  502: () => {
    message.error({ message: `网关错误`, duration: 5000 });
  },
  503: () => {
    message.error({ message: `服务不可用`, duration: 5000 });
  },
  504: () => {
    message.error({ message: `网关超时`, duration: 5000 });
  },
  505: () => {
    message.error({ message: `HTTP版本不受支持`, duration: 5000 });
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
