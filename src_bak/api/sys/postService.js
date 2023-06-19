import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (params) {
    return request.post(`${prefix}/sys/post/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/post/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/sys/post/queryById`, { id });
  },

  list: function (params) {
    return request.get(`${prefix}/sys/post/list`, { params });
  },
}
