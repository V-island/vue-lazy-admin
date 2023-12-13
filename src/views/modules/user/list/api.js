import { request } from '@/utils'

export default {
  getUsers: (params = {}) => request.get(`/users`, { params }),
  getUserById: (id) => request.get(`/user/${id}`),
  addUser: (data) => request.post('/user', data),
  updateUser: (data) => request.put(`/user/${data.id}`, data),
  deleteUser: (id) => request.delete(`/user/${id}`),
  getRoles: (params = {}) => request.get(`/roles`, { params }),
}