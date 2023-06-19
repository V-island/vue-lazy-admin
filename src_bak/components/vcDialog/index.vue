<template>
  <el-dialog
    class="dialog"
    v-loading="loading"
    :model-value="visible"
    :width="width"
    :modal="modal"
    :center="center"
    :show-close="showClose"
    :modal-append-to-body="modalAppendToBody"
    :append-to-body="appendToBody"
    :fullscreen="fullscreen"
    destroy-on-close
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="closeModal"
    @closed="$emit('closed')"
  >
    <template #header>
      <slot name="title" v-if="$slots.title"></slot>
      <span v-else class="el-dialog__title">{{ title }}</span>
    </template>
    <section class="content" v-if="visible">
      <slot></slot>
    </section>
    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'VcDialog',
  props: {
    // 是否显示 Dialog
    visible: {
      type: Boolean,
      default: false,
    },
    // Dialog 的标题
    title: {
      type: String,
      default: '对话框',
    },
    // Dialog 的宽度
    width: {
      type: String,
      default: '50%',
    },
    // Dialog CSS 中的 margin-top 值
    top: {
      type: String,
      default: '15vh',
    },
    // 是否需要遮罩层
    modal: {
      type: Boolean,
      default: true,
    },
    // 是否对头部和底部采用居中布局
    center: {
      type: Boolean,
      default: false,
    },
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: true,
    },
    // 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
    modalAppendToBody: {
      type: Boolean,
      default: true,
    },
    // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
    appendToBody: {
      type: Boolean,
      default: false,
    },
    // 是否显示加载
    loading: {
      type: Boolean,
      default: false,
    },
    // 是否为全屏 Dialog
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit('update:visible', false);
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  // padding: 20px;
  font-size: 14px;
  word-break: break-all;
  overflow: hidden;
}
.header-button {
  position: absolute;
  top: 14px;
  right: 20px;
  padding: 0;
  background: 0 0;
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 18px;
  color: #fff;
}
::v-deep {
  .el-dialog {
    border-radius: 5px;
  }
  .el-dialog__header {
    // padding: 13px 20px;
    border-radius: 5px 5px 0 0;

    .el-dialog__title {
      font-size: 18px;
    }
    .el-dialog__headerbtn {
      // top: 15px;
    }
  }
  .el-dialog__body,
  .el-dialog--center .el-dialog__body {
    padding: 10px !important;
  }
}
</style>
