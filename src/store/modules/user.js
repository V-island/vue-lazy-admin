import * as types from '../types';
import Tool from 'utils/tool';
import {
  getLocalTokenByUserName,
  getUserNameByTicket,
  getTokenByUserName,
  getUserInfo,
  // getUserRoleInfo,
  getUserRoleMenuInfo,
  // getButtonPermissions,
} from 'api/user';
import userService from 'api/sys/userService';
import { awaitWrap, isEmpty, utilFn } from 'utils';
import { UserInfo, MenuList, RoleList, PermissionsList } from 'config';
import * as local from 'config';

// 格式化权限中心菜单列表字段
function formatMenu(list) {
  // 验证是否为数组
  if (!Array.isArray(list)) return [];

  // 移除测试页
  utilFn._remove(
    list,
    ({ url }) => url == '/home', // 测试页
  );

  return list.map((item) => {
    const { url, name, pid, children } = item;
    const option = {
      ...item,
      path: url,
      label: name,
      parents: pid,
    };

    // 子集为空时
    if (isEmpty(children) || children.length < 1) return option;

    option.children = formatMenu(children);
    return option;
  });
}

// 返回结果
function getResult(state = false, message = '') {
  return { result: state, message };
}

// 校验错误结果
// function validateResult(results) {
//   const { _get } = utilFn;
//   let info = null;
//   results.some((data) => {
//     if (_get(data, 'code') !== 0) {
//       info = Promise.resolve(getResult(false, data.msg));
//       return true;
//     }
//   });
//   return info;
// }

export default {
  namespaced: true,
  state: {
    token: '',
    userInfo: {},
    menuList: [],
    roleList: [],
    currRoleIndex: 0,
    permissions: [],
  },
  mutations: {
    // 写入Token
    [types.SET_TOKEN](state, token) {
      state.token = token;
    },
    // 写入用户信息
    [types.SET_USER_INFO](state, user) {
      state.userInfo = user;
    },
    // 写入菜单列表
    [types.SET_MENU_LIST](state, payload) {
      state.menuList = payload;
    },
    // 写入角色列表
    [types.SET_ROLE_LIST](state, roleList) {
      state.roleList = roleList;
    },
    // 写入当前选中角色
    [types.SET_ROLE_INDEX](state, index) {
      state.currRoleIndex = index;
    },
    // 写入当前用户按钮权限
    [types.SET_PERMISSIONS](state, permissions) {
      state.permissions = permissions;
    },
  },
  actions: {
    // 本地使用用户名登录
    async userLocalLoginByUserName({ commit, dispatch }, userName) {
      // 通过用户名获取Token
      const [error, userInfo] = await awaitWrap(getLocalTokenByUserName(userName));
      if (error) return Promise.reject(error);
      if (userInfo.token) {
        commit(types.SET_TOKEN, userInfo.token);
        Tool.data.set(local.TOKEN, userInfo.token);

        // 根据用户名获取用户信息
        const [err, tokenData] = await awaitWrap(dispatch('getIscUserInfo'));
        if (err) return Promise.reject(getResult(false, err.message || '登陆失败'));
        return Promise.resolve(
          getResult(tokenData.result, tokenData.result ? '登陆成功！' : tokenData.message),
        );
      }
      return Promise.resolve(getResult(false, userInfo.msg));
    },
    // 使用用户名登录
    async userLoginByUserName({ commit, dispatch }, userName) {
      // 通过用户名获取Token
      const [error, userInfo] = await awaitWrap(getTokenByUserName(userName));
      if (error) return Promise.reject(error);
      if (userInfo.code === 0) {
        commit(types.SET_TOKEN, userInfo.access_token);
        Tool.data.set(local.TOKEN, userInfo.access_token);

        // 根据用户名获取用户信息
        const [err, tokenData] = await awaitWrap(dispatch('getIscUserInfo', userName));
        if (err) return Promise.reject(getResult(false, err.message || '登陆失败'));

        return Promise.resolve(
          getResult(tokenData.result, tokenData.result ? '登陆成功！' : tokenData.message),
        );
      }
      return Promise.resolve(getResult(false, userInfo.msg));
    },
    // 使用ticket登录
    async userLoginByTicket({ commit, dispatch }, ticket = '') {
      // 通过ticket获取用户名
      const [errorName, loginName] = await awaitWrap(getUserNameByTicket(ticket));
      if (errorName) return Promise.reject(errorName);
      const userName = loginName.data;
      if (isEmpty(userName) || loginName.code !== 0)
        return Promise.reject(getResult(false, '未获取到用户名'));

      // 通过用户名获取Token
      const [error, userInfo] = await awaitWrap(getTokenByUserName(userName));
      if (error) return Promise.reject(error);
      if (userInfo.code === 0) {
        commit(types.SET_TOKEN, userInfo.access_token);
        Tool.data.set(local.TOKEN, userInfo.access_token);

        // 根据用户名获取用户信息
        const [err, tokenData] = await awaitWrap(dispatch('getIscUserInfo', userName));
        if (err) return Promise.reject(getResult(false, err.message || '登陆失败'));

        return Promise.resolve(
          getResult(tokenData.result, tokenData.result ? '登陆成功！' : tokenData.message),
        );
      }
      return Promise.resolve(getResult(false, userInfo.msg));
    },
    // 获取用户权限信息
    async getIscUserInfo({ commit, dispatch }, username = '') {
      // 模拟登录获取菜单、角色信息
      if (process.env.VUE_APP_SIMULATION_LOGIN === 'true') {
        const roleIndex = Tool.data.get(local.ROLE_LIST_INDEX);

        commit(types.SET_ROLE_INDEX, roleIndex || 0);
        commit(types.SET_USER_INFO, UserInfo);
        commit(types.SET_ROLE_LIST, RoleList);
        commit(types.SET_PERMISSIONS, PermissionsList);
        Tool.data.set(local.USER_INFO, UserInfo);

        // 获取数据字典
        const [errInfo, dictInfo] = await awaitWrap(userService.getMenus());
        if (errInfo) return Promise.reject(errInfo);
        Tool.data.set(local.DICT_LIST, dictInfo.dictList);

        // 获取用户当前角色的菜单
        const [err, userData] = await awaitWrap(dispatch('getMenuList'));
        if (err) return Promise.reject(err);
        return Promise.resolve(
          getResult(userData.result, userData.result ? '获取用户信息成功！' : userData.msg),
        );
      }

      // 获取用户信息
      const [errInfo, userInfo] = await awaitWrap(getUserInfo({ username }));
      if (errInfo) return Promise.reject(errInfo);
      commit(types.SET_USER_INFO, userInfo.data);
      Tool.data.set(local.USER_INFO, userInfo.data);

      // 获取角色信息、按钮权限、数据字典
      // const requestList = Promise.all([
      //   getButtonPermissions(),
      //   getUserRoleInfo(),
      //   userService.getMenus(),
      // ]);
      // const [errList, requestSet] = await awaitWrap(requestList);
      // // 请求出错直接返回错误信息
      // if (errList) return Promise.reject(errList);

      // // 只要其中一个接口返回码不为0，则返回错误信息
      // const resBool = validateResult(requestSet);
      // if (resBool) {
      //   return resBool;
      // }
      // const [
      //   permissions,
      //   roleInfo,
      //   dictInfo,
      // ] = requestSet;
      // commit(types.SET_PERMISSIONS, permissions.data);
      commit(types.SET_PERMISSIONS, PermissionsList);

      // // 数据字典
      // Tool.data.set(local.DICT_LIST, dictInfo.dictList);

      // // 判断角色是否为空
      // if (roleInfo && roleInfo.code === 0) {
      //   if (isEmpty(roleInfo.data) || roleInfo.data.length < 1) {
      //     return Promise.reject(getResult(false, '角色列表为空'));
      //   }
      // }

      // // 判断当前缓存中是否有选中角色
      // const roleIndex = Tool.data.get(types.SET_ROLE_INDEX);
      // commit(types.SET_ROLE_INDEX, roleIndex || 0);
      // commit(types.SET_ROLE_LIST, roleInfo.data);

      // 获取数据字典
      const [errDict, dictInfo] = await awaitWrap(userService.getMenus());
      if (errDict) return Promise.reject(errDict);
      // 数据字典
      Tool.data.set(local.DICT_LIST, dictInfo.dictList);

      // 获取用户当前角色的菜单
      const [err, userData] = await awaitWrap(dispatch('getMenuList'));
      if (err) return Promise.reject(err);
      return Promise.resolve(
        getResult(userData.result, userData.result ? '获取用户信息成功！' : userData.msg),
      );
    },
    // 根据角色获取菜单
    async getMenuList({ commit }) {
      // 模拟登录获取菜单信息
      if (process.env.VUE_APP_SIMULATION_LOGIN === 'true') {
        commit(types.SET_MENU_LIST, MenuList);
        Tool.data.set(local.MENU_LIST, MenuList);
        return Promise.resolve(getResult(true, '获取用户菜单成功！'));
      }

      // 获取当前角色菜单
      const [menuErr, roleMenuList] = await awaitWrap(getUserRoleMenuInfo());
      if (menuErr) return Promise.reject(menuErr);

      // 判断菜单是否为空
      if (roleMenuList && roleMenuList.code === 0) {
        if (isEmpty(roleMenuList.data) || roleMenuList.data.length < 1) {
          return Promise.resolve(getResult(false, '菜单列表为空'));
        }
      }
      const getMenuList = formatMenu(roleMenuList.data);
      commit(types.SET_MENU_LIST, getMenuList);
      Tool.data.set(local.MENU_LIST, getMenuList);
      return Promise.resolve(getResult(true, '获取用户菜单成功！'));
    },
  },
};
