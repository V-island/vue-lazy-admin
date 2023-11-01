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
      <!-- 头部 -->
      <header
        flex
        items-center
        px-15
        un-border="b-1 gray-200 b-solid dark:gray-6"
        :style="`height: ${header.height}px`"
      >
        <AppHeader />
      </header>
      <!-- 标签栏 -->
      <section v-if="tags.visible" un-border="b gray-200 b-solid dark:gray-6">
        <AppTags :style="{ height: `${tags.height}px` }" />
      </section>
      <!-- 主体内容 -->
      <section flex-1 overflow-hidden>
        <AppMain />
      </section>
    </article>
  </NLayout>
</template>
