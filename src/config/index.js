/* =================== API请求配置 ================ */
export const BASE_API = import.meta.env.VITE_APP_BASE_API;
export const API_SERVICE = `${BASE_API}`;

/* =================== localStorage key ================ */
export const TOKEN = 'token';
export const REFRESH_TOKEN = 'refresh_token';
export const AUTO_LOGIN = 'auto_login';
export const USER_INFO = 'USER_INFO';
export const MENU_LIST = 'MENU';
export const ROLE_LIST = 'ROLE_LIST';
export const ROLE_LIST_INDEX = 'ROLE_LIST_INDEX';
export const PERMISSIONS_LIST = 'PERMISSIONS';
export const DICT_LIST = 'DICT_LIST';

/* =================== 模拟用户数据 ================ */
// 用户信息
export const UserInfo = {
  userId: 'zhul70',
  userName: 'zhul70',
  orgName: '测试组',
  realName: '朱亮',
};
// 菜单信息列表
export const MenuList = [
  {
    url: '/home',
    name: '首页',
    customIcon: '/home.png',
  },
];
// 角色信息列表
export const RoleList = [
  {
    userId: 'zhul70',
    id: '8a65eac66d632e14016d6707c9de02d1',
    code: 'IN_SYS_ADMIN',
    name: '系统管理员',
  },
];
// 权限列表
export const PermissionsList = [
  'ny:nyRuleHistory:list',
  'test:onetomany:testDataMain:export',
  'gencode:validateType:view',
  'ureport:add',
  'extension:actCategory:del',
  'test:manytomany:testCourse:list',
  'test:grid:testCountry:del',
];
