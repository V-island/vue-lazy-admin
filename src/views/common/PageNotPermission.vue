<script setup>
import { NButton, NResult } from 'naive-ui'
import AppPage from '@/components/page/AppPage.vue'
</script>

<template>
  <AppPage>
    <NResult m-auto status="403" description="抱歉,该账户访问无权限，请重新登录！">
      <template #icon>
        <img src="@/assets/images/404.webp" width="500">
      </template>
      <template #footer>
        <NButton @click="$router.replace('/login')">
          返回首页
        </NButton>
      </template>
    </NResult>
  </AppPage>
</template>
