import { createApp } from 'vue'
import App from './App.vue'
import router from 'router'

import { createPinia } from 'pinia'
// import globalMixins from 'mixins'
// import components from 'components'
// import plugins from 'plugins'
// import directives from 'directives'
import XEUtils from 'xe-utils'

import "./index.css"

// 创建 pinia 实例
const pinia = createPinia()
// 创建Vue3实例
const app = createApp(App);

// 定义全局变量
app.config.globalProperties.$utils = {
  // EventBus,
  XEUtils
};

app.use(router);
app.use(pinia);

// 注册自定义插件
// app.use(globalMixins);
// app.use(components);
// app.use(plugins);
// app.use(directives);
// app.use(i18n);

//挂载app
app.mount('#app');