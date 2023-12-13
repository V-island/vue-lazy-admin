<script setup>
import { storeToRefs } from 'pinia'
import { header, tags } from '~/settings'
import AppHeader from './components/header/index.vue'
import AppMain from './components/AppMain.vue'
import Sidebar from './components/sidebar/index.vue'
import AppTags from './components/tags/index.vue'

import { useThemeStore } from '@/store'

const { collapsed } = storeToRefs(useThemeStore())
</script>

<template>
  <NLayout has-sider h-full w-full>
    <!-- 左侧边栏 -->
    <NLayoutSider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="220"
      :native-scrollbar="false"
      :collapsed="collapsed"
    >
      <Sidebar />
    </NLayoutSider>
    <!-- 右半部分 -->
    <article flex="~ 1 col" overflow-hidden>
      <!-- 头部 un-border="b-1 gray-100 b-solid dark:white/5"-->
      <header
        flex
        items-center
        px-15
        
        :style="`height: ${header.height}px`"
        class="bg-[var(--n-color)]"
      >
        <AppHeader />
      </header>
      <!-- 标签栏 un-border="b-1 gray-100 b-solid dark:white/5"-->
      <section v-if="tags.visible">
        <AppTags :style="{ height: `${tags.height}px` }" />
      </section>
      <!-- 主体内容 -->
      <section flex-1 overflow-hidden>
        <AppMain />
      </section>
    </article>
  </NLayout>
</template>
