const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Post',
  path: '/post',
  component: Layout,
  meta: {
    title: '文章管理',
    icon: 'material-symbols:article-outline',
    requireAuth: false,
    order: 1,
  },
  children: [
    {
      name: 'Postcag',
      path: 'cag',
      component: () => import('./cag/index.vue'),
      meta: {
        title: '文章分类',
        icon: 'material-symbols:category-outline',
        order: 0,
        keepAlive: true,
      },
    },
    {
      name: 'Postlist',
      path: 'list',
      component: () => import('./list/index.vue'),
      meta: {
        title: '文章列表',
        icon: 'grommet-icons:list',
        order: 1,
        keepAlive: true,
      },
    },
  ],
}
