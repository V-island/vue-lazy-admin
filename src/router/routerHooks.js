import xeUtils from 'xe-utils';
import router from 'router/index';
import { close, start } from 'plugins/nprogress'
import { message } from 'ant-design-vue';
import { menuStore } from 'store/auth';
import { getDocumentTitle, clearAppState, resetRouter, generateAsyncRoutes } from 'utils';
import { KEY_TOKEN, ACCESS_WHITE_LIST } from 'config';
import { storage } from 'utils/browserStorage';

// 打印报错信息
function errorHandle(msg, to, next) {
  // clearAppState();
  message.error(msg);
  console.log(to, next);
}

// 路由切换之前触发
export async function beforeHook(to, from, next) {
  start();
  document.title = getDocumentTitle(to.meta.title);

  // 访问白名单页面时
  if (ACCESS_WHITE_LIST.includes(to.path))
    return next();

  // 判断是否登录
  const token = storage.get(KEY_TOKEN);
  if (token === undefined || token === "")
    return next('/login');

  // 异步路由存在，直接跳转
  const menu = menuStore();
  const asyncRoutes = menu.asyncRoutes;

  // 异步路由存在，直接跳转
  if (xeUtils.isArray(asyncRoutes) && asyncRoutes.length > 0) {
    // 匹配到页面
    if (to.matched.length > 0) return next();

    /**  没有匹配到页面   */
    // 获取异步路由中layout所在引索Index
    const layoutIndex = xeUtils.findIndexOf(asyncRoutes, item => item.name == 'layout');
    // 获取异步路由中layout所在子集
    const layoutChildren = layoutIndex < 0 ? asyncRoutes : xeUtils.get(asyncRoutes, `[${layoutIndex}].children`);
    // 判断是否匹配到页面
    const isExist = xeUtils.some(layoutChildren, (item) => item.path === to.path);

    // 没匹配到页面，并且在异步路由内也不存在，跳转404
    if (!isExist) return next({ path: '/404', replace: true });

    // 没匹配到页面，但在异步路由内存在，说明用户刷新页面了，router的matcher被清空，需要重新添加
    const newAsyncRoutes = generateAsyncRoutes(menu.menuAllList);

    if (newAsyncRoutes.length == 0) return errorHandle('用户信息获取失败，请重新登录', to, next);

    resetRouter();
    router.addRoutes(newAsyncRoutes);
    return next({ ...to });
  }

  // 异步路由不存在，重新获取
  try {
    const data = await menu.getMenuListToToken();

    if (data.result) {
      // 异步路由添加成功，继续跳转
      return next({ ...to, replace: true });
    }
  } catch (error) {
    // 菜单获取失败，回登陆页面
    return errorHandle('用户菜单获取失败，请重新登录', to, next);
  }

  next();
}

// 路由切换完成后触发
export function afterHook() {
  close();
}

