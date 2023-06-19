import 'normalize.css/normalize.css';
import { createI18n } from 'vue-i18n';
import I18nLang from './lang';

// 加载设计器
import MakingForm from './components/Container.vue';
import GenerateForm from './components/GenerateForm.vue';

// 加载图标样式
import './icon/iconfont/iconfont.css';
import './icon/iconfont2/iconfont.css';
import './styles/index.scss';

const expire = 253402271999000;
const version = '3.1.0';

const loadOptions = (opts) => {
  window.FormMaking_OPTIONS = {
    ...opts,
    aceurl: opts.aceurl,
    key: '0320200117005',
    version,
  };
};
const i18n = createI18n({
  locale: 'en',
  // fallbackLocale: 'zh-cn',
  messages: I18nLang,
});

MakingForm.install = function (
  app,
  opts = {
    locale: 'en',
  },
) {
  if (expire >= new Date().getTime()) {
    app.component(MakingForm.name, MakingForm);
  }
  app.use(i18n);
  i18n.global.locale = opts.locale;
  loadOptions(opts);

  return app;
};

GenerateForm.install = function (
  app,
  opts = {
    locale: 'en',
  },
) {
  if (expire >= new Date().getTime()) {
    app.component(GenerateForm.name, GenerateForm);
  }
  app.use(i18n);
  i18n.global.locale = opts.locale;
  loadOptions(opts);
};

const components = [MakingForm, GenerateForm];

const install = function (
  app,
  opts = {
    locale: 'en',
    components: [],
  },
) {
  opts = {
    key: '0320200117005',
    locale: 'en',
    components: [],
    ...opts,
  };

  app.use(i18n);

  i18n.global.locale = opts.locale;

  if (expire >= new Date().getTime()) {
    components.forEach((component) => {
      app.component(component.name, component);
    });

    opts.components &&
      opts.components.forEach((item) => {
        app.component(item.name, item.component);
      });
  }
  loadOptions(opts);
};

export { install, MakingForm, GenerateForm, i18n };

export default {
  install,
  MakingForm,
  GenerateForm,
};
