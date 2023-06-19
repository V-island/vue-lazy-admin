import { ElMessageBox, ElMessage } from 'element-plus';
import { clearAppState, toLoginPage } from 'utils';

export const ERROR_HANDLERS = {
  // 异常处理：支持 400/401/403/404/405/413/414/500/502/504或其它任意错误码
  401: () => {
    clearAppState();
    ElMessageBox({
      title: '提示',
      message: '长时间未操作，需要重新登录。',
      type: 'warning',
      confirmButtonText: '去登陆',
      showClose: false,
      closeOnClickModal: false,
    }).then(() => {
      //退出登录
      const { VUE_APP_ISC_LOGOUT_ADDRESS, VUE_APP_LOGOUT_ADDRESS } = process.env;
      toLoginPage(`${VUE_APP_ISC_LOGOUT_ADDRESS}${VUE_APP_LOGOUT_ADDRESS}`);
    });
  },
  403: () => {
    ElMessage.error({ message: `未授权，拒绝访问`, duration: 5000 });
  },
  404: () => {
    ElMessage.error({ message: `请求地址出错`, duration: 5000 });
  },
  408: () => {
    ElMessage.error({ message: `请求超时`, duration: 5000 });
  },
  500: () => {
    ElMessage.error({ message: `服务器内部错误`, duration: 5000 });
  },
  501: () => {
    ElMessage.error({ message: `服务未实现`, duration: 5000 });
  },
  502: () => {
    ElMessage.error({ message: `网关错误`, duration: 5000 });
  },
  503: () => {
    ElMessage.error({ message: `服务不可用`, duration: 5000 });
  },
  504: () => {
    ElMessage.error({ message: `网关超时`, duration: 5000 });
  },
  505: () => {
    ElMessage.error({ message: `HTTP版本不受支持`, duration: 5000 });
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
