import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (params) {
    return request.post(`${prefix}/sys/language/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/language/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/sys/language/queryById`, { id });
  },

  getLanguageMap: function () {
    return request.get(`${prefix}/sys/language/getLanguageMap`);
  },

  list: function (params) {
    return request.get(`${prefix}/sys/language/list`, {params});
  },
}
