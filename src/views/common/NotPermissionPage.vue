<template>
  <a-result status="403" title="403" sub-title="抱歉,该账户访问无权限，请重新登录！">
    <template #extra>
      <a-button type="primary" @click="handleBackLogin">重新登录</a-button>
    </template>
  </a-result>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

// 重新登录
const handleBackLogin = () => {
  router.replace({ path: '/login' });
};
</script>

<style lang="scss" scoped></style>
