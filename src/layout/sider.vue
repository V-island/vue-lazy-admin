<template>
  <section class="wrapper">
    <a-menu
      mode="horizontal"
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
            <!-- <template v-if="item.customIcon" #icon>
              <g-svg-icon :name="item.customIcon" :svgStyle="{ width: '22px', height: '22px' }" />
            </template> -->
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

<style lang="scss" scoped>
.wrapper {
  @include flexbox(space-between);
  width: 100%;
  height: 100%;
  color: $--color-white;

  :deep(.ant-menu) {
    border-width: 0;
    background-color: transparent;
    color: $--color-white;
    height: calc(100% - 2px);
    line-height: 88px;
    font-size: 20px;

    &:not(.ant-menu-dark) {
      > .ant-menu-item:hover,
      > .ant-menu-submenu:hover,
      > .ant-menu-item-active,
      > .ant-menu-submenu-active,
      > .ant-menu-item-open,
      > .ant-menu-submenu-open,
      > .ant-menu-item-selected,
      > .ant-menu-submenu-selected {
        color: $--color-white;

        .ant-menu-submenu-arrow {
          transform: rotate(90deg);
        }
      }

      > .ant-menu-item:hover::after,
      > .ant-menu-item-active::after,
      > .ant-menu-submenu-active::after,
      > .ant-menu-submenu-open::after,
      > .ant-menu-item-selected::after,
      > .ant-menu-submenu-selected::after {
        border-bottom: 4px solid rgba(255, 255, 255, 0.8);
      }
    }
    .ant-menu-item:hover,
    .ant-menu-item-active,
    .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
    .ant-menu-submenu-active,
    .ant-menu-submenu-title:hover {
      color: $--color-white;
    }
    .ant-menu-submenu-expand-icon,
    .ant-menu-submenu-arrow {
      display: block;
      right: -16px;
      width: 10px;
      color: $--color-white;
    }
    &.ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title {
      color: $--color-white;
    }
  }
  :deep(.ant-menu-submenu-popup) {
    .ant-menu-vertical > .ant-menu-item,
    .ant-menu-vertical-left > .ant-menu-item,
    .ant-menu-vertical-right > .ant-menu-item,
    .ant-menu-inline > .ant-menu-item,
    .ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title,
    .ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title,
    .ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title,
    .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
      height: 56px;
      line-height: 56px;
    }
  }
}
</style>
