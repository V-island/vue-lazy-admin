import { request } from '@/utils'

export default {
  login: (data) => request.post('/auth/login', data, { noNeedToken: true }),
  logout: () => request.get('/auth/logout'),
  refreshToken: () => request.post('/auth/refreshToken', null, { noNeedTip: true }),

  // 日志相关接口
  getOperationLogs: (params = {}) => request.get('/operation/log/list', params),
  deleteOperationLogs: (data = []) => request.delete('/operation/log', data),

  // 用户相关接口
  getUser: () => request.get('/user/info'),
  updateCurrent: data => request.put('/user/current', data), // 更新当前用户信息
  updateCurrentPassword: data => request.put('/user/current/password', data), // 修改当前用户密码

  // 博客设置相关接口
  getBlogConfig: () => request.get('/setting/blog-config'),
}
