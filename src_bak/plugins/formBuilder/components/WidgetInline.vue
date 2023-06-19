<template>
  <div
    class="widget-inline widget-view"
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      is_hidden: element.options.hidden,
    }"
    @click.stop="handleSelectWidget(index)"
    :size="element.options.size"
  >
    <div class="widget-inline-content">
      <draggable
        v-model="element.list"
        v-bind="{
          group: { name: 'people', put: handlePut },
          ghostClass: 'ghost',
          animation: 200,
          handle: '.drag-widget',
        }"
        :no-transition-on-drag="true"
        @add="handleWidgetInlineAdd($event, element)"
        @update="handleWidgetInlineUpdate"
        class="widget-inline-list"
        :class="{
          [element.options && element.options.customClass]: element.options
            .customClass
            ? true
            : false,
        }"
        item-key="key"
      >
        <template #item="{ element: item, index }">
          <template v-if="item && item.key">
            <widget-form-item
              :key="item.key"
              :element="item"
              v-model:select="selectWidget"
              :index="index"
              :data="element"
              @select-change="handleSelectChange($event, element)"
              :form-key="formKey"
              :style="{ 'margin-right': element.options.spaceSize + 'px' }"
            >
            </widget-form-item>
          </template>
        </template>
      </draggable>
    </div>

    <div
      class="widget-view-action widget-inline-action"
      v-if="selectWidget.key == element.key"
    >
      <i
        class="iconfont icon-icon_clone"
        @click.stop="handleInlineClone(index)"
        :title="$t('fm.tooltip.clone')"
      ></i>
      <i
        class="iconfont icon-trash"
        @click.stop="handleWidgetDelete(index)"
        :title="$t('fm.tooltip.trash')"
      ></i>
    </div>

    <div
      class="widget-view-drag widget-inline-drag"
      v-if="selectWidget.key == element.key"
    >
      <i class="iconfont icon-drag drag-widget"></i>
    </div>
    <div
      class="widget-view-model"
      :style="{ color: element.options.dataBind ? '' : '#666' }"
    >
      <span>{{ element.model }}</span>
    </div>
  </div>
</template>

<script>
import WidgetFormItem from './WidgetFormItem.vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'

export default {
  name: 'widget-inline',
  components: {
    Draggable,
    WidgetFormItem,
  },
  props: ['element', 'select', 'index', 'data', 'platform', 'formKey'],
  emits: ['select-change', 'update:select'],
  data() {
    return {
      selectWidget: this.select || {},
    }
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
    },
    handlePut(a, b, c) {
      if (
        c.className.indexOf('widget-col') >= 0 ||
        c.className.indexOf('widget-table') >= 0 ||
        c.className.indexOf('widget-tab') >= 0 ||
        c.className.indexOf('widget-inline') >= 0 ||
        c.className.indexOf('widget-report') >= 0 ||
        c.className.indexOf('no-put') >= 0 ||
        c.children[0].className.indexOf('no-put') >= 0
      ) {
        return false
      }
      return true
    },
    handleWidgetInlineAdd($event, table) {
      const newIndex = $event.newIndex
      const key = Math.random().toString(36).slice(-8)
      table.list[newIndex] = _.cloneDeep(table.list[newIndex])
      table.list[newIndex] = {
        ...table.list[newIndex],
        options: {
          ...table.list[newIndex].options,
          remoteFunc: table.list[newIndex].options.remoteFunc || 'func_' + key,
          remoteOption:
            table.list[newIndex].options.remoteOption || 'option_' + key,
        },
        key: table.list[newIndex].key ? table.list[newIndex].key : key,
        model: table.list[newIndex].model
          ? table.list[newIndex].model
          : table.list[newIndex].type + '_' + key,
        rules: table.list[newIndex].rules
          ? [...table.list[newIndex].rules]
          : [],
      }

      this.selectWidget = table.list[newIndex]

      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      })
    },
    handleInlineClone(index) {
      let cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]

        this.$nextTick(() => {
          EventBus.$emit('on-history-add-' + this.formKey)
        })
      })
    },
    handleWidgetDelete(index) {
      if (this.data.list.length == 1) {
        this.$emit('select-change', -1)
      } else {
        if (this.data.list.length - 1 == index) {
          this.$emit('select-change', index - 1)
        } else {
          this.$emit('select-change', index)
        }
      }

      this.data.list.splice(index, 1)

      setTimeout(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      }, 20)
    },
    handleWidgetInlineUpdate() {
      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      })
    },
    handleSelectChange(index, item) {
      setTimeout(() => {
        index >= 0
          ? (this.selectWidget = item.list[index])
          : (this.selectWidget = this.data.list[this.index])
      })
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      deep: true,
      handler(val) {
        this.$emit('update:select', val)
      },
    },
  },
}
</script>
