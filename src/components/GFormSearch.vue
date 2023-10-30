<template>
  <g-box title="信息查询">
    <a-form
      class="g-form"
      ref="gFormRef"
      :model="model"
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

        <template v-if="isOpenMore">
          <slot name="more" />
        </template>
      </a-row>
    </a-form>
    <template #extra>
      <a-space class="button-group" align="center" :size="16">
        <a-button type="link" v-if="$slots.more" @click="onChangeEvent">
          <template v-if="isOpenMore"> 收起<UpOutlined /> </template>
          <template v-else> 展开<DownOutlined /> </template>
        </a-button>
        <a-button @click="onResetEvent">重置</a-button>
        <a-button @click="onSearchEvent" type="primary">查询</a-button>
      </a-space>
    </template>
  </g-box>
</template>

<script>
import XEUtils from 'xe-utils';
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
export default defineComponent({
  props: {
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
  components: {
    DownOutlined,
    UpOutlined,
  },
  emits: ['onChange', 'onSearch', 'onReset'],
  setup(props, { emit }) {
    const gFormRef = ref(null);
    const isOpenMore = ref(false);
    const backups = reactive(JSON.parse(JSON.stringify(props.model)));

    // 重置
    const onResetEvent = () => {
      Object.keys(backups).forEach((key) => {
        if (XEUtils.isString(backups[key])) {
          props.model[key] = backups[key];
        } else {
          props.model[key] = XEUtils.clone(backups[key], true);
        }
      });
      emit('onReset');
    };
    // 搜索
    const onSearchEvent = () => {
      emit('onSearch');
    };
    // 打开/收起
    const onChangeEvent = () => {
      isOpenMore.value = !isOpenMore.value;
      emit('onChange');
    };
    // 校验
    const validateFields = () => {
      return gFormRef.value.validateFields();
    };

    return { onChangeEvent, onResetEvent, onSearchEvent, validateFields, gFormRef, isOpenMore };
  },
});
</script>

<style lang="scss" scoped>
.button-group {
  .ant-btn {
    min-width: 90px;
  }
  .ant-btn-default {
    color: $--color-primary;
    border-color: $--color-primary;

    &:hover,
    &:active {
      background: $--color-primary-outline;
    }
  }
}
</style>
