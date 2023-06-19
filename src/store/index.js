import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { setItem, getItem, removeItem } from 'utils/browserStorage';
import { clone } from 'xe-utils';

// 获取modules文件夹下所有模块
const modulesFiles = require.context('./modules', false, /\.js$/);

// 将文件名作为命名空间名称
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

// 获取所有模块的state，组合成初始状态对象
const initState = Object.keys(modules).reduce((state, key) => {
  state[key] = modules[key].state;
  return state;
}, {});

// 重置状态时，使用工厂模式创建初始状态，避免状态污染
const createState = () => clone(initState, true);

// 全局mutations
const globalMutations = {
  RESET_STATE(state) {
    Object.assign(state, createState());
  },
};

// 全局actions
const globalActions = {
  resetState({ commit }) {
    commit('RESET_STATE');
  },
};

// 状态持久化插件
const statePersistencePlugin = createPersistedState({
  key: 'reportflow-web',
  storage: {
    getItem: (key) => getItem(key),
    setItem: (key, value) => setItem(key, value),
    removeItem: (key) => removeItem(key),
  },
});

export default createStore({
  modules,
  mutations: globalMutations,
  actions: globalActions,
  plugins: [statePersistencePlugin],
});
