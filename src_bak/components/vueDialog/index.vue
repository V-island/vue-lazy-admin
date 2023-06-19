<template>
  <div class="jp-dialog" ref="scDialog">
    <el-dialog
      ref="dialog"
      v-model="dialogVisible"
      append-to-body
      :destroy-on-close="destroyOnClose"
      :fullscreen="isFullscreen"
      v-bind="$attrs"
      :show-close="false"
      draggable
    >
      <template #title>
        <slot name="title">
          <span class="el-dialog__title">{{ title }}</span>
        </slot>
        <div class="jp-dialog__headerbtn">
          <button
            v-if="showFullscreen"
            aria-label="fullscreen"
            type="button"
            @click="setFullscreen"
          >
            <el-icon v-if="isFullscreen" class="el-dialog__close"><bottom-left /></el-icon>
            <el-icon v-else class="el-dialog__close"><full-screen /></el-icon>
          </button>
          <button v-if="showClose" aria-label="close" type="button" @click="closeDialog">
            <el-icon class="el-dialog__close"><close /></el-icon>
          </button>
        </div>
      </template>
      <div v-loading="loading">
        <slot></slot>
      </div>
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'v-dialog',
  props: {
    destroyOnClose: { type: Boolean, default: false },
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
    showClose: { type: Boolean, default: true },
    showFullscreen: { type: Boolean, default: true },
    drag: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      dialogVisible: false,
      isFullscreen: false,
    };
  },
  watch: {
    modelValue() {
      this.dialogVisible = this.modelValue;
    },
  },
  mounted() {
    this.dialogVisible = this.modelValue;
  },
  methods: {
    //关闭
    closeDialog() {
      this.dialogVisible = false;
    },
    //最大化
    setFullscreen() {
      this.isFullscreen = !this.isFullscreen;
    },
  },
};
</script>

<style scoped>
.jp-dialog__headerbtn {
  position: absolute;
  top: var(--el-dialog-padding-primary);
  right: var(--el-dialog-padding-primary);
}
.jp-dialog__headerbtn button {
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: var(--el-message-close-size, 16px);
  margin-left: 15px;
  color: var(--el-color-info);
}
.jp-dialog__headerbtn button:hover .el-dialog__close {
  color: var(--el-color-primary);
}
.jp-dialog:deep(.el-dialog).is-fullscreen {
  display: flex;
  flex-direction: column;
  top: 0px !important;
  left: 0px !important;
}
.jp-dialog:deep(.el-dialog).is-fullscreen .el-dialog__header {
}
.jp-dialog:deep(.el-dialog).is-fullscreen .el-dialog__body {
  flex: 1;
  overflow: auto;
}
.jp-dialog:deep(.el-dialog).is-fullscreen .el-dialog__footer {
  padding-bottom: 10px;
  border-top: 1px solid var(--el-border-color-base);
}
</style>
