<template>
    <a-layout class="layout">
      <a-layout-sider
        class="layout-sider"
        v-model:collapsed="common.collapsed"
        :trigger="null"
        collapsible
      >
        <div class="logo">logo</div>
        <!-- <MainSider /> -->
      </a-layout-sider>

      <a-layout>
        <a-layout-header class="layout-header">
          <MainHead />
        </a-layout-header>

        <a-layout-content class="layout-main">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
</template>

<script setup>
import { commonStore } from 'store/common';
import MainHead from './header.vue';

const common = commonStore();
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
}
.layout-sider {
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
.layout-header {
  background: #fff;
  padding: 0;
}
.layout-main {
  position: relative;
  overflow: auto;
  height: calc(100vh - 60px);

  .pages {
    background-color: $--color-white;
    padding: 15px 20px;
  }
}
.logo {
  @include flexbox();
  height: 64px;
  background-color: #fefefe;
  text-align: center;
  font-size: 16px;
}
.watermark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}
</style>
