<template>
  <a-form
    class="g-form"
    :model="model"
    ref="gFormRef"
    :rules="rules"
    :layout="layout"
    :label-col="{
      style: {
        width: labelCol,
      },
    }"
    :wrapper-col="{
      span: wrapperCol,
    }"
  >
    <a-row :gutter="16">
      <slot></slot>
      <div class="search-group">
        <a-space align="center">
          <slot v-if="$slots.button" name="button"></slot>
        </a-space>
      </div>
    </a-row>
  </a-form>
</template>

<script>
import XEUtils from 'xe-utils';

import { defineComponent, reactive, ref } from 'vue';
export default defineComponent({
  props: {
    isShowReset: {
      type: Boolean,
      default: true,
    },
    model: {
      type: Object,
      default: () => {},
    },
    // 表单校验
    rules: {
      type: Object,
      default: () => {},
    },
    // 表单布局 horizontal/vertical/inline
    layout: {
      type: String,
      default: () => 'horizontal',
    },
    // 文字的宽度
    labelCol: {
      type: String,
      default: '70px',
    },
    // 文本框的宽度
    wrapperCol: {
      type: String,
      default: '24',
    },
  },
  emits: ['resetFun'],
  setup(props, ctx) {
    const gFormRef = ref(null);
    const backups = reactive(JSON.parse(JSON.stringify(props.model)));

    const resetForm = () => {
      Object.keys(backups).forEach((key) => {
        if (XEUtils.isString(backups[key])) {
          props.model[key] = backups[key];
        } else {
          props.model[key] = XEUtils.clone(backups[key], true);
        }
      });
      ctx.emit('resetFun');
    };

    // 验证
    const validateFields = () => {
      return gFormRef.value.validateFields();
    };

    return { resetForm, validateFields, gFormRef };
  },
});
</script>

<style lang="scss" scoped>
.search-group {
  .ant-btn {
    min-width: 65px;
    height: 32px;
  }
}
</style>
