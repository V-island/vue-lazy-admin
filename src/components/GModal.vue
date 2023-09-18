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
    v-model:visible="visible"
    wrapClassName="modal-layout"
    dialogClass="modal-dialog"
    :width="width"
    :closable="false"
    :afterClose="afterClose"
    :bodyStyle="bodyStyle"
    :maskClosable="maskClosable"
    :get-container="getContainer"
    :footer="isFooter ? undefined : null"
    :zIndex="zIndex"
    centered
  >
    <template #title>
      <span>{{ title }}</span>
      <a-button class="header-button" @click="handleCancelEvent">
        <template #icon>
          <CloseOutlined />
        </template>
      </a-button>
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
    width: {
      type: String,
      default: '60%',
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
    const handleCancelEvent = () => {
      visible.value = false;
      emit('onCancel');
    };
    const afterClose = () => {
      emit('update:visible', false);
      emit('afterClose', false);
    };

    return {
      afterClose,
      handleCancelEvent,
      visible,
    };
  },
});
</script>

<style lang="scss" scoped>
.modal-layout {
  .header-button {
    float: right;
    border: 0;
    color: #00000073;
    margin-top: -4px;
    margin-right: -12px;
  }
}
</style>
