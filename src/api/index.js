import { request } from '@/utils'

export default {
  login: (data) => request.post('/auth/login', data, { noNeedToken: true }),
  logout: () => request.get('/auth/logout'),
  refreshToken: () => request.post('/auth/refreshToken', null, { noNeedTip: true }),

  // 用户相关接口
  getUser: () => request.get('/user/info'),

  // 博客设置相关接口
  getBlogConfig: () => request.get('/setting/blog-config'),
}
