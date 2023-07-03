/* =================== API请求配置 ================ */
export const BASE_API = import.meta.env.VITE_APP_BASE_API;
export const API_SERVICE = `${BASE_API}`;

/* =================== localStorage key ================ */
export const KEY_TOKEN = 'token';

/* =================== 访问白名单 ================ */
export const ACCESS_WHITE_LIST = [
  '/login'
];