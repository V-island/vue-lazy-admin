import { API_SERVICE } from 'config';
import http from 'http-request';

// 获取设备类型
export function getDeviceTypeList(params) {
  return http.get(`${API_SERVICE}/devInfo/type`, params)
}

// 获取数据类型
export function getDateTypeList(params) {
  return http.get(`${API_SERVICE}/devConfig/dateType`, params)
}