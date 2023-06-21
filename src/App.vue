<template>
  <a-spin :spinning="pageLoading.spinning" :tip="pageLoading.tip">
    <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
      <router-view />
    </a-config-provider>
  </a-spin>
</template>

<script setup>
import { ref, watch } from 'vue';
import { pageLoadingStore } from 'store/common';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const locale = ref(zhCN.locale);
const pageLoading = pageLoadingStore();

watch(locale, (val) => {
  dayjs.locale(val);
});
</script>

<style lang="scss" scoped>
</style>
