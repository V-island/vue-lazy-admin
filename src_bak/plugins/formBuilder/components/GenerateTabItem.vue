<template>
  <el-tabs
    v-model="tabActive"
    :type="element.options.type"
    :tab-position="element.options.tabPosition"
    :class="{
      [element.options.customClass]: element.options.customClass ? true : false,
    }"
    style="margin-bottom: 18px"
    v-if="display[element.model]"
  >
    <el-tab-pane
      :key="item.name"
      :label="item.label"
      :name="item.name"
      v-for="item in element.tabs"
    >
      <section v-for="tab in item.list" :key="tab.key">
        <generate-col-item
          v-if="tab.type == 'grid'"
          :model="dataModels"
          :rules="rules"
          :element="tab"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="formComponent"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-col-item>

        <generate-report
          v-else-if="tab.type == 'report'"
          :model="dataModels"
          :rules="rules"
          :element="tab"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="formComponent"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-report>

        <generate-inline
          v-else-if="tab.type == 'inline'"
          :model="dataModels"
          :rules="rules"
          :element="tab"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="formComponent"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-inline>

        <generate-tab-item
          v-else-if="tab.type == 'tabs'"
          :model="dataModels"
          :rules="rules"
          :element="tab"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="formComponent"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-tab-item>

        <generate-form-item
          v-else
          :models="dataModels"
          :rules="rules"
          :widget="tab"
          :remote="remote"
          :blanks="blanks"
          :display="display"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="formComponent"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-form-item>
      </section>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateInline from './GenerateInline.vue'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'generate-tab-item',
  components: {
    GenerateFormItem,
    GenerateInline,
    GenerateColItem: defineAsyncComponent(() =>
      import('./GenerateColItem.vue')
    ),
    GenerateReport: defineAsyncComponent(() => import('./GenerateReport.vue')),
  },
  props: [
    'element',
    'model',
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
      dataModels: this.model,
      tabActive: this.element.tabs.length ? this.element.tabs[0].name : '',
    }
  },
  methods: {},
  watch: {
    model: {
      deep: true,
      handler() {
        this.dataModels = this.model
      },
    },
  },
}
</script>
