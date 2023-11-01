const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Profile',
  path: '/profile',
  component: Layout,
  redirect: '/profile',
  isHidden: true,
  meta: {
    order: 8,
  },
  children: [
    {
      name: 'Profile',
      path: 'profile',
      component: () => import('./index.vue'),
      meta: {
        title: '个人中心',
        icon: 'mdi:account',
        order: 0,
      },
    },
  ],
}
