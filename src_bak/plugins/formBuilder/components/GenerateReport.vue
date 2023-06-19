<template>
  <table
    class="fm-report-table__table"
    :style="{
      'border-top-width': element.options.borderWidth + 'px',
      'border-top-color': element.options.borderColor,
      'border-left-width': element.options.borderWidth + 'px',
      'border-left-color': element.options.borderColor,
      width: element.options.width || '100%',
    }"
    v-if="display[element.model]"
    :class="{
      [element.options && element.options.customClass]:
        element.options && element.options.customClass ? true : false,
    }"
  >
    <tr :key="rowIndex" v-for="(row, rowIndex) in element.rows">
      <section v-for="(column, i) in row.columns" :key="rowIndex + '-' + i">
        <td
          :style="{
            'border-right-width': element.options.borderWidth + 'px',
            'border-right-color': element.options.borderColor,
            'border-bottom-width': element.options.borderWidth + 'px',
            'border-bottom-color': element.options.borderColor,
            width: column.options.width,
            height: column.options.height,
          }"
          v-if="!column.options.invisible"
          :colspan="column.options.colspan"
          :rowspan="column.options.rowspan"
          class="fm-report-table__td"
          valign="top"
          :class="{
            [column.options.customClass]: column.options.customClass
              ? true
              : false,
          }"
        >
          <section
            v-for="columnElement in column.list"
            :key="columnElement.key"
          >
            <generate-col-item
              v-if="columnElement.type == 'grid'"
              :model="dataModels"
              :rules="rules"
              :element="columnElement"
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
              v-else-if="columnElement.type == 'report'"
              :model="dataModels"
              :rules="rules"
              :element="columnElement"
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
              v-else-if="columnElement.type == 'inline'"
              :model="dataModels"
              :rules="rules"
              :element="columnElement"
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
              v-else-if="columnElement.type == 'tabs'"
              :model="dataModels"
              :rules="rules"
              :element="columnElement"
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
              :widget="columnElement"
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
        </td>
      </section>
    </tr>
  </table>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateInline from './GenerateInline.vue'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'generate-report',
  components: {
    GenerateFormItem,
    GenerateInline,
    GenerateColItem: defineAsyncComponent(() =>
      import('./GenerateColItem.vue')
    ),
    GenerateTabItem: defineAsyncComponent(() =>
      import('./GenerateTabItem.vue')
    ),
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
