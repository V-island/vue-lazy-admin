import { createApp } from 'vue'
import App from './App.vue'
import router from 'router'

import components from 'components'
import plugins from 'plugins'
import XEUtils from 'xe-utils'

import "./index.css"

// 创建Vue3实例
const app = createApp(App);

// 定义全局变量
app.config.globalProperties.$utils = {
  ...XEUtils
};

// 注册vue官方套件
app.use(router);
// 注册第三方插件
app.use(plugins);
// 注册自定义组件
app.use(components);

// 挂载app
app.mount('#app');