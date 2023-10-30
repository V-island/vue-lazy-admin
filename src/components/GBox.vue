<template>
  <section class="box">
    <div class="box-header" v-if="title != '' && $slots.extra">
      <div class="box-head-wrapper">
        <!-- 标题 -->
        <div class="box-head-title">
          {{ title }}
        </div>

        <!-- 卡片右上角的操作区域 -->
        <div class="box-extra" v-if="$slots.extra">
          <slot name="extra" />
        </div>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="box-body">
      <slot></slot>
    </div>
  </section>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="scss" scoped>
.box {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: $--color-text-primary;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  background: $--color-white;
  border-radius: 2px;

  + .box {
    margin-top: $--layout-padding;
  }
}
.box-header {
  position: relative;
  padding: $--layout-padding;

  &::before {
    position: absolute;
    inset-block: 18px;
    left: 0;
    border-left: 3px solid $--color-primary;
    content: '';
  }
}
.box-head-wrapper {
  @include flexbox(flex-start);
}
.box-head-title {
  @include ellipsis;
  display: inline-block;
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: $--color-text-primary;
}
.box-body {
  padding: 0 $--layout-padding $--layout-padding;
}
</style>
