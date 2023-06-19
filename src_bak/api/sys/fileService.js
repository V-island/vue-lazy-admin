import request from 'http-request'
import { FILE_PATH as prefix } from 'config'
export default {
  uploadFile: function (formData, config = {}) {
    // return request({
    //   url: prefix + `/file/upload?uploadPath=userdir`,
    //   method: 'post',
    //   config: config,
    //   data: formData,
    //   headers: { 'Content-Type': 'multipart/form-data' },
    // })

    return request.post(`${prefix}/file/upload?uploadPath=userdir`, { formData, headers: { 'Content-Type': 'multipart/form-data' }});
  },

  getUrl: function (params) {
    return request.get(`${prefix}/file/download`, { params });
  },
}
