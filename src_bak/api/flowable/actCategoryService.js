import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  treeData: function (extId) {
    return request.get(`${prefix}/extension/actCategory/treeData`, { extId });
  },

  save: function (params) {
    return request.post(`${prefix}/extension/actCategory/save`, params);
  },

  drag: function (params) {
    return request.post(`${prefix}/extension/actCategory/drag`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/extension/actCategory/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/extension/actCategory/queryById`, { id });
  },
};
