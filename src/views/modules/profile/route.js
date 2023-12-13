const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Profile',
  path: '/profile',
  component: Layout,
  redirect: '/profile/user',
  isHidden: true,
  meta: {
    order: 8,
  },
  children: [
    {
      name: 'user',
      path: 'user',
      component: () => import('./index.vue'),
      meta: {
        title: '个人中心',
        icon: 'mdi:account',
        order: 0,
      },
    },
  ],
}
