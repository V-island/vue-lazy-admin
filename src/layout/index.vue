<template>
  <a-layout class="layout">
    <!-- 头部 -->
    <a-layout-header class="layout-header">
      <MainHead />
    </a-layout-header>

    <!-- 面包屑 -->
    <MainBreadcrumb />

    <!-- 内容区域 -->
    <a-layout-content class="layout-main">
      <router-view class="pages"></router-view>
      <div class="watermark"></div>
      <a-layout-footer class="layout-footer"> wms ©1998-2023 </a-layout-footer>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { utilFn, awaitWrap, createWatermark } from 'utils';
import { message } from 'ant-design-vue';
import { commonStore } from 'store/common';
import { cacheStore } from 'store/cache';
import { useAuthStore } from 'store/auth';
import MainHead from './header.vue';
import MainBreadcrumb from './breadcrumb.vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const common = commonStore();
const cache = cacheStore();
const useAuth = useAuthStore();

/** =========== 初始化 ============ */
const initLoadData = async () => {
  utilFn._showPageLoading();
  // 登录获取用户信息、角色、菜单等数据
  let [err, data] = await awaitWrap(common.initUserInfoAndMenu());

  if (err || !data.result) {
    message.error('该用户没有权限');
    router.replace({ path: '/403' });
  }
  utilFn._hidePageLoading();

  // 添加水印
  createWatermark(
    `${useAuth.userName} ${proxy.$utils.toDateString(new Date(), 'yyyy-MM-dd')}`,
    '.watermark',
    -20,
    'rgba(144,147,153,0.1)',
  );

  initLocalCache();
};

/** ============== 基础事件 =============== */
// 本地存储
const initLocalCache = async () => {
  // 初始化本地枚举
  cache.getDeviceTypeList();
  cache.getDateTypeList();
};

onMounted(() => {
  initLoadData();
});
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
}
.layout-sider {
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
.layout-header {
  background: $--header-color-bg;
  width: 100%;
  height: $--header-height;
  padding: $--header-padding;
}
.layout-main {
  position: relative;
  overflow: auto;
  height: auto;
}
.layout-footer {
  @include flexbox();
  height: $--footer-height;
  color: $--footer-color;
  background: $--footer-color-bg;
}
.pages {
  padding: $--layout-padding;
  min-height: calc(100vh - $--header-height - $--breadcrumb-height - $--footer-height);
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
