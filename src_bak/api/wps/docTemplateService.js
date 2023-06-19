import request from 'http-request'
import { WPS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/wps/docTemplate/save`,
      method: 'post',
      data: inputForm,
    })
  },

  createFile: function (type) {
    return request({
      url: prefix + '/weboffice/new/url',
      method: 'get',
      params: { type: type },
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/wps/docTemplate/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/wps/docTemplate/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/wps/docTemplate/list',
      method: 'get',
      params: params,
    })
  },
}
