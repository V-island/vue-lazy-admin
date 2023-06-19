import request from 'http-request';
import { SYS_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/database/datamodel/dataSet/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/database/datamodel/dataSet/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/database/datamodel/dataSet/queryById`, { id });
  },

  getMeta: function (params) {
    return request.get(`${prefix}/database/datamodel/dataSet/getMeta`, params, {
      headers: { arrayFormat: 'brackets' },
    });
  },

  exec: function (params) {
    return request.get(`${prefix}/database/datamodel/dataSet/exec`, params, {
      headers: { arrayFormat: 'brackets' },
    });
  },

  list: function (params) {
    return request.get(`${prefix}/database/datamodel/dataSet/list`, params);
  },
};
