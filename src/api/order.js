import { API_SERVICE } from 'config';
import http from 'http-request';

// 单据查询
export function getTableList(params) {
  return http.get(`${API_SERVICE}/busiOrder/list`, params)
}

// 根据单据id查询明细
export function listByErpOrWorkId(params) {
  return http.get(`${API_SERVICE}/busiOrder/listByErpOrWorkId`, params)
}

// 新增单据
export function addErpOrder(params) {
  return http.post(`${API_SERVICE}/busiOrder/addErpOrder`, params)
}