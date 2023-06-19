// 通用组件
import VcForm from './vcForm';
import VcTable from './vcTable';
import VcSetTable from './vcSetTable';
import VcToolbar from './vcToolbar';
import VcDialog from './vcDialog';
import VcBatchSearch from './vcBatchSearch';
import VcUpload from './vcUpload';
import VcUploadTable from './vcUpload/table';
import VcResult from './vcResult';
import VcSubMenu from './vcSubMenu';
import VueDialog from './vueDialog';
import VueEcharts from './vueEcharts';
import ImageSelect from './upload/ImageSelect';
import ImageUpload from './upload/ImageUpload';
import FileUpload from './upload/FileUpload';

import tool from 'utils/tool';
import * as jpIcons from 'assets/icons';
import * as icons from '@element-plus/icons-vue';

const components = {
  VcForm,
  VcTable,
  VcSetTable,
  VcToolbar,
  VcDialog,
  VcBatchSearch,
  VcResult,
  VcUpload,
  VcUploadTable,
  VcSubMenu,
};

export default {
  install(app) {
    //挂载全局对象
    app.config.globalProperties.$TOOL = tool;

    // 注册自定义组件
    Object.keys(components).forEach((name) => {
      app.component(name, components[name]);
    });

    //注册全局组件
    app.component('ImageSelect', ImageSelect);
    app.component('ImageUpload', ImageUpload);
    app.component('FileUpload', FileUpload);
    app.component('v-dialog', VueDialog);
    app.component('v-chart', VueEcharts);

    //统一注册el-icon图标
    for (let icon in icons) {
      app.component(`ElIcon${icon}`, icons[icon]);
    }
    Object.keys(icons).forEach((key) => {
      app.component(`${key}`, icons[key]);
    });

    //统一注册sc-icon图标
    for (let icon in jpIcons) {
      app.component(`${icon}`, jpIcons[icon]);
    }
  },
};
