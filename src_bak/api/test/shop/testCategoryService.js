import request from 'http-request'
import { TEST_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + '/test/shop/testCategory/save',
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/test/shop/testCategory/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + '/test/shop/testCategory/queryById',
      method: 'get',
      params: { id: id },
    })
  },

  drag: function (inputForm) {
    return request({
      url: prefix + `/test/shop/testCategory/drag`,
      method: 'post',
      data: inputForm,
    })
  },

  treeData: function () {
    return request({
      url: prefix + '/test/shop/testCategory/treeData',
      method: 'get',
    })
  },
}
