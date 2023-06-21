<template>
  <section class="wrapper">
    <div class="left">
      <div class="trigger" @click="common.onCollapsed()">
        <menu-unfold-outlined v-if="common.collapsed" />
        <menu-fold-outlined v-else />
      </div>
    </div>
    <div class="main">
      <a-avatar :size="64">
        <template #icon><UserOutlined /></template>
      </a-avatar>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { commonStore } from 'store/common';

const common = commonStore();
</script>

<style lang="scss" scoped>
.wrapper {
  @include flexbox(space-between);
  width: 100%;

  .main {
    @include flexbox();
  }
}
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: $--color-primary;
  }
}
</style>
