<template>
  <div class="fm-form-item" :data-id="widget.model" v-if="widget.key">
    <el-form-item
      v-if="
        widget.type != 'divider' &&
        widget.type != 'alert' &&
        display[widget.model]
      "
      :prop="widget.model"
      :class="{
        [widget.options && widget.options.customClass]:
          widget.options && widget.options.customClass ? true : false,
        'no-label-form-item':
          widget.options.isLabelWidth && widget.options.labelWidth == 0,
      }"
      :label="widget.options.hideLabel ? '' : widget.name"
      :label-width="
        widget.options.hideLabel
          ? '0px'
          : widget.options.isLabelWidth
          ? widget.options.labelWidth + 'px'
          : ''
      "
      :key="widget.key"
      :required="widget.options.required"
    >
      <generate-element-item
        :blanks="blanks"
        :is-table="false"
        :widget="widget"
        :models="dataModels"
        :remote="remote"
        :edit="edit"
        :remote-option="remoteOption"
        :key="widget.key"
        :rules="rules"
        v-model="dataModel"
        :platform="platform"
        :preview="preview"
        :data-source-value="dataSourceValue"
        :event-function="eventFunction"
        :print-read="printRead"
        :form-component="formComponent"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-element-item>
    </el-form-item>

    <el-form-item
      v-if="widget.type == 'divider' && display[widget.model]"
      label-width="0"
    >
      <el-divider
        :content-position="widget.options.contentPosition"
        style="margin-bottom: 10px"
      >
        {{ widget.name }}
      </el-divider>
    </el-form-item>

    <el-form-item
      v-if="widget.type == 'alert' && display[widget.model]"
      label-width="0"
    >
      <el-alert
        :title="widget.options.title"
        :type="widget.options.type"
        :description="widget.options.description"
        :closable="widget.options.closable"
        :center="widget.options.center"
        :show-icon="widget.options.showIcon"
        :effect="widget.options.effect"
        :style="{ width: widget.options.width }"
        @close="display[widget.model] = false"
      ></el-alert>
    </el-form-item>
  </div>
</template>

<script>
import GenerateElementItem from './GenerateElementItem.vue'
import { EventBus } from '../util/event-bus.js'

export default {
  components: {
    GenerateElementItem,
  },
  props: [
    'widget',
    'models',
    'rules',
    'remote',
    'blanks',
    'display',
    'edit',
    'remoteOption',
    'platform',
    'preview',
    'containerKey',
    'dataSourceValue',
    'eventFunction',
    'printRead',
    'formComponent',
  ],
  data() {
    return {
      dataModel: this.models[this.widget.model],
      dataModels: this.models,
    }
  },
  methods: {},
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        EventBus.$emit(
          'on-change-' + this.containerKey,
          val,
          this.widget.model,
          this.containerKey
        )

        // 执行 onChange 方法
        if (this.widget.events && this.widget.events.onChange) {
          let funcKey = this.widget.events.onChange

          this.eventFunction[funcKey]({ value: val, field: this.widget.model })
        }
      },
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModels = val
        this.dataModel = val[this.widget.model]
      },
    },
  },
}
</script>
