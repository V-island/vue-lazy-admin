import { request } from '@/utils'

export default {
  getCags: (params = {}) => request.get(`/cags`, { params }),
  getCagById: (id) => request.get(`/cag/${id}`),
  addCag: (data) => request.post('/cag', data),
  updateCag: (data) => request.put(`/cag/${data.id}`, data),
  deleteCag: (id) => request.delete(`/cag/${id}`),
}
