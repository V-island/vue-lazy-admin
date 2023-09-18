import { API_SERVICE } from 'config';
import http from 'http-request';

// 物料数据查询
export function getTableList(params) {
  return http.get(`${API_SERVICE}/busiMateriel/list`, params)
}

// 新增物料数据
export function addMateriel(params) {
  return http.post(`${API_SERVICE}/busiMateriel/addMateriel`, params)
}

// 根据id串删除物料数据
export function delMaterielById(params) {
  return http.post(`${API_SERVICE}/busiMateriel/delMaterielById`, params)
}

// 可选物料数据库存查询
export function getMaterielData(params) {
  return http.get(`${API_SERVICE}/busiMateriel/materielData`, params)
}
