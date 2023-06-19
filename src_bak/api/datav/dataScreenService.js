import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/datav/dataScreen/save`,
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/datav/dataScreen/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/datav/dataScreen/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  copy: function (id) {
    return request({
      url: prefix + `/datav/dataScreen/copy`,
      method: 'get',
      params: { id: id },
    })
  },

  sqlQuery: function (inputForm) {
    return request({
      url: prefix + '/datav/dataScreen/sqlQuery',
      method: 'post',
      data: inputForm,
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/datav/dataScreen/list',
      method: 'get',
      params: params,
    })
  },
}
