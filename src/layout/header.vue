<template>
  <section class="wrapper">
    <!-- logo区域 -->
    <div class="logo">
      <img src="~@/assets/images/logo-header.png" :alt="common.documentTitle" />
      <span>{{ common.documentTitle }}</span>
    </div>
    <!-- 菜单区域 -->
    <div class="main">
      <MainSider />
    </div>
    <!-- 操作区域 -->
    <div class="right">
      <a-space :size="16" align="start">
        <div class="user-box">
          <g-svg-icon name="g-user" :svgStyle="{ width: '26px', height: '26px' }" />
          {{ useAuth.userName }}
        </div>
        <a-button type="link" @click="onLogoutEvent">
          <template #icon>
            <g-svg-icon name="g-logout" :svgStyle="{ width: '24px', height: '24px' }" />
          </template>
        </a-button>
      </a-space>
    </div>
  </section>
</template>

<script setup>
import { commonStore } from 'store/common';
import { useAuthStore } from 'store/auth';
import { clearAppState, toLoginPage } from 'utils';
import MainSider from './sider.vue';

const common = commonStore();
const useAuth = useAuthStore();

const onLogoutEvent = () => {
  clearAppState();
  toLoginPage('#/login');
};
</script>

<style lang="scss" scoped>
.wrapper {
  @include flexbox(space-between);
  width: 100%;
  height: 100%;
  color: $--color-white;

  .main {
    flex: 1 0 0;
    padding: 0 32px;
    height: 100%;
  }
  .right {
    @include flexbox();
    height: 100%;
  }
}

.logo {
  @include flexbox();
  color: $--color-white;
  text-align: center;
  font-size: 16px;

  > img {
    @include wh(180px, 46px);
  }
  > span {
    margin-left: $--layout-padding;
    font-size: 24px;
    font-weight: 500;
  }
}

.user-box {
  @include flexbox();
  position: relative;
  padding: 4px 15px;

  > .svg-icon {
    margin-right: 10px;
  }
  &::after {
    position: absolute;
    inset-block: 26px;
    right: 0;
    border-left: 1px solid $--color-white;
    content: '';
  }
}
</style>
