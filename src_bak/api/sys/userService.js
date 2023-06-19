import request from 'http-request';
import { SYS_PATH as prefix } from 'config';
export default {
  save: function (params) {
    return request.post(`${prefix}/sys/user/save`, params, {
      headers: { arrayFormat: 'repeat' },
    });
  },

  saveInfo: function (params) {
    return request.post(`${prefix}/sys/user/saveInfo`, params, {
      headers: { arrayFormat: 'repeat' },
    });
  },

  savePwd: function (params) {
    return request.put(`${prefix}/sys/user/savePwd`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/user/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/sys/user/queryById`, { id });
  },

  getMenus: function () {
    return request.get(`${prefix}/sys/user/getMenus`);
  },

  info: function () {
    return request.get(`${prefix}/sys/user/info`);
  },

  list: function (params) {
    return request.get(`${prefix}/sys/user/list`, params);
  },
  exportTemplate: function () {
    return request.get(
      `${prefix}/sys/user/import/template`,
      {},
      {
        responseType: 'blob',
      },
    );
  },

  exportExcel: function (params) {
    return request.get(`${prefix}/sys/user/export`, params, {
      responseType: 'blob',
    });
  },

  importExcel: function (params) {
    return request.post(`${prefix}/sys/user/import`, params);
  },
};
