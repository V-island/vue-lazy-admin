<script setup>
import { NButton, NSpace, NTooltip } from 'naive-ui'

const emit = defineEmits(['search', 'reset'])
</script>

<template>
  <div
    class="min-h-60 flex items-start justify-between border-b  border-b-solid border-gray-200 dark:border-white/5  p-15">
    <NSpace wrap :size="[35, 15]">
      <slot />
    </NSpace>
    <NSpace>
      <NTooltip>
        <template #trigger>
          <NButton secondary type="primary" @click="emit('reset')">
            <TheIcon icon="carbon:filter-reset" :size="18" />
          </NButton>
        </template>
        重置
      </NTooltip>
      <NTooltip>
        <template #trigger>
          <NButton type="primary" @click="emit('search')">
            <TheIcon icon="carbon:search" :size="18" />
          </NButton>
        </template>
        搜索
      </NTooltip>
    </NSpace>
  </div>
</template>
