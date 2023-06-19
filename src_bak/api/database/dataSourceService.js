import request from 'http-request';
import { SYS_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/database/datalink/dataSource/save`, params);
  },
  start: function (id) {
    return request.put(`${prefix}/database/datalink/dataSource/start`, { id });
  },
  stop: function (id) {
    return request.put(`${prefix}/database/datalink/dataSource/stop`, { id });
  },

  test: function (params) {
    return request.post(`${prefix}/database/datalink/dataSource/test`, params);
  },

  checkEnName: function (oldEnName, enName) {
    return request.get(`${prefix}/database/datalink/dataSource/checkEnName`, {
      oldEnName,
      enName,
    });
  },

  delete: function (ids) {
    return request.delete(`${prefix}/database/datalink/dataSource/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/database/datalink/dataSource/queryById`, { id });
  },

  list: function (params) {
    return request.get(`${prefix}/database/datalink/dataSource/list`, params);
  },

  treeData: function () {
    return request.get(`${prefix}/database/datalink/dataSource/treeData`);
  },
};
