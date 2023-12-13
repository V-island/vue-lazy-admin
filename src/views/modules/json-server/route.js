const Layout = () => import('@/layout/index.vue')
export default {
  name: 'JsonServer',
  path: '/jsonserver',
  component: Layout,
  meta: {
    title: 'JSON服务',
    icon: 'carbon:json',
    requireAuth: false,
    order: 12,
  },
  children: [
    {
      name: 'JsonPost',
      path: 'post',
      meta: {
        title: '文章管理',
        icon: 'material-symbols:article-outline',
        requireAuth: false,
        order: 1,
      },
      children: [
        {
          name: 'JsonPostcag',
          path: 'cag',
          component: () => import('./post/cag/index.vue'),
          meta: {
            title: '文章分类',
            icon: 'material-symbols:category-outline',
            order: 0,
            keepAlive: true,
          },
        },
        {
          name: 'JsonPostlist',
          path: 'post',
          component: () => import('./post/list/index.vue'),
          meta: {
            title: '文章列表',
            icon: 'grommet-icons:list',
            order: 0,
          },
        },
      ],
    },
    {
      name: 'JsonUser',
      path: 'user',
      meta: {
        title: '用户管理',
        icon: 'tabler:user-cog',
        requireAuth: false,
        order: 2,
      },
      children: [
        {
          name: 'JsonUserlist',
          path: 'list',
          component: () => import('./user/list/index.vue'),
          meta: {
            title: '用户列表',
            icon: 'gg:user-list',
            order: 0,
          },
        },
        {
          name: 'JsonUserrole',
          path: 'role',
          component: () => import('./user/role/index.vue'),
          meta: {
            title: '用户角色',
            icon: 'tabler:user-pentagon',
            order: 0,
          },
        },
      ],
    },
  ],
}
