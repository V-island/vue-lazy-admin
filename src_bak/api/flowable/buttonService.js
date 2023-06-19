import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/extension/button/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/extension/button/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/extension/button/queryById`, { id });
  },
  validateCodeNoExist: function (params) {
    return request.get(`${prefix}/extension/button/validateCodeNoExist`, params);
  },

  validateNameNoExist: function (params) {
    return request.get(`${prefix}/extension/button/validateNameNoExist`, params);
  },

  list: function (params) {
    return request.get(`${prefix}/extension/button/list`, params);
  },
};
