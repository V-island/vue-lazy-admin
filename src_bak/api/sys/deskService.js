import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (params) {
    return request.post(`${prefix}/sys/desk/save`, params);
  },
  getGridInfo: function () {
    return request.get(`${prefix}/sys/desk/getGridInfo`);
  },
}
