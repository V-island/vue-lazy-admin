const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Log',
  path: '/log',
  component: Layout,
  redirect: '/log/operation',
  meta: {
    title: '日志管理',
    icon: 'mdi:math-log',
    role: ['admin'],
    requireAuth: true,
    keepAlive: true,
    order: 6,
  },
  children: [
    {
      name: 'OperatingLog',
      path: 'operation',
      component: () => import('./operation/index.vue'),
      meta: {
        title: '操作日志',
        icon: 'mdi:book-open-page-variant-outline',
        role: ['admin'],
        requireAuth: true,
        keepAlive: true,
      },
    },
    {
      name: 'LoginLog',
      path: 'login',
      component: () => import('./login/index.vue'),
      meta: {
        title: '登录日志',
        icon: 'material-symbols:login',
        role: ['admin'],
        requireAuth: true,
        keepAlive: true,
      },
    },
  ],
}
