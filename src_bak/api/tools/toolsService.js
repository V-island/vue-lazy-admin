import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  sendEmail: function (inputForm) {
    return request({
      url: prefix + `/tools/email/send`,
      method: 'post',
      data: inputForm,
    })
  },

  createTwoDimensionCode: function (params) {
    return request({
      url: prefix + `/tools/TwoDimensionCodeController/createTwoDimensionCode`,
      method: 'get',
      params: params,
    })
  },
}
