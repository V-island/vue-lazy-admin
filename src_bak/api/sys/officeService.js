import request from 'http-request'
import { SYS_PATH as prefix } from 'config'
export default {
  save: function (params) {
    return request.post(`${prefix}/sys/office/save`, params);
  },

  drag: function (params) {
    return request.post(`${prefix}/sys/office/drag`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/office/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/sys/office/queryById`, { id });
  },

  treeData: function (params) {
    return request.get(`${prefix}/sys/office/treeData`, { params });
  },
}
