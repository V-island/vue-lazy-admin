import config from '@/config'
import request from '@/utils/httpRequest'

export default {
  upload: {
    url: `${config.API_URL}/upload`,
    name: '文件上传',
    post: async function (data, config = {}) {
      return await request.post(this.url, data, config)
    },
  },
  file: {
    menu: {
      url: `${config.API_URL}/file/menu`,
      name: '获取文件分类',
      get: async function () {
        return await request.get(this.url)
      },
    },
    list: {
      url: `${config.API_URL}/file/list`,
      name: '获取文件列表',
      get: async function (params) {
        return await request.get(this.url, params)
      },
    },
  },
}
