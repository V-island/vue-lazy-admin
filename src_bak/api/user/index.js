import request from 'http-request';
import { ISC__SERVICE, CONFIG_SERVICE, AUTH_PATH as prefix } from 'config';

/* ======================= ISC Login数据 ==================== */
// 通过ticket获取用户名
export function getUserNameByTicket(ticket) {
  return request.post(
    `${ISC__SERVICE}/getUserByRole`,
    { ticket },
    {
      headers: {
        Authorization: process.env.VUE_APP_ISC_HEADER_KEY,
      },
      isUseToken: false,
      isEncryption: false,
      isPublicAgent: false,
    },
  );
}
// 通过用户名获取Token
export function getTokenByUserName(username) {
  return request.post(
    `${ISC__SERVICE}/getTokenByIsc`,
    { username },
    {
      headers: {
        Authorization: process.env.VUE_APP_ISC_HEADER_KEY,
      },
      isUseToken: false,
      isEncryption: false,
      isPublicAgent: false,
    },
  );
}

// 通过用户名获取Token
export function getLocalTokenByUserName(username) {
  return request.get(
    `${prefix}/user/loginByUsername`,
    { username },
    {
      isUseToken: false,
      isEncryption: false,
    },
  );
}

// 获取菜单信息
export function getUserRoleMenuInfo(params) {
  return request.get(`${CONFIG_SERVICE}/sso/credential/getRes`, params, {
    isEncryption: false,
    isPublicAgent: false,
  });
}
// 获取人员信息
export function getUserInfo(params) {
  return request.post(
    `${CONFIG_SERVICE}/valid/user/getByUsername?username=${params.username}`,
    params,
    {
      isEncryption: false,
      isPublicAgent: false,
    },
  );
}
// 获取按钮权限
export function getButtonPermissions(params) {
  return request.post(`${ISC__SERVICE}/wzjc/auth/info/getPermissionIdByUserId`, params, {
    isPublicAgent: false,
  });
}
// 获取角色信息
export function getUserRoleInfo(params) {
  return request.post(`${ISC__SERVICE}/loadUserRolesByAppId`, params, {
    isPublicAgent: false,
  });
}
