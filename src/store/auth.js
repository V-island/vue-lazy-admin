import router from 'router'
import { defineStore } from 'pinia';
import { KEY_TOKEN, KEY_USER_INFO } from 'config';
import { generateAsyncRoutes, resetRouter, getResult, utilFn } from 'utils';
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

        if (res.code !== 200) return Promise.resolve(getResult(false, res.message || '请确认账号或密码是否填写正确！'));

        // 写入数据
        const result = utilFn._get(res, 'data[0]', {});
        this.token = result.token;
        this.userInfo = result;

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
        const { id } = storage.get(KEY_USER_INFO);
        const result = await getUserInfo({ id });

        if (!result) return Promise.resolve(getResult(false, result.message || '未找到当前用户信息！'));

        // 写入数据
        this.userInfo = result.data;

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
    }
  },
  getters: {
    menuAllList(state) {
      return state.menuList || []
    },
  },
  actions: {
    async getMenuListToToken(params) {
      try {
        const result = await getMenuList(params);

        if (result.code !== 200) return Promise.resolve(getResult(false, result.message));

        const menuList = utilFn._get(result, 'data', []);
        // 如果菜单为空数组，要提示报错
        if (utilFn._isEmpty(menuList) || menuList.length < 1) return Promise.resolve(getResult(false, '当前用户无访问权限！'));
        // 写入数据
        this.menuList = menuList;

        // 获取处理异步路由数据
        try {
          // 生成异步路由并动态添加
          const asyncRoutes = generateAsyncRoutes(menuList);
          resetRouter();
          if (asyncRoutes.length > 0)
            utilFn._find(asyncRoutes, item => router.addRoute(item));

          this.asyncRoutes = asyncRoutes;
        } catch (e) {
          console.error(
            `自定义错误：[src/store/auth.js][generateAsyncRoutes]方法执行异常：`,
            e,
          );
          return Promise.resolve(getResult(false, '菜单生成失败！'));
        }

        return Promise.resolve(getResult(true, '获取用户菜单成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});