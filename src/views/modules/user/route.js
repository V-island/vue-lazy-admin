const Layout = () => import('@/layout/index.vue')
export default {
  name: 'User',
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  meta: {
    title: '用户管理',
    icon: 'tabler:user-cog',
    requireAuth: false,
    order: 3,
  },
  children: [
    {
      name: 'Userlist',
      path: 'list',
      component: () => import('./list/index.vue'),
      meta: {
        title: '用户列表',
        icon: 'gg:user-list',
        order: 0,
        keepAlive: true,
      },
    },
    {
        name: 'Userrole',
        path: 'role',
        component: () => import('./role/index.vue'),
        meta: {
          title: '用户角色',
          icon: 'tabler:user-pentagon',
          order: 1,
        },
      }
  ],
}