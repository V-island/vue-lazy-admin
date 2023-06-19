import request from 'http-request'
import { SYS_PATH as prefix } from 'config'
export default {
  save: function (params) {
    return request.post(`${prefix}/sys/dataRule/save`, params);
  },

  delete: function (id) {
    return request.delete(`${prefix}/sys/dataRule/delete`, { id });
  },

  queryById: function (id) {
    return request.get(`${prefix}/sys/dataRule/queryById`, { id });
  },

  list: function (params) {
    return request.get(`${prefix}/sys/dataRule/list`, { params });
  },
  treeData: function () {
    return request.get(`${prefix}/sys/dataRule/treeData`);
  },
}
