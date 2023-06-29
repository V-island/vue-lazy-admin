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
    async loginByEmailToToken(token) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // 让表单组件显示错误
        return error
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
  getters: {
    username(state) {
      return state.userInfo.realName
    },
  },
  actions: {
    setUserInfo(user) {
      this.userInfo = user || UserInfo;
    },
  },
});