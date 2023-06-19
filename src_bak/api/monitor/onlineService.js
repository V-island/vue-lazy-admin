import request from 'http-request'
import { SYS_PATH as prefix } from 'config'
export default {
  kickout: function (token) {
    return request({
      url: prefix + '/online/users/kickout',
      method: 'delete',
      params: { token: token },
    })
  },
  list: function (params) {
    return request({
      url: prefix + '/online/users/list',
      method: 'get',
      params: params,
    })
  },
}
