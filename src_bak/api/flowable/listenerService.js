import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/extension/listener/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/extension/listener/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/extension/listener/queryById`, { id });
  },

  list: function (params) {
    return request.get(`${prefix}/extension/listener/list`, params);
  },
};
