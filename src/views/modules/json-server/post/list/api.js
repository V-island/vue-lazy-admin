import { jsrequest } from '@/utils'

export default {
  getPosts: (params = {}) => {
    // 去掉空值
    for (const key in params) {
      if (params[key] === '' || params[key] === null) delete params[key]
    }
    return jsrequest.get('post', { ...params })
  },
  getPostById: (id) => jsrequest.get(`/post/${id}`),
  addPost: (data) => jsrequest.post('/post', data),
  updatePost: (data) => jsrequest.put(`/post/${data.id}`, data),
  deletePost: (id) => jsrequest.delete(`/post/${id}`),
  getCags: (params = {}) => jsrequest.get(`/cag`, { ...params }),
}
