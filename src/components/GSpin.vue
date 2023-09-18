<template>
  <a-spin wrapperClassName="spin-wrapper" :spinning="spinning" :tip="tip">
    <template #indicator>
      <LoadingOutlined spin />
    </template>
    <slot></slot>
  </a-spin>
</template>
<script>
import { defineComponent } from 'vue';
import { LoadingOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  props: {
    spinning: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      default: '数据加载中，请稍后...',
    },
  },
  components: {
    LoadingOutlined,
  },
});
</script>
<style lang="scss" scoped>
.spin-wrapper {
  :deep(.ant-spin-blur) {
    opacity: 0.8;
    z-index: 1001;
  }
  :deep(.ant-spin) {
    max-height: inherit;
    z-index: 1002;
    .ant-spin-text {
      font-size: 16px;
    }
    .ant-spin-dot {
      font-size: 30px;
      margin-top: -40px !important;
    }
  }
}
</style>
