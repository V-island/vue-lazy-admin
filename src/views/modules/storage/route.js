const Layout = () => import('@/layout/index.vue')
export default {
  name: 'Storage',
  path: '/storage',
  component: Layout,
  redirect: '/storage/list',
  meta: {
    title: '媒体库',
    icon: 'material-symbols:home-storage-outline',
    order: 2,
  },
  children: [
    {
      name: 'Storagelist',
      path: 'list',
      component: () => import('./list/index.vue'),
      meta: {
        title: '库文件',
        icon: 'material-symbols:perm-media-outline',
        order: 0,
        keepAlive: true,
      },
    },
  ],
}
