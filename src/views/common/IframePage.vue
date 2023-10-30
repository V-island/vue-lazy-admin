<template>
  <section class="iframe-layout">
    <div class="iframe-content flatbed">
      <iframe
        id="iframe"
        class="iframe-box"
        :src="common.iframeURL"
        scrolling="auto"
        frameborder="0"
        width="100%"
        height="100%"
      >
        当前浏览器不支持iframe，请升级。
      </iframe>
    </div>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, computed, onMounted, onUnmounted, inject, getCurrentInstance } from 'vue';
// import { commonStore } from '@/store/common';
import { close, start } from '@/plugins/nprogress';

const route = useRoute();
const common = {};

// 初始化
const initLoadData = () => {
  const { iframeSrc } = route.query;
  common.iframeSrc = iframeSrc;

  // 加载页面
  const iframe = document.getElementById('iframe');
  start();

  iframe.onload = function () {
    close();
  };
};
/** ============== 基础事件 =============== */

onMounted(() => {
  initLoadData();
});
</script>

<style lang="scss">
.iframe-layout {
  @include flexbox();
  @include wh(100%, 100%);
}
.iframe-content {
  @include wh(100%, 100%);

  // 平板
  &.flatbed {
    @include wh(768px, 768px);
  }
}
.iframe-box {
  position: relative;
}
</style>
