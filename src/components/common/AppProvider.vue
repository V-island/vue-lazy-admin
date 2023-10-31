<script setup>
import { NConfigProvider, darkTheme, dateZhCN, zhCN } from 'naive-ui';
import { useCssVar } from '@vueuse/core';
import { kebabCase } from 'xe-utils';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import { naiveThemeOverrides } from '~/settings';
import { useThemeStore } from '@/store';

hljs.registerLanguage('json', json);
const themeStore = useThemeStore();

// 装载CSS
function setupCssVar() {
  const common = naiveThemeOverrides.common;
  for (const key in common) {
    useCssVar(`--${kebabCase(key)}`, document.documentElement).value = common[key] || '';
    if (key === 'primaryColor') window.localStorage.setItem('__THEME_COLOR__', common[key] || '');
  }
}
setupCssVar();
</script>

<template>
  <NConfigProvider
    wh-full
    :theme="themeStore.darkMode ? darkTheme : undefined"
    :theme-overrides="naiveThemeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :hljs="hljs"
  >
    <slot />
  </NConfigProvider>
</template>
