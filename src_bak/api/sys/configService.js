import request from 'http-request'
import { SYS_PATH as prefix } from 'config'
export default {
  getConfig: function () {
    return request.get(`${prefix}/sys/sysConfig/getConfig`);
  },

  queryById: function () {
    return request.get(`${prefix}/sys/sysConfig/queryById`);
  },

  save: function (params) {
    return request.post(`${prefix}/sys/sysConfig/save`, params);
  },
}
