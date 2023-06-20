import VXETable from 'vxe-table';
// import 'vxe-table/lib/style.css';
// 引入自定义样式
import './style.scss';

const vxeTable = {};
vxeTable.install = function (app) {
  app.use(VXETable);
  // 给 vue 实例挂载内部对象，例如：
  // app.config.globalProperties.$XModal = VXETable.modal
  // app.config.globalProperties.$XPrint = VXETable.print
  // app.config.globalProperties.$XSaveFile = VXETable.saveFile
  // app.config.globalProperties.$XReadFile = VXETable.readFile
};
export default vxeTable;
