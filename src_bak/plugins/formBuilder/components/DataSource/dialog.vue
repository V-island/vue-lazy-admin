<template>
  <cus-dialog
    :visible="visible"
    @on-close="handleClose"
    ref="dataSourceDialog"
    width="1000px"
    form
    :title="$t('fm.datasource.config.title')"
    :action="false"
  >
    <el-container style="height: 600px; border: 1px solid #eee">
      <datasource-index v-model="dataSourceList"></datasource-index>
    </el-container>
  </cus-dialog>
</template>

<script>
import CusDialog from '../CusDialog.vue'
import DatasourceIndex from './index.vue'

export default {
  components: {
    CusDialog,
    DatasourceIndex,
  },
  emits: ['dialog-close'],
  data: () => ({
    visible: false,
    dataSourceList: [],
  }),
  methods: {
    open(list) {
      this.visible = true

      if (list) {
        this.dataSourceList = list
      }
    },

    handleClose() {
      this.$emit('dialog-close', this.dataSourceList)

      this.visible = false
    },
  },
}
</script>
