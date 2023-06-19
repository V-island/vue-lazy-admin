import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/datav/dataScreenCategory/save`,
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/datav/dataScreenCategory/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/datav/dataScreenCategory/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  treeData: function (extId) {
    return request({
      url: prefix + '/datav/dataScreenCategory/treeData',
      method: 'get',
      params: { extId: extId },
    })
  },
}
