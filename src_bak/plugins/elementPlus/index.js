import ElementUI from 'element-plus';
// 引入自定义样式
import './ele-theme/index.scss';

// 修改 el-dialog 默认点击遮罩层不关闭
// ElementUI.Dialog.props.closeOnClickModal.default = false;

const Element = {};
Element.install = function (Vue) {
  Vue.use(ElementUI, { size: 'default' });
};
export default Element;
