import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/extension/formCategory/save`, params);
  },
  delete: function (ids) {
    return request.delete(`${prefix}/extension/formCategory/delete`, { ids });
  },
  drag: function (params) {
    return request.post(`${prefix}/extension/formCategory/drag`, params);
  },
  queryById: function (id) {
    return request.get(`${prefix}/extension/formCategory/queryById`, { id });
  },

  treeData: function (extId) {
    return request.get(`${prefix}/extension/formCategory/treeData`, { extId });
  },
};
