import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/extension/nodeSetting/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/extension/nodeSetting/delete`, { ids });
  },

  queryValueByKey: function (params) {
    return request.get(`${prefix}/extension/nodeSetting/queryValueByKey`, params);
  },

  queryById: function (id) {
    return request.get(`${prefix}/extension/nodeSetting/queryById`, { id });
  },

  list: function (params) {
    return request.get(`${prefix}/extension/nodeSetting/list`, params);
  },
};
