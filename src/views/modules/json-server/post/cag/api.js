import { jsrequest } from '@/utils'

export default {
  getCags: (params = {}) => {
    // 去掉空值
    if (!window.$utils.isEmpty(params)) {
      for (const key in params) {
        if (params[key] === '' || params[key] === null) delete params[key]
      }
    }
    return jsrequest.get(`/cag`, { ...params })
  },
  getCagById: (id) => jsrequest.get(`/cag/${id}`),
  addCag: (data) => jsrequest.post('/cag', data),
  updateCag: (data) => jsrequest.put(`/cag/${data.id}`, data),
  deleteCag: (id) => jsrequest.delete(`/cag/${id}`),
}
