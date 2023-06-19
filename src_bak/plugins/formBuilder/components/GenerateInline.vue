<template>
  <div
    class="fm-inline-container"
    v-if="display[element.model]"
    :class="{
      [element.options && element.options.customClass]:
        element.options && element.options.customClass ? true : false,
    }"
  >
    <section v-for="item in element.list" :key="item.key">
      <generate-form-item
        :models="dataModels"
        :rules="rules"
        :widget="item"
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
        :style="{ 'margin-right': element.options.spaceSize + 'px' }"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-form-item>
    </section>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'

export default {
  name: 'generate-inline',
  components: {
    GenerateFormItem,
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

<style lang="scss" scoped>
.fm-inline-container {
  > * {
    display: inline-block;
    vertical-align: top;
  }
}
</style>
