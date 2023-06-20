import { createRouter, createWebHashHistory } from 'vue-router';
import { beforeHook, afterHook } from './routerHooks';

// 路由表
const routes = [
  {
    path: '/',
    redirect: {
      name: 'layout',
    },
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import('views/common/Login.vue'),
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('layout/index.vue'),
    redirect: { name: 'home' },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
        },
        component: () => import('views/common/Home.vue'),
      },
      // 支持直接传递第三方url，打开iframe, router.push('/iframe??iframeUrl=http://localhost:8088/ureport/designer?_u=file:22.ureport.xml&title=编辑报表')
      {
        path: 'iframe',
        component: () => import('layout/other/empty'),
        meta: { target: 'iframe' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    hidden: true,
    name: 'notFoundPage',
    meta: {
      title: '404',
    },
    component: () => import('views/common/NotFoundPage.vue'),
  },
];
// 当前路由实例
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ y: 0 }),
  routes,
});
router.beforeEach(beforeHook);
router.afterEach(afterHook);

// 创建一个新的路由实例，替换当前路由实例中的路由列表
export function resetRoutes() {
  const newRouter = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
  });
  router.matcher = newRouter.matcher;
}

export default router;
