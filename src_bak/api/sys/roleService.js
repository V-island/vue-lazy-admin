import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (params) {
    return request.post(`${prefix}/sys/role/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/role/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/sys/role/queryById`, { id });
  },

  validateNotExist: function (params) {
    return request.get(`${prefix}/sys/role/validateNotExist`, { params });
  },

  list: function (params) {
    return request.get(`${prefix}/sys/role/list`, { params });
  },
  assign: function (params) {
    return request.get(`${prefix}/sys/role/assign`, { params });
  },

  assignAuthorityToRole: function (params) {
    return request.post(`${prefix}/sys/role/assignAuthorityToRole`, params);
  },

  removeUserFromRole: function (userId, roleId) {
    // return request({
    //   url: prefix + '/sys/role/removeUserFromRole',
    //   method: 'delete',
    //   params: { userId: userId, roleId: roleId },
    // })
    return request.delete(`${prefix}/sys/role/removeUserFromRole`, { userId: userId, roleId: roleId });
  },

  addUserToRole: function (roleId, userIds) {
    // return request({
    //   url: prefix + '/sys/role/addUserToRole',
    //   method: 'put',
    //   params: {
    //     roleId: roleId,
    //     userIds: userIds,
    //   },
    // })
    return request.put(`${prefix}/sys/role/addUserToRole`, { roleId: roleId, userIds: userIds });
  },
}
