import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/notify/save`,
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/notify/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/notify/queryById`,
      method: 'get',
      params: { id: id },
    })
  },
  query: function (params) {
    return request({
      url: prefix + `/notify/queryById`,
      method: 'get',
      params: params,
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/notify/list',
      method: 'get',
      params: params,
    })
  },
}
