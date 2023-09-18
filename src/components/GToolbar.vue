<template>
  <section class="toolbar" :class="!center || 'center'">
    <div class="left">
      <slot></slot>
    </div>
    <div class="right" v-if="$slots.right">
      <slot name="right"></slot>
    </div>
  </section>
</template>
<script>
import { defineComponent, computed, watch, ref } from 'vue';

export default defineComponent({
  props: {
    // 居中
    center: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
<style lang="scss" scoped>
.toolbar {
  @include flexbox(flex-start);
  margin-bottom: 12px;
  padding: 0;
  display: flex;

  &.center {
    justify-content: center;

    > .left {
      flex-grow: initial;
    }
  }
}
.left {
  flex-grow: 1;
}
.right {
  flex-grow: 0;
}
:deep(.el-dropdown) {
  margin-left: 12px;
}
</style>
