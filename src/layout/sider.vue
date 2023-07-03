<template>
  <section class="wrapper">
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="common.collapsed"
    >
      <template v-for="item in menu.menuAllList">
        <template v-if="item.children && item.children.length > 0 && item.name">
          <MainSubMenu :menu="item"/>
        </template>
        <a-menu-item v-else :key="`${item.name}`">
          <span>{{ item.name }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import { commonStore } from 'store/common';
import { menuStore } from 'store/auth';
import MainSubMenu from './subMenu.vue';

const common = commonStore();
const menu = menuStore();

const openKeys = reactive([]);
const selectedKeys = reactive([]);

</script>

<style lang="scss" scoped></style>
