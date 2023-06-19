import { createApp } from 'vue';
import App from './App.vue';
import router from 'router';
import store from 'store';
import VueQr from 'vue-qr';
import components from 'components';
import globalMixins from 'mixins';
import plugins from 'plugins';
import directives from 'directives';
import { EventBus, recover, recoverNotNull, pickProperties } from 'utils';
import dictUtils from 'utils/dictUtils';
import httpRequest from 'http-request';
import validator from 'utils/validator';
import XEUtils from 'xe-utils';
import VueCookies from 'vue-cookies';
import i18n from 'i18n';
import moment from 'moment';
// 引入自定义样式
import 'styles/index.scss';
// 引入阿里图标
import 'assets/icon-font/iconfont.css';

// 创建Vue3实例
const app = createApp(App);
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// 定义全局变量
window.locationRef = window.location

app.config.globalProperties.moment = moment;
app.config.globalProperties.$cookies = VueCookies;
app.config.globalProperties.$dictUtils = dictUtils;
app.config.globalProperties.recover = recover;
app.config.globalProperties.recoverNotNull = recoverNotNull;
app.config.globalProperties.pickProperties = pickProperties;
app.config.globalProperties.validator = validator;
app.config.globalProperties.$http = httpRequest.axios; // ajax请求方法
app.config.globalProperties.$utils = {
  EventBus,
  XEUtils
};

app.use(store);
app.use(router);

// 注册自定义插件
app.use(VueQr);
app.use(globalMixins);
app.use(components);
app.use(plugins);
app.use(directives);
app.use(VueCookies);
app.use(i18n);

//挂载app
app.use().mount('#app');
