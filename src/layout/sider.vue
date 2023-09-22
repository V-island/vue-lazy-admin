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
        <template v-if="!item.isHidden">
          <template v-if="item.children && item.children.length > 0 && item.title">
            <MainSubMenu :key="formatMenuUrl(`${item.title}`)" :menu="item" />
          </template>
          <a-menu-item v-else :key="formatMenuUrl(`${item.url || 'home'}`)">
            <template v-if="item.customIcon" #icon>
              <g-svg-icon :name="item.customIcon" :svgStyle="{ width: '22px', height: '22px' }" />
            </template>
            <span>{{ item.title }}</span>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
  </section>
</template>

<script setup>
import { onMounted, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { commonStore } from 'store/common';
import { menuStore } from 'store/auth';
import { formatMenuUrl } from 'utils';
import MainSubMenu from './subMenu.vue';

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const common = commonStore();
const menu = menuStore();
// 初始化
const initLoadData = () => {
  menu.selectedKeys = [route.name];
};
/** ========== 基础事件 ============ */
const handleMenuChange = ({ key, keyPath }) => {
  menu.openKeys = keyPath;

  // 判断是否属于外链菜单
  if (key.startsWith('http://') || key.startsWith('https://') || key.startsWith('www'))
    return window.open(key, '_blank');

  // 判断是否属于iframe页面嵌套菜单
  if (key.startsWith('iframe:')) {
    common.iframeSrc = key;
    return router.push({
      name: 'iframePage',
      query: {
        iframeSrc: key,
      },
    });
  }

  router.push({ name: key });
};

onMounted(() => {
  initLoadData();
});
</script>

<style lang="scss" scoped></style>
