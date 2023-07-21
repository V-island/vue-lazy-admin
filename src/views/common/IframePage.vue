<template>
  <iframe class="iframe" :src="$route.meta.iframeURL" width="100%" height="100%"
    >当前浏览器不支持iframe，请升级。</iframe
  >
</template>

<script>
export default {
  name: 'IframePage',
};
</script>

<style lang="scss">
.iframe {
  border: 0;
}
</style>
