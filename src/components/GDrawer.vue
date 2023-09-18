<template>
  <a-drawer
    class="gxDrawer"
    v-model:visible="visible"
    :closable="false"
    :afterClose="afterClose"
    :maskClosable="maskClosable"
    placement="right"
    centered
    @afterVisibleChange="afterVisibleChange"
  >
    <template #title>
      <div class="drawer-title">
        <span>{{ title }}</span>
        <a-button class="headerButton" @click="afterClose">
          <template #icon>
            <CloseOutlined />
          </template>
        </a-button>
      </div>
    </template>
    <slot></slot>
  </a-drawer>
</template>

<script>
import { computed, defineComponent, watch, ref } from 'vue';
import { CloseOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '对话框',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    CloseOutlined,
  },
  setup(props, { emit }) {
    const visible = ref(null);
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
    const afterClose = () => {
      emit('update:visible', false);
      emit('afterClose', false);
    };
    const afterVisibleChange = () => {
      if (!visible.value) {
        afterClose();
      }
    };

    return {
      afterClose,
      visibles,
      afterVisibleChange,
    };
  },
});
</script>

<style lang="less" scoped>
.drawer-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .headerButton {
    float: right;
    border: 0;
    color: #00000073;
  }
}
</style>
