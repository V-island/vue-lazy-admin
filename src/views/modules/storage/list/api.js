import { request } from '@/utils'

export default {
  getList: (params = {}) => request.get('files', { params }),
  getItemById: (id) => request.get(`/file/${id}`),
  addItem: (data) => request.post('/file', data),
  updateItem: (data) => request.put(`/file/${data.id}`, data),
  deleteItem: (id) => request.delete(`/file/${id}`),
//   getCags: (params = {}) => request.get(`/cags`, { params }),
}
