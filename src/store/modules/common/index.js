import { defineStore } from 'pinia';

// 通用配置
export const commonStore = defineStore('common', {
  state: () => {
    return {
      // iframe
      iframeSrc: '',
      iframeTitle: '',
      // 全局加载
      pageLoading: {
        show: false,
        description: '正在努力加载中...',
      }
    };
  },
  getters: {
    documentTitle() {
      return import.meta.env.VITE_HOLDER_TITLE;
    },
    iframeURL(state) {
      const { iframeSrc } = state;
      const src = iframeSrc.substring(7);
      return src;
    },
  },
  actions: {
    setLoading(show, description) {
      this.pageLoading.show = show;
      this.pageLoading.description = description;
    },
  },
});