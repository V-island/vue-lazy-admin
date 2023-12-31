const Layout = () => import('@/layout/index.vue')

// 基础路由, 无需权限, 总是会注册到最终路由中
export const basicRoutes = [
  // {
  //   name: '',
  //   path: '/',
  //   component: Layout,
  //   redirect: '/home', // 默认跳转到首页
  //   meta: { order: 0 },
  // },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/common/PageNotFound.vue'),
    isHidden: true,
    meta: {
      title: '错误页',
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/common/Login.vue'),
    isHidden: true,
    meta: {
      title: '登录页',
    },
  },
  // 支持直接传递第三方url，打开iframe, iframe:http://localhost:8088/ureport/designer?_u=file:22.ureport.xml&title=编辑报表'
  {
    path: '/iframePage',
    name: 'iframePage',
    component: () => import('@/views/common/IframePage.vue'),
    isHidden: true,
    meta: {
      title: 'iframe',
      target: 'iframe',
    },
  },
]

export const NOT_FOUND_ROUTE = {
  name: 'NotFound',
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  isHidden: true,
}

export const EMPTY_ROUTE = {
  name: 'Empty',
  path: '/:pathMatch(.*)*',
  component: null,
}

// 加载 views 下每个模块的 routes.js 文件
const routeModules = import.meta.glob('@/views/**/route.js', { eager: true })
const asyncRoutes = []
Object.keys(routeModules).forEach((key) => {
  asyncRoutes.push(routeModules[key].default)
})

// 加载 views 下每个模块的 index.vue 文件
const vueModules = import.meta.glob('@/views/modules/**/index.vue')

export { asyncRoutes, vueModules }
