import request from 'http-request';
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (params) {
    return request.post(`${prefix}/sys/area/save`, params);
  },

  drag: function (params) {
    return request.post(`${prefix}/sys/area/drag`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/area/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/sys/area/queryById`, { id });
  },

  treeData: function (extId) {
    return request.get(`${prefix}/sys/area/treeData`, { extId });
  },
}
