import { API_SERVICE } from 'config';
import http from 'http-request';

// 工程项目枚举查询
export function getProjectEnum(params) {
  return http.get(`${API_SERVICE}/busiProject/projectData`, params)
}