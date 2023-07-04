<template>
  <section class="wrapper">
    <a-menu
      mode="inline"
      theme="dark"
      v-model:openKeys="menu.openKeys"
      v-model:selectedKeys="menu.selectedKeys"
      :collapsed="common.collapsed"
      @click="handleMenuChange"
    >
      <template v-for="item in menu.menuAllList">
        <template v-if="item.children && item.children.length > 0 && item.name">
          <MainSubMenu :menu="item" />
        </template>
        <a-menu-item v-else :key="`${item.url}`">
          <span>{{ item.name }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { commonStore } from 'store/common';
import { menuStore } from 'store/auth';
import MainSubMenu from './subMenu.vue';

const route = useRoute()
const router = useRouter();
const common = commonStore();
const menu = menuStore();

// 初始化
const initLoadData = () => {
  menu.selectedKeys = [route.name];
}
/** ========== 基础事件 ============ */
const handleMenuChange = ({ key, keyPath }) => {
  menu.openKeys = keyPath;

  if (key.startsWith('http://') || key.startsWith('https://') || key.startsWith('www'))
    window.open(key, '_blank');
  else router.push({ name: key });
};

onMounted(() => {
  initLoadData();
})
</script>

<style lang="scss" scoped></style>
