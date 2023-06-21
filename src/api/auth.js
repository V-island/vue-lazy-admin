import { API_SERVICE } from 'config'
import http from 'http-request'

// 登录获取TOKEN
export function loginByEmailToToken(params) {
  return http.post(`${API_SERVICE}/auth/login`, params)
}