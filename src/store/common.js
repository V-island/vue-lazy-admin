import { defineStore } from 'pinia'

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
})