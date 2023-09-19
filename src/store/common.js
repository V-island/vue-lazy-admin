import { defineStore } from 'pinia';
import { useAuthStore, menuStore } from 'store/auth';
import { utilFn, getResult, awaitWrap } from 'utils';

// 校验错误结果
function validateResult(results) {
  const { _get } = utilFn;
  let info = null;
  results.some((data) => {
    if (!_get(data, 'result')) {
      info = Promise.resolve(getResult(false, data.msg));
      return true;
    }
  });
  return info;
}

// 通用配置
export const commonStore = defineStore('common', {
  state: () => {
    return {
      collapsed: false,
      // iframe
      iframeSrc: '',
      iframeTitle: '',
    }
  },
  getters: {
    documentTitle() {
      return import.meta.env.VITE_APP_DOCUMENT_TITLE;
    },
    iframeURL(state) {
      const { iframeSrc } = state;
      const src = iframeSrc.substring(7);
      return src;
    },
  },
  actions: {
    onCollapsed() {
      this.collapsed = !this.collapsed;
    },
    async initUserInfoAndMenu() {
      try {
        const useAuth = useAuthStore();
        const menu = menuStore();

        // 获取角色信息、菜單
        const requestList = Promise.all([
          useAuth.getUserInfoToToken(),
          menu.getMenuListToToken(),
        ]);
        const [errList, requestSet] = await awaitWrap(requestList);

        // 请求出错直接返回错误信息
        if (errList) return Promise.reject(errList);

        // 只要其中一个接口返回码不为0，则返回错误信息
        const resBool = validateResult(requestSet);
        if (resBool) return resBool;

        return Promise.resolve(getResult(true, '初始化用戶信息成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },
});

// 全局加载
export const pageLoadingStore = defineStore('pageLoading', {
  state: () => {
    return {
      spinning: false,
      tip: '数据加载中，请稍后...',
    }
  },
  actions: {
    setLoadingStatus(show) {
      this.spinning = show;
    },
    setLoadingTip(tip) {
      this.tip = tip;
    },
  },
});