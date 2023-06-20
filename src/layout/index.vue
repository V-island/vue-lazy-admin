<template>
  <a-spin :spinning="pageLoading.spinning" :tip="pageLoading.tip">
    <a-layout class="layout">
      <a-layout-sider class="layout-sider">
        <div class="logo" />
        <!-- <MainSider /> -->
      </a-layout-sider>

      <a-layout>
        <a-layout-header class="layout-header">
          123
          <!-- <MainHead /> -->
        </a-layout-header>

        <a-layout-content class="layout-main">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-spin>
</template>

<script setup>
import { computed } from 'vue';
import { pageLoadingStore } from 'store/common';

const pageLoading = computed(() => pageLoadingStore());
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
