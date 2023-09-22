<template>
  <a-card
    class="card-box"
    :loading="loading"
    :size="size"
    :headStyle="headStyle"
    :bodyStyle="{ ...bodyStyle, height }"
    :bordered="bordered"
  >
    <!-- 卡片右上角的操作区域 -->
    <template v-if="$slots.extra" #extra><slot name="extra" /></template>
    <!-- 卡片封面 -->
    <template v-if="$slots.cover" #cover><slot name="cover" /></template>
    <!-- 卡片操作组，位置在卡片底部 -->
    <template v-if="$slots.actions" #actions><slot name="actions" /></template>
    <!-- 卡片标题 -->
    <template #title>
      <a-space align="center" :size="2">
        <g-svg-icon
          v-if="icon"
          :name="icon"
          :svgStyle="{ width: '20px', height: '20px' }"
        ></g-svg-icon>
        <slot v-if="$slots.title" name="title" />
        <div class="card-title" v-else>{{ title }}</div>
      </a-space>
    </template>
    <slot></slot>
  </a-card>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'default',
    },
    height: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    headStyle: {
      type: Object,
      default: {
        borderWidth: '1px',
        padding: '0 20px',
      },
    },
    bodyStyle: {
      type: Object,
      default: {
        padding: '10px 20px !important',
        minHeight: '100px',
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.card-box {
  border-radius: 6px;
  box-shadow: 1px 1px 3px rgba(16, 37, 76, 0.05), 3px 3px 6px rgba(16, 37, 76, 0.05);
}
.card-title {
  font-weight: 600;
  color: #202f40;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-left: 5px;
}
</style>
