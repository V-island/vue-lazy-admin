<template>
  <div
    class="widget-table widget-view"
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      is_hidden: element.options.hidden,
      mobile: platform == 'mobile',
    }"
    @click.stop="handleSelectWidget(index)"
  >
    <el-form-item
      :label="element.options.hideLabel ? '' : element.name"
      :label-width="
        element.options.hideLabel
          ? '0px'
          : element.options.isLabelWidth
          ? element.options.labelWidth + 'px'
          : ''
      "
      :class="{
        [element.options && element.options.customClass]: element.options
          .customClass
          ? true
          : false,
      }"
    >
      <div
        class="widget-table-wrapper"
        :class="{ mobile: platform == 'mobile' }"
      >
        <div class="widget-table-left" v-if="platform != 'mobile'">
          <div class="widget-table-left__top">#</div>
          <div class="widget-table-left__body">1</div>
        </div>
        <div class="widget-table-top" v-if="platform == 'mobile'"># 1</div>
        <div
          class="widget-table-content"
          :class="{ mobile: platform == 'mobile' }"
        >
          <div v-if="element.tableColumns.length == 0" class="table-empty">
            {{ $t('fm.description.tableEmpty') }}
          </div>

          <div
            :style="{
              width: platform != 'mobile' ? columnsWidthStyle : '100%',
            }"
          >
            <draggable
              v-model="element.tableColumns"
              :group="{ name: 'people', put: handlePut }"
              ghost-class="ghost"
              :animation="200"
              handle=".drag-widget"
              :no-transition-on-drag="true"
              @add="handleWidgetTableAdd($event, element)"
              @update="handleWidgetTableUpdate"
              class="widget-table-col"
              item-key="key"
            >
              <template #item="{ element: item, index }">
                <widget-table-item
                  :key="item.key"
                  :element="item"
                  v-model:select="selectWidget"
                  :index="index"
                  :data="element.tableColumns"
                  @select-change="handleSelectChange($event, item)"
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-table-item>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </el-form-item>
    <div
      class="widget-view-action widget-col-action"
      v-if="selectWidget.key == element.key"
    >
      <i
        class="iconfont icon-icon_clone"
        @click.stop="handleTableClone(index)"
        :title="$t('fm.tooltip.clone')"
      ></i>
      <i
        class="iconfont icon-trash"
        @click.stop="handleWidgetDelete(index)"
        :title="$t('fm.tooltip.trash')"
      ></i>
    </div>

    <div
      class="widget-view-drag widget-col-drag"
      v-if="selectWidget.key == element.key"
    >
      <i class="iconfont icon-drag drag-widget"></i>
    </div>
    <div class="widget-view-model" v-if="element.options.dataBind">
      <span>{{ element.model }}</span>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable/src/vuedraggable'
import WidgetTableItem from './WidgetTableItem.vue'
import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'

export default {
  components: {
    Draggable,
    WidgetTableItem,
  },
  props: [
    'element',
    'select',
    'index',
    'data',
    'ds',
    'bindDataTable',
    'tableName',
    'platform',
    'formKey',
  ],
  emits: ['select-change', 'update:select'],
  data() {
    return {
      selectWidget: this.select || {},
      columnsWidthStyle: '200px',
    }
  },
  mounted() {
    this.calcTableColumnsWidth()
  },
  methods: {
    handleSelectWidget(index) {
      this.$emit('update:select', this.data.list[index])
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
    handleTableClone(index) {
      let cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.$emit('update:select', this.data.list[index + 1])

        this.$nextTick(() => {
          EventBus.$emit('on-history-add-' + this.formKey)
        })
      })
    },
    handleWidgetTableUpdate(evt) {
      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      })
    },
    calcTableColumnsWidth() {
      this.columnsWidthStyle = 'calc(200px)'

      let widthArray = []

      for (let i = 0; i < this.element.tableColumns.length; i++) {
        if (
          !this.element.tableColumns[i].options.width ||
          this.element.tableColumns[i].options.width == '100%'
        ) {
          widthArray.push('200px')
        } else {
          widthArray.push(this.element.tableColumns[i].options.width)
        }
      }

      widthArray.length &&
        (this.columnsWidthStyle = `calc(200px + ${widthArray.join(' + ')})`)
    },
    handlePut(a, b, c) {
      if (
        c.className.indexOf('widget-col') >= 0 ||
        c.className.indexOf('widget-table') >= 0 ||
        c.className.indexOf('widget-tab') >= 0 ||
        c.className.indexOf('widget-report') >= 0 ||
        c.className.indexOf('widget-inline') >= 0 ||
        c.className.indexOf('no-put') >= 0 ||
        c.children[0].className.indexOf('no-put') >= 0
      ) {
        return false
      }
      return true
    },
    handleWidgetTableAdd($event, table) {
      const newIndex = $event.newIndex
      const key = Math.random().toString(36).slice(-8)
      table.tableColumns[newIndex] = _.cloneDeep(table.tableColumns[newIndex])
      if (this.bindDataTable) {
        table.tableColumns[newIndex] = {
          ...table.tableColumns[newIndex],
          options: {
            ...table.tableColumns[newIndex].options,
            remoteFunc:
              table.tableColumns[newIndex].options.remoteFunc || 'func_' + key,
            remoteOption:
              table.tableColumns[newIndex].options.remoteOption ||
              'option_' + key,
            width: '200px',
            tableColumn: true,
          },
          novalid: {
            ...table.tableColumns[newIndex].novalid,
          },
          key: table.tableColumns[newIndex].key
            ? table.tableColumns[newIndex].key
            : key,
          dsId: this?.ds?.id ?? 'master',
          enName: this?.ds?.enName ?? 'master',
          tableName: this?.tableName ?? '',
          model: '',
          rules: table.tableColumns[newIndex].rules
            ? [...table.tableColumns[newIndex].rules]
            : [],
        }
      } else {
        table.tableColumns[newIndex] = {
          ...table.tableColumns[newIndex],
          options: {
            ...table.tableColumns[newIndex].options,
            remoteFunc:
              table.tableColumns[newIndex].options.remoteFunc || 'func_' + key,
            remoteOption:
              table.tableColumns[newIndex].options.remoteOption ||
              'option_' + key,
            tableColumn: true,
          },
          novalid: {
            ...table.tableColumns[newIndex].novalid,
          },
          key: table.tableColumns[newIndex].key
            ? table.tableColumns[newIndex].key
            : key,
          model: table.tableColumns[newIndex].model
            ? table.tableColumns[newIndex].model
            : table.tableColumns[newIndex].type + '_' + key,
          rules: table.tableColumns[newIndex].rules
            ? [...table.tableColumns[newIndex].rules]
            : [],
        }
      }

      this.$emit('update:select', table.tableColumns[newIndex])

      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      })
    },
    handleSelectChange(index, item) {
      setTimeout(() => {
        index >= 0
          ? this.$emit('update:select', this.element.tableColumns[index])
          : this.$emit('update:select', this.data.list[this.index])
      })
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget(val) {
      this.$emit('update:select', val)
    },
    element: {
      deep: true,
      handler(val) {
        this.calcTableColumnsWidth()
      },
    },
  },
}
</script>
