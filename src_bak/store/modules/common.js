export default {
  namespaced: true,
  state: {
    pageLoading: false,
    loadingText: '数据加载中，请稍后...',
  },
  mutations: {
    SET_LOADING_STATUS(state, visible = false) {
      state.pageLoading = visible;
    },
    SET_LOADING_TEXT(state, loadingText) {
      state.loadingText = loadingText;
    },
  },
  actions: {},
};
