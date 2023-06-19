import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  delete: function (ids) {
    return request({
      url: prefix + '/mail/box/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/mail/box/queryById`,
      method: 'get',
      params: { id: id },
    })
  },
  queryStatus: function () {
    return request({
      url: prefix + `/mail/box/queryStatus`,
      method: 'get',
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/mail/box/list',
      method: 'get',
      params: params,
    })
  },
}
