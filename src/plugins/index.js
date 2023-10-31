// 加载isBrowser
import IsBrowser from './isBrowser.js';

const DefaultPlugins = {};
DefaultPlugins.install = function (app) {
  app.use(IsBrowser);
};
export default DefaultPlugins;
