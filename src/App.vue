<template>
  <a-config-provider>
    <g-spin :spinning="pageLoading.spinning" :tip="pageLoading.tip">
      <router-view />
    </g-spin>
  </a-config-provider>
</template>

<script setup>
import { ref, reactive, inject, watch, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { pageLoadingStore } from 'store/common';

const locale = ref(zhCN.locale);
const pageLoading = pageLoadingStore();

message.config({
  duration: 1,
  maxCount: 3,
});

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
