// 加载pinia
// 加载vxeTable
import Pinia from './pinia.js';
import VXETable from './vxeTable';

const DefaultPlugins = {};
DefaultPlugins.install = function (app) {
  // 注册pinia
  app.use(Pinia);
  // 注册vxeTable
  app.use(VXETable);
};
export default DefaultPlugins;
