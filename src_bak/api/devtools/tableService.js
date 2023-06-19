import request from 'http-request'
import { DEVTOOLS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/devtools/table/save`,
      method: 'post',
      data: inputForm,
    })
  },

  saveTableFromDB: function (inputForm) {
    return request({
      url: prefix + `/devtools/table/saveTableFromDB`,
      method: 'post',
      loading: true,
      loadingText: '正在导入数据库...',
      data: inputForm,
    })
  },

  genCode: function (inputForm) {
    return request({
      url: prefix + `/devtools/table/genCode`,
      method: 'post',
      data: inputForm,
    })
  },

  synchDb: function (inputForm) {
    return request({
      url: prefix + `/devtools/table/synchDb`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/devtools/table/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  deleteDb: function (id) {
    return request({
      url: prefix + '/devtools/table/deleteDb',
      method: 'delete',
      params: { id: id },
    })
  },

  queryConfig: function () {
    return request({
      url: prefix + `/devtools/table/queryConfig`,
      method: 'get',
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/devtools/table/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  copyTable: function (id, newTableName) {
    return request({
      url: prefix + `/devtools/table/copyTable`,
      method: 'get',
      params: { id: id, newTableName: newTableName },
    })
  },

  getFormUrl: function (tableId) {
    return request({
      url: prefix + `/devtools/table/getFormUrl`,
      method: 'get',
      params: { tableId: tableId },
    })
  },

  queryGenCodeForm: function (params) {
    return request({
      url: prefix + '/devtools/table/queryGenCodeForm',
      method: 'get',
      params: params,
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/devtools/table/list',
      method: 'get',
      params: params,
    })
  },
  importTableData: function (params) {
    return request({
      url: prefix + '/devtools/table/importTableData',
      method: 'get',
      params: params,
    })
  },
}
