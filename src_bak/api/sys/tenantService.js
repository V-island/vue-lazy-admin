import request from 'http-request'
import { SYS_PATH as prefix } from 'config'
export default {
  save: function (params) {
    return request.post(`${prefix}/sys/tenant/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/sys/tenant/delete`, { ids });
  },

  queryById: function (id) {
    // return request({
    //   url: prefix + `/sys/tenant/queryById?id=${id}`,
    //   method: 'get',
    // })
    return request.get(`${prefix}/sys/tenant/queryById`, { id });
  },

  validateNotExist: function (params) {
    return request.get(`${prefix}/sys/tenant/validateNotExist`, { params });
  },

  list: function (params) {
    return request.get(`${prefix}/sys/tenant/list`, { params });
  },
}
