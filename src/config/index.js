/* =================== API请求配置 ================ */
export const BASE_API = import.meta.env.VITE_APP_BASE_API;
export const API_SERVICE = `${BASE_API}`;

/* =================== localStorage key ================ */
export const KEY_TOKEN = 'token';
export const KEY_USER_INFO = 'userInfo';
export const KEY_PERMISSIONS = 'permissions';

/* =================== 访问白名单 ================ */
export const ACCESS_WHITE_LIST = [
  'login',
  'notPermissionPage',
  'notFoundPage'
];