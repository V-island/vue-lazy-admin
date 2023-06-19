<template>
  <section class="word-preview">
    <div ref="file"></div>
  </section>
</template>

<script>
export default {
  name: 'VcWordPreview',
  props: {
    blob: {
      type: [ArrayBuffer, Array, Object],
      default: null,
    },
  },
  methods: {
    getPdfCode() {
      const that = this;
      const docx = require('docx-preview');

      this.$nextTick(() => {
        docx.renderAsync(that.blob, that.$refs.file); // 渲染到页面
      });
    },
  },
  watch: {
    blob: {
      immediate: true,
      deep: true,
      handler(blob) {
        if (blob) this.getPdfCode();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.word-preview {
  width: 100%;
}
</style>
