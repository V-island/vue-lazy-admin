import request from 'http-request'
import { SYS_PATH as prefix } from 'config'
export default {
  list: function (params) {
    return request.get(`${prefix}/sys/log/list`, { params });
  },

  mine: function (params) {
    return request.get(`${prefix}/sys/log/data/mine`, { params });
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/log/delete`, { ids });
  },

  empty: function () {
    return request.delete(`${prefix}/sys/log/empty`);
  },
}
