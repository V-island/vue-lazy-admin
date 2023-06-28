import { API_SERVICE } from 'config'
import http from 'http-request'

// 登录获取TOKEN
export function loginByEmailToToken(params) {
  return http.post(`${API_SERVICE}/auth/login`, params)
}

// 获取角色列表
export function getRoleList(params) {
  return http.post(`${API_SERVICE}/auth/getRoleList`, params)
}

// 获取用户信息
export function getUserInfo(params) {
  return http.post(`${API_SERVICE}/auth/getUserInfo`, params)
}

// 获取当前角色菜单列表
export function getMenuList(params) {
  return http.post(`${API_SERVICE}/auth/getMenuList`, params)
}

// 获取当前角色权限代码列表
export function getPermissionList(params) {
  return http.post(`${API_SERVICE}/auth/getPermissionList`, params)
}