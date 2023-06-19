import { createI18n } from 'vue-i18n';
// import tool from 'utils/tool';
import zhCN from 'vxe-table/lib/locale/lang/zh-CN';
import enUS from 'vxe-table/lib/locale/lang/en-US';
import jaJP from 'vxe-table/lib/locale/lang/ja-JP';

// Form
import enUSForm from './en-US.js';
import zhCNForm from './zh-CN.js';

const messages = {
  'zh-cn': {
    ...zhCN,
    ...zhCNForm,
  },
  en: {
    ...enUS,
    ...enUSForm,
  },
  ja: {
    ...jaJP,
  },
};
const i18n = createI18n({
  // locale: tool.data.get('APP_LANG') === 'zh' ? 'zh-cn' : tool.data.get('APP_LANG') || 'zh-cn',
  locale: 'zh-cn',
  messages,
});

export default i18n;
