import request from 'http-request'
import { SYS_PATH as prefix } from 'config'
export default {
  save: function (params) {
    return request.post(`${prefix}/sys/menu/save`, params);
  },

  drag: function (params) {
    return request.post(`${prefix}/sys/menu/drag`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/menu/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/sys/menu/queryById`, { id });
  },

  treeData: function (params) {
    return request.get(`${prefix}/sys/menu/treeData`, { params });
  },
}
