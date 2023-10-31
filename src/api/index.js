import { request } from '@/utils'

export default {
  login: data => request.post('/login', data, { noNeedToken: true }),
  // 用户相关接口
  getUser: () => request.get('/user/info'),
  // 博客设置相关接口
  getBlogConfig: () => request.get('/setting/blog-config'),
}
