import request from 'http-request'
import { DEVTOOLS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/devtools/templateGroup/save`,
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/devtools/templateGroup/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/devtools/templateGroup/queryById`,
      method: 'get',
      params: { id: id },
    })
  },
  queryGenFiles: function (id, tableId) {
    return request({
      url: prefix + `/devtools/templateGroup/queryGenFiles`,
      method: 'get',
      params: { id: id, tableId: tableId },
    })
  },
  copy: function (id) {
    return request({
      url: prefix + `/devtools/templateGroup/copy`,
      method: 'put',
      loading: true,
      loadingText: '正在复制中...',
      params: { id: id },
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/devtools/templateGroup/list',
      method: 'get',
      params: params,
    })
  },
}
