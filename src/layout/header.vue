<template>
  <section class="wrapper">
    <div class="left">
      <div class="trigger" @click="common.onCollapsed()">
        <menu-unfold-outlined v-if="common.collapsed" />
        <menu-fold-outlined v-else />
      </div>
    </div>
    <div class="main">
      <a-dropdown>
        <span class="ant-dropdown-link" @click.prevent>
          <a-avatar :size="32">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          {{ useAuth.username }}
          <DownOutlined />
        </span>
        <template #overlay>
          <a-menu @click="onClickEvent">
            <a-menu-item key="quit"> 退出 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </section>
</template>

<script setup>
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';
import { commonStore } from 'store/common';
import { useAuthStore } from 'store/auth';
import { clearAppState, toLoginPage } from 'utils';

const common = commonStore();
const useAuth = useAuthStore();

const onClickEvent = ({ key }) => {
  if (key == 'quit') {
    clearAppState();
    toLoginPage('#/login');
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  @include flexbox(space-between);
  width: 100%;

  .main {
    @include flexbox();
    padding: 0 24px;
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
