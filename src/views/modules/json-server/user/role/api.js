import { jsrequest } from '@/utils'

export default {
  getRoles: (params = {}) => {
    // 去掉空值
    for (const key in params) {
      if (params[key] === '' || params[key] === null) delete params[key]
    }
    return jsrequest.get(`/role`, { ...params })
  },
  getRoleById: (id) => jsrequest.get(`/role/${id}`),
  addRole: (data) => jsrequest.post('/role', data),
  updateRole: (data) => jsrequest.put(`/role/${data.id}`, data),
  deleteRole: (id) => jsrequest.delete(`/role/${id}`),
}
