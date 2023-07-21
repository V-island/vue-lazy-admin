<template>
  <section>
    <a-sub-menu v-if="!menu.hidden" :key="`${menu.url}`">
      <template #title>
        {{ menu.title }}
      </template>
      <template v-for="item in menu.children">
        <template v-if="item.children && item.children.length > 0 && item.title">
          <MainSubMenu :menu="item" />
        </template>
        <a-menu-item v-else :key="`${item.url}`">
          <span>{{ item.title }}</span>
        </a-menu-item>
      </template>
    </a-sub-menu>
  </section>
</template>

<script setup>
import MainSubMenu from './subMenu.vue';

const { menu } = defineProps(['menu']);
</script>

<style lang="scss" scoped></style>
