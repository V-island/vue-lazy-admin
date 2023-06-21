import { defineStore } from 'pinia'

// 通用配置
export const commonStore  = defineStore('common', {
  state: () => {
    return {
      collapsed: false,
    }
  },
  actions: {
    onCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
});

// 全局加载
export const pageLoadingStore  = defineStore('pageLoading', {
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