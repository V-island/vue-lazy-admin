import { createApp } from 'vue'
import App from './App.vue'
import router from 'router'

import { createPinia } from 'pinia'
import components from 'components'
import plugins from 'plugins'
import XEUtils from 'xe-utils'

import "./index.css"

// 创建 pinia 实例
const pinia = createPinia()
// 创建Vue3实例
const app = createApp(App);

// 定义全局变量
app.config.globalProperties.$utils = {
  XEUtils
};

app.use(router);
app.use(pinia);

// 注册自定义插件
app.use(components);
app.use(plugins);

//挂载app
app.mount('#app');