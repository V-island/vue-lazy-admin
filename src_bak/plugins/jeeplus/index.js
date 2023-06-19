import VueClipboard from 'vue-clipboard2';

// 测试工具
import JeeplusDevtools from './devtools/jeeplus-devtools-v3.umd.min';
// import JeeplusDevtools from 'jeeplus-devtools-v3';

// 流程设计器
import JeeplusFlow from './flowable/jeeplus-flowable.umd';
import './flowable/jeeplus-flowable.css';
// import JeeplusFlow from 'jeeplus-flowable-v3';
// import 'jeeplus-flowable-v3/lib/jeeplus-flowable.css';

// 表单设计器
// import FormMaking from './form/form-making-v3.umd';
// import './form/index.css';
// import FormMaking from 'jeeplus-form-v3/dist/form-making-v3.umd';
// import 'jeeplus-form-v3/dist/index.css';

// 富文本编辑器
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const Jeeplus = {};
Jeeplus.install = function (app) {
  app.use(VueClipboard);
  app.use(JeeplusDevtools);
  app.use(JeeplusFlow);
  // app.use(FormMaking, {
  //   locale: 'zh-cn',
  // });
  app.component('QuillEditor', QuillEditor);
};
export default Jeeplus;
