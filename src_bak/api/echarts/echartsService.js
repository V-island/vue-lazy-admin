import request from 'http-request'
import { SYS_PATH as prefix } from 'config'

export default {
  save: function (inputForm) {
    return request({
      url: prefix + `/echarts/save`,
      method: 'post',
      data: inputForm,
    })
  },

  delete: function (ids) {
    return request({
      url: prefix + '/echarts/delete',
      method: 'delete',
      params: { ids: ids },
    })
  },

  queryById: function (id) {
    return request({
      url: prefix + `/echarts/queryById`,
      method: 'get',
      params: { id: id },
    })
  },

  mergeChartData: function (params) {
    return request({
      url: prefix + `/echarts/mergeChartData`,
      method: 'get',
      params: params,
    })
  },

  queryDesignById: function (id) {
    return request({
      url: prefix + `/echarts/queryDesignById`,
      method: 'get',
      params: { id: id },
    })
  },

  getChartData: function (id) {
    return request({
      url: prefix + `/echarts/getChartData/${id}`,
      method: 'get',
    })
  },
  list: function (params) {
    return request({
      url: prefix + '/echarts/list',
      method: 'get',
      params: params,
    })
  },
}
