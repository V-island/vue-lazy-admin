<template>
  <section>
    <a-sub-menu v-if="!menu.hidden" :key="`${menu.name}`">
      <template #title>
        {{ menu.name }}
      </template>
      <template v-for="item in menu.children">
        <template v-if="item.children && item.children.length > 0 && item.name">
          <MainSubMenu :menu="item" />
        </template>
        <a-menu-item v-else :key="`${item.name}`">
          <span>{{ item.name }}</span>
        </a-menu-item>
      </template>
    </a-sub-menu>
  </section>
</template>

<script setup>
import { defineProps } from 'vue';
import MainSubMenu from './subMenu.vue';

const { menu } = defineProps(['menu']);
</script>

<style lang="scss" scoped></style>
