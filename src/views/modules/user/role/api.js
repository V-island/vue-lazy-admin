import { request } from '@/utils'

export default {
  getRoles: (params = {}) => request.get(`/roles`, { params }),
  getRoleById: (id) => request.get(`/role/${id}`),
  addRole: (data) => request.post('/role', data),
  updateRole: (data) => request.put(`/role/${data.id}`, data),
  deleteRole: (id) => request.delete(`/role/${id}`),
  getMenus: (params = {}) => request.get(`/menus`, { params }),
}
