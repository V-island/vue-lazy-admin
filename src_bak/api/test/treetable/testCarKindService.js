import request from 'http-request'
import { TEST_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + '/test/treetable/testCarKind/save',
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/test/treetable/testCarKind/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + '/test/treetable/testCarKind/queryById',
      method: 'get',
      params: { id: id },
    })
  },

  drag: function (inputForm) {
    return request({
      url: prefix + `/test/treetable/testCarKind/drag`,
      method: 'post',
      data: inputForm,
    })
  },

  treeData: function () {
    return request({
      url: prefix + '/test/treetable/testCarKind/treeData',
      method: 'get',
    })
  },
}
