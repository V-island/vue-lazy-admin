<template>
  <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
    <router-view />
  </a-config-provider>
</template>

<script setup>
import { ref, watch } from 'vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const locale = ref(zhCN.locale);

watch(locale, (val) => {
  dayjs.locale(val);
});
</script>

<style lang="scss" scoped>
</style>
