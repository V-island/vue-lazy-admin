import { close, start } from 'plugins/nprogress'
import { message } from 'ant-design-vue';
import { getDocumentTitle, clearAppState, resetRouter, generateAsyncRoutes } from 'utils';
import { KEY_TOKEN, ACCESS_WHITE_LIST } from 'config';
import { storage } from 'utils/browserStorage';

// 打印报错信息
function errorHandle(msg, to, next) {
  clearAppState();
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
  let asyncRoutes = store.state.user.asyncRoutes;
  if (asyncRoutes && Array.isArray(asyncRoutes) && asyncRoutes.length > 0) {
    // 没有匹配到页面
    if (to.matched.length < 1) {
      const isExist = asyncRoutes[0].children.some((item) => item.path === to.path);
      // 没匹配到页面，但在异步路由内存在，说明用户刷新页面了，router的matcher被清空，需要重新添加
      if (isExist) {
        asyncRoutes = generateAsyncRoutes(store.state.user.menuList);
        if (asyncRoutes.length > 0) {
          resetRouter();
          router.addRoutes(asyncRoutes);
          next({ ...to });
          return;
        }
        errorHandle('用户信息获取失败，请重新登录', to, next);
        return;
      }
      // 没匹配到页面，并且在异步路由内也不存在，跳转404
      next({ path: '/404', replace: true });
      return;
    }
    next();
    return;
  }

}

// 路由切换完成后触发
export function afterHook() {
  close();
}

