import request from 'http-request'
import { DEVTOOLS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/devtools/customObj/save`,
      method: 'post',
      data: inputForm,
    })
  },
  add: function (tableId, tableType) {
    return request({
      url: prefix + `/devtools/customObj/add`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      data: { tableId: tableId, tableType: tableType },
    })
  },
  delete: function (ids) {
    return request({
      url: prefix + '/devtools/customObj/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/devtools/customObj/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  getByValue: function (value) {
    return request({
      url: prefix + `/devtools/customObj/getByValue`,
      method: 'get',
      params: { value: value },
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/devtools/customObj/list',
      method: 'get',
      params: params,
    })
  },
}
