import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  info: function (params) {
    return request({
      url: prefix + `/monitor/server/info`,
      method: 'get',
      params: params,
    })
  },
}
