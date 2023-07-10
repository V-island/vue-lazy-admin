import i18n from 'plugins/i18n.js'
import {
  // 全局对象
  VXETable,

  // 表格功能
  Filter,
  Edit,
  Menu,
  Export,
  Keyboard,
  Validator,

  // 可选组件
  Icon,
  Column,
  Colgroup,
  Grid,
  Tooltip,
  Toolbar,
  Pager,
  Form,
  FormItem,
  FormGather,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Switch,
  Input,
  Select,
  Optgroup,
  Option,
  Textarea,
  Button,
  Modal,
  List,
  Pulldown,

  // 表格
  Table
} from 'vxe-table';
// import 'vxe-table/lib/style.css';
// 引入自定义样式
import './style.scss';

VXETable.setup({
  // 对组件内置的提示语进行国际化翻译
  // i18n: (key, args) => i18n.global.t(key, args),
  // 可选，对参数中的列头、校验提示.等进行自动翻译（只对支持国际化的有效）
  translate(key, args) {
    // 例如，只翻译 "app." 开头的键值
    if (key && key.indexOf('app.') > -1) {
      return i18n.global.t(key, args)
    }
    return key
  }
})

const vxeTable = {};
vxeTable.install = function (app) {
  // 表格功能
  app.use(Filter)
    .use(Edit)
    .use(Menu)
    .use(Export)
    .use(Keyboard)
    .use(Validator)

  // 可选组件
  app.use(Icon)
    .use(Column)
    .use(Colgroup)
    .use(Grid)
    .use(Tooltip)
    .use(Toolbar)
    .use(Pager)
    .use(Form)
    .use(FormItem)
    .use(FormGather)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Radio)
    .use(RadioGroup)
    .use(RadioButton)
    .use(Switch)
    .use(Input)
    .use(Select)
    .use(Optgroup)
    .use(Option)
    .use(Textarea)
    .use(Button)
    .use(Modal)
    .use(List)
    .use(Pulldown)

    // 安装表格
    .use(Table)
};
export default vxeTable;
