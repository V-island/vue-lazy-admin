/* =================== API请求配置 ================ */
export const BASE_API = import.meta.env.VITE_APP_BASE_API;

export const API_SERVICE = `${BASE_API}`;
export const WS_SERVICE_SITE = `ws://${import.meta.env.VITE_APP_WS_FRONT_SITE}`;

/* =================== localStorage key ================ */
export const KEY_TOKEN = 'token';
export const KEY_USER_INFO = 'userInfo';
export const KEY_PERMISSIONS = 'permissions';

/* =================== 访问白名单 ================ */
export const ACCESS_WHITE_LIST = [
  '/', '/login', '/403', '/404'
];

/* =================== 系统配置 ================ */
// 默认tab
export const defaultTab = {
  tabName: '首页',
  tabPath: '/home',
};

// 菜单图标列表
export const menuIcons = ['fa-cog', 'fa-address-book-o'];

// 系统主题对应色值
export const systemThemeColor = {
  green: '#11BBBB',
  blue: '#31A6EF',
  purple: '#E747BA',
};

// 禁用keep-alive缓存的组件列表(组件name)
export const disableCacheComponents = [];
