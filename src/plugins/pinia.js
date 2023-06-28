import { createPinia } from 'pinia'
import { debounce } from 'xe-utils'

// 创建 pinia 实例
const pinia = createPinia()

// 增加任何 action 实现防抖功能
pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 我们正在用新的 action 来覆盖这些 action
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})

const PiniaPlugins = {};
PiniaPlugins.install = function (app) {
  // 注册pinia
  app.use(pinia);
};
export default PiniaPlugins;
