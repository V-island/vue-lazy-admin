import request from 'http-request';
import { SYS_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/form/make/save`, params);
  },

  saveFormSource: function (params) {
    return request.post(`${prefix}/form/make/saveFormSource`, params);
  },

  saveBasicInfo: function (params) {
    return request.post(`${prefix}/form/make/saveBasicInfo`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/form/make/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/form/make/queryById`, { id });
  },

  getTableColumnList: function (params) {
    return request.get(`${prefix}/form/make/getTableColumnList`, params);
  },

  getTableList: function (params) {
    return request.get(`${prefix}/form/make/getTableList`, params);
  },

  list: function (params) {
    return request.get(`${prefix}/form/make/list`, params);
  },

  validateTableNoExist: function (params) {
    return request.get(`${prefix}/form/make/validateTableNoExist`, params);
  },

  validateKeyNoExist: function (params) {
    return request.get(`${prefix}/form/make/validateKeyNoExist`, params);
  },

  createMenu: function (params) {
    return request.post(`${prefix}/form/make/createMenu`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    });
  },
};
