import { jsrequest } from '@/utils'

export default {
  getUsers: (params = {}) => {
    // 去掉空值
    for (const key in params) {
      if (params[key] === '' || params[key] === null) delete params[key]
    }
    return jsrequest.get(`/user`, { ...params })
  },
  getUserById: (id) => jsrequest.get(`/user/${id}`),
  addUser: (data) => jsrequest.post('/user', data),
  updateUser: (data) => jsrequest.put(`/user/${data.id}`, data),
  deleteUser: (id) => jsrequest.delete(`/user/${id}`),
  getRoles: (params = {}) => jsrequest.get(`/role`, { params }),
}