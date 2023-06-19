import request from 'http-request';
import { SYS_PATH as prefix } from 'config';

export default {
  queryById: function (id) {
    return request.get(`${prefix}/sys/dict/queryById`, { id });
  },

  save: function (params) {
    return request.post(`${prefix}/sys/dict/save`, params);
  },

  list: function (params) {
    return request.get(`${prefix}/sys/dict/type/list`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/dict/delete`, { ids });
  },

  queryDictValue: function (dictValueId) {
    return request.get(`${prefix}/sys/dict/queryDictValue`, { dictValueId });
  },

  saveDictValue: function (params) {
    return request.post(`${prefix}/sys/dict/saveDictValue`, params);
  },

  getDictValue: function (dictTypeId) {
    return request.get(`${prefix}/sys/dict/getDictValue`, { dictTypeId });
  },

  getDictMap: function (dictTypeId) {
    return request.get(`${prefix}/sys/dict/getDictMap`, { dictTypeId });
  },

  deleteDictValue: function (ids) {
    return request.delete(`${prefix}/sys/dict/deleteDictValue`, { ids });
  },
};
