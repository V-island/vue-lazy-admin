<!--
  通用弹窗模板

  示例：
  <gx-modal :title="config.title" v-model:visible="config.show">
    <textarea placeholder="请输入"></textarea>
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk">确认回退</a-button>
    </template>
  </gx-modal>
-->

<template>
  <a-modal
    v-model:open="visible"
    :wrapClassName="`modal-layout ${isFooter || 'not-footer'}`"
    :width="layoutWidth"
    :closable="closable"
    :afterClose="afterClose"
    :bodyStyle="bodyStyle"
    :maskClosable="maskClosable"
    :get-container="getContainer"
    :footer="isFooter ? undefined : null"
    :zIndex="zIndex"
    @cancel="handleCancelEvent"
    centered
  >
    <template #title>
      <slot v-if="$slots.title" name="title"></slot>
      <span v-else>{{ title }}</span>
    </template>
    <template #closeIcon>
      <CloseOutlined />
    </template>
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </a-modal>
</template>

<script>
import { computed, defineComponent, watch, ref } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
    closable: {
      type: Boolean,
      default: true,
    },
    maskClosable: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isFooter: {
      type: Boolean,
      default: true,
    },
    bodyStyle: {
      type: Object,
      default: () => {},
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
    getContainer: false,
  },
  components: {
    CloseOutlined,
  },
  setup(props, { emit }) {
    const visible = ref(false);

    const layoutWidth = computed(() => {
      const { size } = props;

      if (size == 'small') return '30%';
      else if (size == 'large') return '98%';
      return '75%';
    });

    const handleCancelEvent = () => {
      visible.value = false;
      emit('onCancel');
    };
    const afterClose = () => {
      emit('update:visible', false);
      emit('afterClose', false);
    };

    watch(
      () => props.visible,
      (val) => {
        visible.value = val;
      },
      {
        immediate: true,
        deep: true,
      },
    );

    return {
      afterClose,
      handleCancelEvent,
      visible,
      layoutWidth,
    };
  },
});
</script>

<style lang="scss">
.modal-layout {
  .ant-modal-header,
  .ant-modal-body,
  .ant-modal-footer {
    background: #f4f7f6;
    padding: $--layout-padding;
    margin: 0;
  }
  .ant-modal-title {
    color: $--color-white;
    font-size: 16px;
    font-weight: 600;
  }
  .ant-modal-content {
    padding: 0;
    background: transparent;
  }
  .ant-modal-header {
    padding: $--layout-padding 24px;
    background: $--color-primary;
    border-radius: 10px 10px 0 0;
  }
  .ant-modal-close {
    color: $--color-white;

    &:hover {
      color: $--color-text-placeholder;
    }
  }
  .ant-modal-body {
    padding: $--layout-padding;
  }
  .ant-modal-footer {
    @include flexbox();
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    border-radius: 0 0 10px 10px;

    .ant-btn {
      min-width: 80px;
    }
  }

  &.not-footer {
    .ant-modal-body {
      border-radius: 0 0 10px 10px;
    }
  }
}
</style>
