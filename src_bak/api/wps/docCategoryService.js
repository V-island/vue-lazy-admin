import request from 'http-request'
import { WPS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/wps/docCategory/save`,
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/wps/docCategory/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },
  drag: function (inputForm) {
    return request({
      url: prefix + `/wps/docCategory/drag`,
      method: 'post',
      data: inputForm,
    })
  },
  queryById: function (id) {
    return request({
      url: prefix + `/wps/docCategory/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  treeData: function (extId) {
    return request({
      url: prefix + '/wps/docCategory/treeData',
      method: 'get',
      params: { extId: extId },
    })
  },
}
