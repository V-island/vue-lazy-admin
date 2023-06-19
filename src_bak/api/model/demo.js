import config from '@/config'
import request from '@/utils/httpRequest'

export default {
  ver: {
    url: `${config.API_URL}/demo/ver`,
    name: '获取最新版本号',
    get: async function () {
      return await request.get(this.url)
    },
  },
  post: {
    url: `${config.API_URL}/demo/post`,
    name: '分页列表',
    post: async function (data) {
      return await request.post(this.url, data, {
        headers: {
          //'response-status': 401
        },
      })
    },
  },
  page: {
    url: `${config.API_URL}/demo/page`,
    name: '分页列表',
    get: async function (params) {
      return await request.get(this.url, params)
    },
  },
  menu: {
    url: `${config.API_URL}/demo/menu`,
    name: '普通用户菜单',
    get: async function () {
      return await request.get(this.url)
    },
  },
}
