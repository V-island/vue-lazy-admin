import { defineStore } from 'pinia'
import { UserInfo, MenuList } from 'config';
// 登录信息
export const authStore = defineStore('auth', {
  state: () => {
    return {
      token: '',
    }
  },
  actions: {
    setToken(token) {
      this.token = token;
    },
  },
});

// 用户信息
export const menuStore = defineStore('menu', {
  state: () => {
    return {
      menuList: [],
    }
  },
  actions: {
    setMenuList(menu) {
      this.menuList = menu || MenuList;
    },
  },
});

// 用户信息
export const userStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {},
    }
  },
  actions: {
    setUserInfo(user) {
      this.userInfo = user || UserInfo;
    },
  },
});