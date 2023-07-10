// 加载pinia
import Pinia from './pinia.js';
// 加载i18n
import i18n from './i18n.js';
// 加载vxeTable
import VXETable from './vxeTable';

const DefaultPlugins = {};
DefaultPlugins.install = function (app) {
  // 注册pinia
  app.use(Pinia);
  // 注册i18n
  app.use(i18n);
  // 注册vxeTable
  app.use(VXETable);
};
export default DefaultPlugins;
