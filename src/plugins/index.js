// 加载vxeTable
import VXETable from './vxeTable';

const Plugins = {};
Plugins.install = function (app) {
  // 注册vxeTable
  app.use(VXETable);
};
export default Plugins;
