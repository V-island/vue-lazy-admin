import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/extension/flowCopy/save`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    });
  },

  delete: function (ids) {
    return request.delete(`${prefix}/extension/flowCopy/delete`, { ids });
  },

  list: function (params) {
    return request.get(`${prefix}/extension/flowCopy/list`, params);
  },
};
