<template>
  <a-result status="404" title="404" sub-title="抱歉,未找到访问页面">
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

