// import auth from './auth';
// import time from './time';
import noMoreClick from './noMoreClick';

export default {
  install(app) {
    //注册全局指令
    // app.directive('auth', auth);
    // app.directive('time', time);
    app.directive('noMoreClick', noMoreClick);
  },
};
