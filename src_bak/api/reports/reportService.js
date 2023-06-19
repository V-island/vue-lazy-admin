import request from 'http-request'
import { UREPORT_PATH as prefix } from 'config'

export default {
  delete: function (id) {
    return request({
      url: prefix + '/reports/delete',
      method: 'delete',
      params: { id: id },
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/reports/list',
      method: 'get',
      params: params,
    })
  },
}
