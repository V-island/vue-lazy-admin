import request from 'http-request';
import { SYS_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/form/generate/save`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    });
  },

  queryById: function (params) {
    return request.get(`${prefix}/form/generate/queryById`, params);
  },

  delete: function (params) {
    return request.delete(`${prefix}/form/generate/delete`, params);
  },

  list: function (params) {
    return request.get(`${prefix}/form/generate/list`, params);
  },
};
