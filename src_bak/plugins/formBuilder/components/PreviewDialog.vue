<template>
  <cus-dialog
    :visible="previewVisible"
    @on-close="previewVisible = false"
    ref="widgetPreview"
    form
    :title="$t('fm.actions.preview')"
    fullscreen
    custom-class="fm-generate-preview-container"
  >
    <div class="fm-generate-preview" :class="`${platform}`">
      <generate-form
        preview
        :print-read="printRead"
        :platform="platform"
        id="export-id"
        :edit="formEdit"
        style="margin: 0 auto"
        insite="true"
        v-if="
          previewVisible &&
          (previewForm.config.ui == 'element' || !previewForm.config.ui)
        "
        :data="previewForm"
        :value="widgetModels"
        ref="generateForm"
      >
        <template v-slot:blank> </template>
      </generate-form>
      <!--jeeplus-->
      <!-- <antd-generate-form preview :print-read="printRead" :platform="platform" :edit="formEdit" style="margin: 0 auto;" insite="true" v-if="previewVisible && previewForm.config.ui == 'antd'" :data="previewForm" :value="widgetModels" ref="generateAntForm">
          <template v-slot:blank>
          </template>
        </antd-generate-form> -->
    </div>

    <template #action>
      <el-button size="large" type="primary" @click="handleTest">{{
        $t('fm.actions.getData')
      }}</el-button>
      <el-button size="large" @click="handleReset">{{
        $t('fm.actions.reset')
      }}</el-button>
      <el-button
        size="large"
        @click="formEdit = false"
        v-if="formEdit"
        :disabled="printRead"
        >{{ $t('fm.actions.disabledEdit') }}</el-button
      >
      <el-button
        size="large"
        @click="formEdit = true"
        v-else
        :disabled="printRead"
        >{{ $t('fm.actions.enabledEdit') }}</el-button
      >
      <el-button size="large" @click="printRead = true" v-if="!printRead">{{
        $t('fm.actions.printReadMode')
      }}</el-button>
      <el-button size="large" @click="printRead = false" v-if="printRead">{{
        $t('fm.actions.editMode')
      }}</el-button>
      <el-button size="large" @click="handlePrint">{{
        $t('fm.actions.print')
      }}</el-button>
      <el-button
        size="large"
        @click="previewVisible = false"
        type="info"
        plain
        >{{ $t('fm.actions.close') }}</el-button
      >
      <!-- <el-button @click="handleExportWord">导出Word</el-button> -->
    </template>
  </cus-dialog>
</template>

<script>
import CusDialog from './CusDialog.vue'
import GenerateForm from './GenerateForm.vue'
// import AntdGenerateForm from './AntdvGenerator/GenerateForm.vue' //jeeplus

export default {
  components: {
    CusDialog,
    GenerateForm, //,
    // AntdGenerateForm jeeplus
  },
  props: {},
  emits: ['get-data-success'],
  data() {
    return {
      previewVisible: false,
      formEdit: true,
      previewForm: {},
      widgetModels: {},
      remoteFuncs: {},
      platform: 'pc',
      printRead: false,
    }
  },
  methods: {
    preview(data, platform) {
      this.previewForm = data
      this.formEdit = this.previewVisible = true
      this.printRead = false

      this.platform = platform
    },
    handleTest() {
      const $form =
        this.previewForm.config.ui == 'element' || !this.previewForm.config.ui
          ? this.$refs.generateForm
          : this.$refs.generateAntForm

      $form
        .getData()
        .then((data) => {
          this.$emit('get-data-success', data)
          this.$refs.widgetPreview.end()
        })
        .catch((e) => {
          this.$refs.widgetPreview.end()
        })
    },
    handleReset() {
      const $form =
        this.previewForm.config.ui == 'element' || !this.previewForm.config.ui
          ? this.$refs.generateForm
          : this.$refs.generateAntForm

      $form.reset()
    },
    handleExportWord() {
      var rules = '',
        ss = document.styleSheets
      for (var i = 0; i < ss.length; ++i) {
        for (var x = 0; x < ss[i].cssRules.length; ++x) {
          rules += ss[i].cssRules[x].cssText
        }
      }

      var header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title>
      <style>${rules}</style>
      </head><body>`

      var footer = '</body></html>'

      var html =
        header + document.getElementById('export-id').innerHTML + footer

      var blob = new Blob(['\ufeff', html], {
        type: 'application/msword',
      })

      // Specify link url
      var url =
        'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)

      // Specify file name
      let filename = filename ? filename + '.doc' : 'document.doc'

      // Create download link element
      var downloadLink = document.createElement('a')

      document.body.appendChild(downloadLink)

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename)
      } else {
        // Create a link to the file
        downloadLink.href = url

        // Setting the file name
        downloadLink.download = filename

        //triggering the function
        downloadLink.click()
      }

      document.body.removeChild(downloadLink)
    },
    handlePrint() {
      this.printRead = true

      this.$nextTick(() => {
        window.print()
      })
    },
  },
}
</script>

<style lang="scss">
@media print {
  .fm-design-container {
    display: none;
  }

  .fm-generate-preview-container {
    position: relative;

    .el-dialog {
      display: block;
    }

    .el-dialog__header {
      display: none;
    }

    .el-dialog__footer {
      display: none;
    }

    .el-dialog__body {
      padding: 0;
      display: block;

      .fm-generate-preview {
        box-shadow: none;
        border: 0;
      }
    }
  }
}
</style>
