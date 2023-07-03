import { defineStore } from 'pinia';
import { KEY_TOKEN } from 'config';
import { utilFn, getResult, awaitWrap } from 'utils';
import { storage } from 'utils/browserStorage';
import { loginByEmailToToken, getRoleList, getUserInfo, getMenuList, getPermissionList } from 'api/auth';

// 登录信息
export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      token: '',
      isAuthenticated: true,
      userInfo: {},
    }
  },
  getters: {
    username(state) {
      return state.userInfo?.realName || '游客'
    },
  },
  actions: {
    async loginByEmailToToken(params) {
      try {
        // 登录
        const res = await loginByEmailToToken(params);

        if(res.code !== 200) return Promise.resolve(getResult(false, res.message || '请确认账号或密码是否填写正确！'));

        // 写入数据
        const result = utilFn._get(res, 'data[0]', {});
        this.token = result.token;
        this.userInfo = result;

        storage.set(KEY_TOKEN, this.token);

        // 获取菜单
        const menu = menuStore();

        await menu.getMenuListToToken();

        return Promise.resolve(getResult(true, '登录成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 获取用户信息
    async getUserInfoToToken(params) {
      try {
        const res = await getUserInfo(params);

        if(!res) return Promise.resolve(getResult(false, res.message || '未找到当前用户信息！'));

        // 写入数据
        this.userInfo = result;

        return Promise.resolve(getResult(true, '获取用户信息成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});

// 菜单信息
export const menuStore = defineStore('menu', {
  state: () => {
    return {
      menuList: [],
    }
  },
  getters: {
    menuAllList(state) {
      console.log(state.menuList);
      return state.menuList || []
    },
  },
  actions: {
    async getMenuListToToken(params) {
      try {
        const result = await getMenuList(params);

        if(result.code !== 200) return Promise.resolve(getResult(false, result.message || '当前用户无访问权限！'));

        // 写入数据
        this.menuList = utilFn._get(result, 'data', []);

        return Promise.resolve(getResult(true, '获取菜单列表信息成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});