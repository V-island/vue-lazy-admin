<template>
  <a-card
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
        <gx-svg-icon v-if="icon" :name="icon"></gx-svg-icon>
        <slot v-if="$slots.title" name="title" />
        <div class="card-title" v-else>{{ title }}</div>
      </a-space>
    </template>
    <slot></slot>
  </a-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "default",
    },
    height: {
      type: String,
      default: "",
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
        borderWidth: 0,
        padding: "0 20px",
      },
    },
    bodyStyle: {
      type: Object,
      default: {
        padding: "0 20px 20px 20px !important",
        minHeight: "200px",
      },
    },
  },
});
</script>

<style lang="less" scoped>
.card-title {
  font-weight: 600;
  color: #202f40;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
