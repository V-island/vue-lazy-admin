import request from 'http-request'
import { SYS_PATH as prefix } from '../AppPath'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/datav/dataMap/save`,
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/datav/dataMap/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/datav/dataMap/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/datav/dataMap/list',
      method: 'get',
      params: params,
    })
  },
}
