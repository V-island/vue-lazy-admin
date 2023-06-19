import request from 'http-request'
import { TEST_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + '/test/note/testNote/save',
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/test/note/testNote/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + '/test/note/testNote/queryById',
      method: 'get',
      params: { id: id },
    })
  },

  list: function (params) {
    return request({
      url: prefix + '/test/note/testNote/list',
      method: 'get',
      params: params,
    })
  },
}
