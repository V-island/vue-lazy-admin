/** 重置样式 */
import '@/styles/reset.css'
import 'uno.css'
import '@/styles/global.scss'

import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import App from './App.vue'

import plugins from '@/plugins';
import { setupNaiveDiscreteApi, setupXeUtilsApi } from '@/utils'

// 装载工具包
import 'tools-javascript';

// 初始化APP
async function setupApp() {
  // 创建Vue3实例
  const app = createApp(App);

  // 注册pinia
  setupStore(app);

  // 定义全局变量
  setupNaiveDiscreteApi();
  setupXeUtilsApi();

  // 装载路由
  await setupRouter(app);

  // 注册第三方插件
  app.use(plugins);

  // 挂载app
  app.mount('#app');
}

setupApp();