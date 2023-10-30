import router from 'router';
import { defineStore } from 'pinia';
import { KEY_TOKEN, KEY_USER_INFO } from 'config';
import { generateAsyncRoutes, resetRouter, getResult, getRsaCode, utilFn } from 'utils';
import { storage } from 'utils/browserStorage';
import { loginByEmailToToken, getMenuList } from 'api/auth';

// 登录信息
export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      userInfo: {
        userId: '',
        userName: '',
        allowUse: '',
      },
      token: '',
      isAuthenticated: true,
    };
  },
  getters: {
    userName(state) {
      const { userName } = state.userInfo;

      return userName || '仓管员';
    },
    userId(state) {
      const { userId } = state.userInfo;

      return userId || '';
    },
    allowUse(state) {
      const { allowUse } = state.userInfo;
      // 1 需求方 2 仓管员
      return `${allowUse}`;
    },
  },
  actions: {
    // 通过账号密码登录
    async loginByUserNameToToken(params) {
      try {
        // 登录
        const res = await loginByEmailToToken(params);

        if (res.code !== 200)
          return Promise.resolve(getResult(false, res.message || '请确认账号或密码是否填写正确！'));

        // 写入数据
        const result = utilFn._get(res, 'data', {});
        this.token = getRsaCode(result.token);
        this.userInfo = {
          ...result,
          token: null,
        };

        storage.set(KEY_TOKEN, this.token);
        storage.set(KEY_USER_INFO, this.userInfo);

        // 获取菜单
        const menu = menuStore();

        await menu.getMenuListToToken();

        return Promise.resolve(getResult(true, '登录成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 获取用户信息
    async getUserInfoToToken() {
      try {
        const userInfo = storage.get(KEY_USER_INFO);
        const token = storage.get(KEY_TOKEN);

        if (!userInfo || !token) throw getResult(false, result.message || '未找到当前用户信息！');

        // 写入数据
        this.userInfo = userInfo;
        this.token = token;

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
      openKeys: [],
      selectedKeys: [],
      asyncRoutes: [],
    };
  },
  getters: {
    menuAllList(state) {
      const menuList = state.menuList || [];

      // 闭包循环菜单
      const filterMenuEvent = (list) => {
        const newList = utilFn._filter(list, (item) => !item.isHidden);

        return utilFn._map(newList, (item) => {
          const children = item.children || [];

          return {
            ...item,
            children: children.length == 0 || filterMenuEvent(children),
          };
        });
      };
      return filterMenuEvent(menuList);
    },
  },
  actions: {
    async getMenuListToToken(params) {
      try {
        const result = await getMenuList(params);

        if (result.code !== 200) return Promise.resolve(getResult(false, result.message));

        const menuList = utilFn._get(result, 'data', []);

        // 如果菜单为空数组，要提示报错
        if (utilFn._isEmpty(menuList) || menuList.length < 1)
          return Promise.resolve(getResult(false, '当前用户无访问权限！'));
        // 写入数据
        this.menuList = menuList;

        // 获取处理异步路由数据
        try {
          // 生成异步路由并动态添加
          const asyncRoutes = generateAsyncRoutes(menuList);
          resetRouter();
          if (asyncRoutes.length > 0) utilFn._find(asyncRoutes, (item) => router.addRoute(item));

          this.asyncRoutes = asyncRoutes;
        } catch (e) {
          console.error(`自定义错误：[src/store/auth.js][generateAsyncRoutes]方法执行异常：`, e);
          return Promise.resolve(getResult(false, '菜单生成失败！'));
        }

        return Promise.resolve(getResult(true, '获取用户菜单成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
