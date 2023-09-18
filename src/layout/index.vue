<template>
  <a-layout class="layout">
    <a-layout-sider
      class="layout-sider"
      v-model:collapsed="common.collapsed"
      :trigger="null"
      collapsible
    >
      <div class="logo">{{ common.documentTitle }}</div>
      <MainSider />
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="layout-header">
        <MainHead />
      </a-layout-header>

      <a-layout-content class="layout-main">
        <router-view class="pages"></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { utilFn, awaitWrap } from 'utils';
import { message } from 'ant-design-vue';
import { commonStore } from 'store/common';
import MainHead from './header.vue';
import MainSider from './sider.vue';

const router = useRouter();
const common = commonStore();

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
};
onMounted(() => {
  initLoadData();
});
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
}
.layout-sider {
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
.layout-header {
  background: $--color-white;
  padding: 0;
}
.layout-main {
  position: relative;
  overflow: auto;
  // height: calc(100vh - 60px);
  height: auto;
  padding: 15px 20px;
}
.logo {
  @include flexbox();
  height: 64px;
  color: $--color-white;
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
