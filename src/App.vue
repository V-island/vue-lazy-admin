<template>
  <a-config-provider :locale="locale === 'en' ? enUS : zhCN" :theme="ThemeBlue">
    <g-spin :spinning="pageLoading.spinning" :tip="pageLoading.tip">
      <router-view />
    </g-spin>
  </a-config-provider>
</template>

<script setup>
import { ref, reactive, inject, watch, onMounted } from 'vue';
import { message,  } from 'ant-design-vue';
import ThemeBlue from 'theme/blue';
import { pageLoadingStore } from 'store/common';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

const locale = ref(zhCN.locale);
const pageLoading = pageLoadingStore();

message.config({
  duration: 1,
  maxCount: 3,
});

onMounted(() => {});
</script>

<style lang="scss" scoped></style>
