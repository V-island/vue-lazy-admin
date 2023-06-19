import request from 'http-request';
import { SYS_PATH as prefix } from 'config';

export default {
  treeData: function (params) {
    return request.get(`${prefix}/redis/treeData`, params);
  },

  flushdb: function () {
    return request.delete(`${prefix}/redis/flushdb`);
  },

  delPattern: function (pattern) {
    return request.delete(`${prefix}/redis/delPattern`, { pattern });
  },

  delKey: function (key) {
    return request.delete(`${prefix}/redis/delKey`, { key });
  },

  setValue: function (key, value) {
    return request.put(`${prefix}/redis/setValue`, { key, value });
  },

  queryByKey: function (key) {
    return request.get(`${prefix}/redis/queryByKey`, { key });
  },
};
