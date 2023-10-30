<template>
  <a-sub-menu
    popupClassName="submenu-top"
    v-if="!menu.hidden"
    :key="formatMenuUrl(`${menu.title}`)"
    :popupOffset="['-25%', 0]"
  >
    <!-- <template v-if="menu.customIcon" #icon>
      <g-svg-icon :name="menu.customIcon" :svgStyle="{ width: '22px', height: '22px' }" />
    </template> -->
    <template #title>
      {{ menu.title }}
    </template>
    <template #expandIcon>
      <RightOutlined />
    </template>
    <template v-for="item in menu.children">
      <template v-if="!item.isHidden">
        <template v-if="item.children && item.children.length > 0 && item.title">
          <MainSubMenu :key="formatMenuUrl(`${item.title}`)" :menu="item" />
        </template>
        <a-menu-item v-else :key="formatMenuUrl(`${item.url}`)">
          <!-- <template v-if="item.customIcon" #icon>
            <g-svg-icon :name="item.customIcon" :svgStyle="{ width: '22px', height: '22px' }" />
          </template> -->
          <span>{{ item.title }}</span>
        </a-menu-item>
      </template>
    </template>
  </a-sub-menu>
</template>

<script setup>
import { formatMenuUrl } from 'utils';
import MainSubMenu from './subMenu.vue';

const { menu } = defineProps(['menu']);
</script>

<style lang="scss" scoped>
.submenu-layout {
  background: #000;
}

:deep(.submenu-layout) {
  background: #000;
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
</style>
