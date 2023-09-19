// 加载pinia
import Pinia from './pinia.js';
// 加载isBrowser
import IsBrowser from './isBrowser.js';
// 加载滚动条
import SimpleBar from './simpleBar.js';
// 加载代码高亮
import HighlightJS from './highlightJS.js';

const DefaultPlugins = {};
DefaultPlugins.install = function (app) {
  app.use(Pinia);
  app.use(IsBrowser);
  app.use(SimpleBar);
  app.use(HighlightJS);
};
export default DefaultPlugins;
