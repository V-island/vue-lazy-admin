import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  delete: function (ids) {
    return request({
      url: prefix + '/mail/trash/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/mail/trash/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/mail/trash/list',
      method: 'get',
      params: params,
    })
  },
}
