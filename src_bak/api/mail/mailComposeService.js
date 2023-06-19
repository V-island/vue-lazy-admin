import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/mail/compose/save`,
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/mail/compose/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/mail/compose/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/mail/compose/list',
      method: 'get',
      params: params,
    })
  },
}
