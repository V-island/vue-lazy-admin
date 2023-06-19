// 设置其他框架/组件
import ElementUI from './elementPlus';

// 加载表单设计器
import FormBuilder from './formBuilder';

// 加载Jeeplus
import Jeeplus from './jeeplus';

// 加载vxeTable
import VXETable from './vxeTable';

const Plugins = {};
Plugins.install = function (app) {
  // 注册Element-UI
  app.use(ElementUI);
  // 注册表单设计器
  app.use(FormBuilder, {
    locale: 'zh-cn',
  });
  // 注册Jeeplus
  app.use(Jeeplus);
  // 注册vxeTable
  app.use(VXETable);
};
export default Plugins;
