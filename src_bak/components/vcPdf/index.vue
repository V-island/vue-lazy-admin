<template>
  <section class="content">
    <pdf
      v-for="(currentPage, index) in pageTotalNum"
      :key="index"
      id="pdf"
      class="pdf"
      :src="pdfSrc"
      :page="currentPage"
      @progress="loadedRatio = $event"
      @loaded="loadPdfHandler = $event"
    />
  </section>
</template>

<script>
import pdf from 'vue-pdf-signature';
import CMapReaderFactory from 'vue-pdf-signature/src/CMapReaderFactory';

export default {
  name: 'VcPdf',
  components: {
    pdf,
  },
  props: {
    blob: {
      type: ArrayBuffer,
      default: null,
    },
  },
  data() {
    return {
      pdfSrc: '', // pdf绑定的url链接
      numPages: null, // 循环的pdf总页数
      pageNum: 1,
      pageTotalNum: 1, // 总页数
      loadedRatio: 0, // 当前页面的加载进度，范围是0-1 ，等于1的时候代表当前页已经完全加载完成了
    };
  },
  methods: {
    _loadFile(url) {
      this.pdfSrc = pdf.createLoadingTask({
        //接口中的url用createLoadingTask方法
        url,
        cMapPacked: true,
        CMapReaderFactory,
      });
      // 计算总页数实现分页展示多页
      this.pdfSrc.promise
        .then((pdf) => {
          this.pageTotalNum = pdf.numPages;
        })
        // .catch((err) => {
        //   console.error('pdf 加载失败', err);
        // });
    },
    //初始化
    init() {
      const blob = new Blob([this.blob], {
        type: 'application/pdf;charset=utf-8',
      });
      const pdf_src = window.URL.createObjectURL(blob);
      this._loadFile(pdf_src);
    },
  },
  watch: {
    blob: {
      immediate: true,
      deep: true,
      handler(show) {
        if (show) this.init();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  overflow: auto;
}
</style>
