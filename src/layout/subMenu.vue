<template>
  <a-sub-menu v-if="!menu.hidden" :key="formatMenuUrl(`${menu.title}`)">
    <template v-if="menu.customIcon" #icon>
      <g-svg-icon :name="menu.customIcon" :svgStyle="{ width: '22px', height: '22px' }" />
    </template>
    <template #title>
      {{ menu.title }}
    </template>
    <template v-for="item in menu.children">
      <template v-if="!item.isHidden">
        <template v-if="item.children && item.children.length > 0 && item.title">
          <MainSubMenu :key="formatMenuUrl(`${item.title}`)" :menu="item" />
        </template>
        <a-menu-item v-else :key="formatMenuUrl(`${item.url}`)">
          <template v-if="item.customIcon" #icon>
            <g-svg-icon :name="item.customIcon" :svgStyle="{ width: '22px', height: '22px' }" />
          </template>
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

<style lang="scss" scoped></style>
