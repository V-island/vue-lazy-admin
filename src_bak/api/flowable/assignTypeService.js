import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/extension/assignType/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/extension/assignType/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/extension/assignType/queryById`, { id });
  },

  list: function (params) {
    return request.get(`${prefix}/extension/assignType/list`, params);
  },
};
