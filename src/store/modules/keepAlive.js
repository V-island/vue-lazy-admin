import * as types from '../types';

export default {
  namespaced: true,
  state: {
    viewCacheTabs: [], // 菜单缓存列表{path,label,name}
    activeView: {}, // 当前显示菜单
    isCollapse: false, // 菜单栏的展开和关闭状态
    isAccessCache: true, // 菜单栏访问缓存功能
  },
  getters: {
    //被缓存的页面组件name列表
    getCacheViews(state) {
      return state.viewCacheTabs.map(({ name }) => name);
    },
  },
  mutations: {
    // 切换菜单栏功能
    [types.TOGGLE_SIDEBAR](state) {
      state.isCollapse = !state.isCollapse;
    },
    // 存储当前激活的页面
    [types.SET_MENU_ACTIVE](state, payload) {
      state.activeView = payload;
    },
    // 添加缓存页面
    [types.SET_MENU_CACHE_VIEW](state, payload) {
      const newTabs = [...state.viewCacheTabs];
      const tab = newTabs.some(({ name }) => name === payload.name);

      if (!tab) state.viewCacheTabs.push(payload);
    },
    // 删除缓存页面
    [types.DELETE_MENU_CACHE_VIEW](state, name) {
      const newTabs = [...state.viewCacheTabs];
      const index = newTabs.findIndex((item) => item.name === name);
      if (index > -1) state.viewCacheTabs.splice(index, 1);
    },
    // 重置缓存页面
    [types.RESET_MENU_CACHE_VIEW](state) {
      state.activeView = {};
      state.viewCacheTabs = [];
    },
  },
  actions: {
    // 菜单栏展开/关闭
    onToggleSidebar({ commit }) {
      commit(types.TOGGLE_SIDEBAR);
    },
    // 存储当前激活的页面
    setActiveView({ commit }, payload) {
      commit(types.SET_MENU_ACTIVE, payload);
    },
    // 添加缓存页面
    addCacheView({ commit }, menu) {
      commit(types.SET_MENU_CACHE_VIEW, menu);
    },
    // 删除缓存页面
    deleteCacheView({ commit }, name) {
      commit(types.DELETE_MENU_CACHE_VIEW, name);
    },
  },
};
