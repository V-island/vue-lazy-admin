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
export default {
  name: 'VcToolbar',
  props: {
    // 居中
    center: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.toolbar {
  padding: 0;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;

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
::v-deep {
  .el-dropdown {
    margin-left: 12px;
  }
}
</style>
