import { API_SERVICE } from 'config';
import http from 'http-request';

// 系统登录日志查询
export function getLoginLog(params) {
  return http.get(`${API_SERVICE}/admin/loginLog`, params)
}

// 系统错误日志查询
export function getExceptionLog(params) {
  return http.get(`${API_SERVICE}/admin/exceptionLog`, params)
}

// 系统操作日志查询
export function getOperationLog(params) {
  return http.get(`${API_SERVICE}/admin/operationLog`, params)
}