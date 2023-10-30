/** 重置样式 */
import '@unocss/reset/tailwind.css'
import 'uno.css'
import '@/styles/global.scss'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import App from './App.vue'

// import components from '@/components';
import plugins from '@/plugins';
import { setupNaiveDiscreteApi } from '@/utils'
// import WSUtil from 'utils/WSUtil';
// import XEUtils from 'xe-utils';

// 装载工具包
import 'tools-javascript';

// 初始化APP
async function setupApp() {
  // 创建Vue3实例
  const app = createApp(App);

  // // 定义全局变量
  // app.config.globalProperties.$utils = {
  //   ...XEUtils,
  // };

  // // 注册provide方法，透传全局子组件
  // app.provide('WSUtil', WSUtil);

  // 注册pinia
  setupStore(app);

  setupNaiveDiscreteApi();

  // 装载路由
  await setupRouter(app);

  // 注册第三方插件
  app.use(plugins);
  // 注册自定义组件
  // app.use(components);

  // 挂载app
  app.mount('#app');
}

setupApp();