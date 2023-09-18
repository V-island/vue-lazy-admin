import { createRouter, createWebHashHistory } from 'vue-router';
import { clone } from 'xe-utils';
import { beforeHook, afterHook } from './routerHooks';

// 常量路由表
const constRoutes = [
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('views/common/Login.vue'),
    meta: {
      title: '登录',
      tooltip: '请选择登录方式',
    },
  },
  {
    path: '/403',
    hidden: true,
    name: 'pageNotPermission',
    meta: {
      title: '403',
    },
    component: () => import('views/common/PageNotPermission.vue'),
  },
  {
    path: '/404',
    name: 'pageNotFound',
    component: () => import('views/common/PageNotFound.vue'),
    meta: {
      title: '404',
    },
  },
  {
    path: '/:catchAll(.*)*',
    hidden: true,
    component: () => import('views/common/PageNotFound.vue'),
  },
];

// 静态路由表
const staticRoutes = [
  // 支持直接传递第三方url，打开iframe, router.push('/iframe-page??iframeUrl=http://localhost:8088/ureport/designer?_u=file:22.ureport.xml&title=编辑报表')
  {
    path: '/iframe-page',
    name: 'iframe-page',
    component: () => import('views/common/IframePage.vue'),
    meta: {
      title: 'iframe',
      target: 'iframe',
    },
  },
];

// 初始异步路由表
const initAsyncRoutes = [
  {
    path: '/layout',
    name: 'layout',
    redirect: { name: 'home' },
    component: () => import('layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('views/common/Home.vue'),
        meta: {
          title: '首页',
        },
      },
    ],
  },
];

// 当前路由实例
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ y: 0 }),
  routes: constRoutes,
});
router.beforeEach(beforeHook);
router.afterEach(afterHook);

// 创建一个新的路由实例，替换当前路由实例中的路由列表
export function resetRoutes() {
  const newRouter = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    scrollBehavior: () => ({ y: 0 }),
    routes: constRoutes,
  });
  router.matcher = newRouter.matcher;
}

// 初始化实例
export function getInitAsyncRoutes() {
  return clone(initAsyncRoutes, true);
}

export { staticRoutes };

export default router;
