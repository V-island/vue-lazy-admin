<template>
  <div class="form-config-container">
    <el-form label-position="top" size="default">
      <!--jeeplus-->
      <!-- <el-form-item label="UI">
          <el-radio-group v-model="dataModel.ui">
            <el-radio-button label="element">Element</el-radio-button>
            <el-radio-button label="antd">Ant Design</el-radio-button>
          </el-radio-group>
        </el-form-item> -->
      <el-form-item :label="$t('fm.config.form.width')">
        <el-input v-model="dataModel.width" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('fm.config.form.labelPosition.title')">
        <el-radio-group
          v-model="dataModel.labelPosition"
          :key="data.labelPosition"
        >
          <el-radio-button label="left">{{
            $t('fm.config.form.labelPosition.left')
          }}</el-radio-button>
          <el-radio-button label="right">{{
            $t('fm.config.form.labelPosition.right')
          }}</el-radio-button>
          <el-radio-button label="top">{{
            $t('fm.config.form.labelPosition.top')
          }}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.labelWidth')">
        <el-input-number
          v-model="dataModel.labelWidth"
          :min="0"
          :max="200"
          :step="10"
        ></el-input-number>
      </el-form-item>
      <!-- <el-form-item :label="$t('fm.config.widget.labelWidth')" v-if="Object.keys(data.options).indexOf('labelWidth')>=0 && !data.options.tableColumn">
          <el-checkbox v-model="data.options.isLabelWidth" style="margin-right: 5px;">{{$t('fm.config.widget.custom')}}</el-checkbox>
          <el-input-number v-model="data.options.labelWidth" :disabled="!data.options.isLabelWidth" :min="0" :max="99999" :step="10"></el-input-number>
        </el-form-item> -->

      <el-form-item :label="$t('fm.config.form.size')">
        <el-radio-group v-model="dataModel.size">
          <el-radio-button label="large">Large</el-radio-button>
          <el-radio-button label="default">Default</el-radio-button>
          <el-radio-button label="small">Small</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.styleSheets')">
        <el-button style="width: 100%" @click="handleSetStyleSheets">{{
          $t('fm.config.widget.setting')
        }}</el-button>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.customClass')">
        <el-select
          style="width: 100%"
          v-model="customClassArray"
          multiple
          filterable
          allow-create
          default-first-option
        >
          <el-option
            v-for="item in sheets"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('fm.datasource.name')">
        <el-button style="width: 100%" @click="handleSetDatasource">{{
          $t('fm.config.widget.setting')
        }}</el-button>
      </el-form-item>

      <el-form-item :label="$t('fm.eventscript.name')">
        <el-button style="width: 100%" @click="handleSetScript">{{
          $t('fm.config.widget.setting')
        }}</el-button>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.customJs')">
        <el-input type="textarea" v-model="data.customJs" clearable></el-input>
        <el-radio v-model="data.eventType" label="1">保存前执行</el-radio>
        <el-radio v-model="data.eventType" label="2">保存后执行</el-radio>
      </el-form-item>
    </el-form>

    <code-dialog
      ref="styleDialog"
      mode="css"
      :title="$t('fm.config.form.styleSheets')"
      help="https://www.yuque.com/ln7ccx/ntgo8q/bau8eo"
      @on-confirm="handlestyleSheetsConfirm"
    ></code-dialog>

    <datasource-dialog
      ref="dataSourceDialog"
      @dialog-close="handleDataSourceClose"
    ></datasource-dialog>

    <event-script-dialog
      ref="eventScriptDialog"
      @dialog-close="handleEventScriptClose"
      @dialog-confirm="handleEventConfirm"
    ></event-script-dialog>
  </div>
</template>

<script>
import CodeDialog from './CodeDialog.vue'
import DatasourceDialog from './DataSource/dialog.vue'
import EventScriptDialog from './EventPanel/dialog.vue'
import { splitStyleSheets } from '../util'
import { EventBus } from '../util/event-bus.js'

export default {
  components: {
    CodeDialog,
    DatasourceDialog,
    EventScriptDialog,
  },
  props: ['data', 'sheets'],
  emits: [
    'on-style-update',
    'on-datasource-update',
    'on-eventscript-update',
    'on-eventscript-confirm',
    'update:data',
  ],
  data() {
    return {
      customClassArray:
        this.data && this.data.customClass
          ? this.data.customClass.split(' ').filter((item) => item)
          : [],
      dataModel: this.data,
    }
  },
  methods: {
    handleSetStyleSheets() {
      let sheets = document.styleSheets[0]

      if (sheets.insertRule) {
        this.$refs.styleDialog.open(this.data.styleSheets || '')
      } else {
        this.$message.warning(this.$t('fm.message.notSupport'))
      }
    },

    handlestyleSheetsConfirm(value) {
      this.dataModel.styleSheets = value

      this.$refs.styleDialog.close()

      var arr = splitStyleSheets(value)

      this.$emit('on-style-update', arr)
    },

    handleSetDatasource() {
      this.dataModel.dataSource = this.data.dataSource || []

      this.$refs.dataSourceDialog.open(this.data.dataSource)
    },
    handleDataSourceClose(list) {
      this.dataModel.dataSource = list

      this.$emit('on-datasource-update', list)
    },

    handleSetScript() {
      this.dataModel.eventScript = this.data.eventScript || []

      this.$refs.eventScriptDialog.open(this.data.eventScript)
    },

    editScript(eventName, eventKey) {
      this.dataModel.eventScript = this.data.eventScript || []

      this.$refs.eventScriptDialog.open(
        this.data.eventScript,
        eventName,
        eventKey
      )
    },

    handleEventScriptClose(list) {
      this.dataModel.eventScript = list

      this.$emit('on-eventscript-update', list)
    },

    handleEventConfirm(eventObj) {
      this.$emit('on-eventscript-confirm', eventObj)
    },
  },
  watch: {
    'data.customClass': function (val) {
      this.customClassArray =
        this.data && this.data.customClass
          ? this.data.customClass.split(' ').filter((item) => item)
          : []
    },
    customClassArray(val) {
      this.dataModel.customClass = val.join(' ')
    },
    data(val) {
      this.dataModel = val
    },
    dataModel: {
      deep: true,
      handler(val) {
        this.$emit('update:data', val)
      },
    },
  },
}
</script>
