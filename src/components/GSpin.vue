<template>
  <a-spin wrapperClassName="spin-wrapper" :spinning="spinning" :tip="tip">
    <template #indicator>
      <Loading3QuartersOutlined spin />
    </template>
    <slot></slot>
  </a-spin>
</template>
<script>
import { defineComponent } from 'vue';
import { Loading3QuartersOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  props: {
    spinning: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      default: '正在努力加载中...',
    },
  },
  components: {
    Loading3QuartersOutlined,
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
    color: $--color-primary;

    .ant-spin-text {
      font-size: 20px;
      font-weight: 500;
    }
    .ant-spin-dot {
      font-size: 38px;
      margin-top: -50px !important;
    }
  }
}
</style>
