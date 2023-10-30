<template>
  <section class="wrapper">
    <a-space :size="8">
      <a-button
        class="ant-btn-orange"
        type="link"
        v-if="breadcrumbList.length > 2"
        @click="router.go(-1)"
      >
        <template #icon><LeftOutlined /></template>
        返回
      </a-button>
      <a-breadcrumb separator=">">
        <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
          {{ item.title }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-space>
  </section>
</template>

<script setup>
import { LeftOutlined } from '@ant-design/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, computed, onMounted, onUnmounted, inject, getCurrentInstance } from 'vue';
import { menuStore } from 'store/auth';
import { utilFn, formatMenuUrl } from 'utils';

const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const menu = menuStore();

// 获取当前路由面包屑列表
const breadcrumbList = computed(() => {
  // 获取菜单树结构
  const allList = [...menu.menuList];
  // 获取当前选中菜单树结构
  const tree = proxy.$utils.findTree(
    allList,
    ({ url }) => `${formatMenuUrl(url)}` == `${route.name}`,
  );
  // 获取面包屑列表
  const nodes = proxy.$utils.get(tree, 'nodes', []);
  return nodes;
});
</script>

<style lang="scss" scoped>
.wrapper {
  @include flexbox(space-between);
  width: 100%;
  background: $--breadcrumb-color-bg;
  height: $--breadcrumb-height;
  color: $--color-white;
  padding: 0 $--layout-padding;

  :deep(.ant-breadcrumb) {
    color: $--color-primary;
  }
}
</style>
