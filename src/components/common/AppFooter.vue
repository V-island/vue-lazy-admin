<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store'

const { blogConfig } = storeToRefs(useAppStore())
</script>

<template>
  <footer flex="~ col" items-center justify-center text="14 gray-700 dark:gray-4">
    <p>
      Copyright©2020~2023
      <a href="http://lazymeta.cn" target="__blank" hover="decoration-underline color-primary">
        LazyMeta 懒人星球
      </a>
    </p>
    <p>
      <a
        href="http://beian.miit.gov.cn/"
        target="__blank"
        hover="decoration-underline color-primary"
      >
        {{ blogConfig.website_record ?? '备案信息未知' }}
      </a>
    </p>
  </footer>
</template>
