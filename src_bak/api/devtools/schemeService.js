import request from 'http-request'
import { DEVTOOLS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/devtools/scheme/save`,
      method: 'post',
      data: inputForm,
    })
  },

  createMenu: function (inputForm) {
    return request({
      url: prefix + `/devtools/scheme/createMenu`,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      data: inputForm,
    })
  },

  getFileTree: function (parentNode) {
    return request({
      url: prefix + `/devtools/scheme/getFileTree`,
      method: 'get',
      params: { parentNode: parentNode },
    })
  },
}
