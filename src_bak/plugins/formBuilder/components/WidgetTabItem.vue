<template>
  <div
    class="widget-tab widget-view"
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      is_hidden: element.options.hidden,
    }"
    @click.stop="handleSelectWidget(index)"
  >
    <el-tabs
      v-model="tabActive"
      :type="element.options.type"
      :tab-position="element.options.tabPosition"
      :class="{
        [element.options && element.options.customClass]: element.options
          .customClass
          ? true
          : false,
      }"
    >
      <el-tab-pane
        :key="item.name"
        :label="item.label"
        :name="item.name"
        v-for="(item, index) in element.tabs"
      >
        <!-- <div v-if="element.tabs[index].list.length == 0" class="widget-empty">{{$t('fm.description.tableEmpty')}}</div> -->
        <draggable
          v-model="item.list"
          v-bind="{
            group: 'people',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.drag-widget',
          }"
          :no-transition-on-drag="true"
          @add="handleWidgetTabAdd($event, element, index)"
          @update="handleWidgetTabUpdate"
          class="widget-col-list"
          item-key="key"
        >
          <template #item="{ element: tab, index: tabindex }">
            <widget-tab-item
              v-if="tab.type === 'tabs'"
              :key="tab.key"
              :element="tab"
              v-model:select="selectWidget"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              :index="tabindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :platform="platform"
              :form-key="formKey"
            >
            </widget-tab-item>

            <widget-table
              v-else-if="tab.type === 'table'"
              :key="tab.key"
              :element="tab"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              v-model:select="selectWidget"
              :index="tabindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :platform="platform"
              :form-key="formKey"
            >
            </widget-table>

            <widget-inline
              v-else-if="tab.type === 'inline'"
              :key="tab.key"
              :element="tab"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              v-model:select="selectWidget"
              :index="tabindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :platform="platform"
              :form-key="formKey"
            ></widget-inline>

            <widget-report
              v-else-if="tab.type === 'report'"
              :key="tab.key"
              :element="tab"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              v-model:select="selectWidget"
              :index="tabindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :platform="platform"
              :form-key="formKey"
            >
            </widget-report>

            <widget-form-item
              v-else-if="tab.type !== 'grid'"
              :key="tab.key"
              :element="tab"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              v-model:select="selectWidget"
              :index="tabindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :form-key="formKey"
            >
            </widget-form-item>

            <widget-col-item
              v-else
              :key="tab.key"
              :element="tab"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              v-model:select="selectWidget"
              :index="tabindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :platform="platform"
              :form-key="formKey"
            >
            </widget-col-item>
          </template>
        </draggable>
      </el-tab-pane>
    </el-tabs>

    <div
      class="widget-view-action widget-col-action"
      v-if="selectWidget.key == element.key"
    >
      <i
        class="iconfont icon-icon_clone"
        @click.stop="handleTabClone(index)"
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
import WidgetTable from './WidgetTable.vue'
import WidgetInline from './WidgetInline.vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'
import { generateKeyToTD, generateKeyToCol, fixDraggbleList } from '../util'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'widget-tab-item',
  components: {
    WidgetFormItem,
    WidgetTable,
    WidgetInline,
    Draggable,
    WidgetColItem: defineAsyncComponent(() => import('./WidgetColItem.vue')),
    WidgetReport: defineAsyncComponent(() => import('./WidgetReport.vue')),
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
      tabActive: this.element.tabs[0].name,
      selectWidget: this.select || {},
    }
  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
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
    handleTabClone(index) {
      let cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]

        this.$nextTick(() => {
          EventBus.$emit('on-history-add-' + this.formKey)
        })
      })
    },
    handleWidgetTabUpdate(evt) {
      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      })
    },
    handleWidgetTabAdd($event, element, tabIndex) {
      const newIndex = $event.newIndex

      const key = Math.random().toString(36).slice(-8)

      fixDraggbleList(element.tabs[tabIndex].list, newIndex)

      element.tabs[tabIndex].list[newIndex] = _.cloneDeep(
        element.tabs[tabIndex].list[newIndex]
      )
      if (this.bindDataTable) {
        element.tabs[tabIndex].list[newIndex] = {
          ...element.tabs[tabIndex].list[newIndex],
          options: {
            ...element.tabs[tabIndex].list[newIndex].options,
            remoteFunc:
              element.tabs[tabIndex].list[newIndex].options.remoteFunc ||
              'func_' + key,
            remoteOption:
              element.tabs[tabIndex].list[newIndex].options.remoteOption ||
              'option_' + key,
          },
          key: element.tabs[tabIndex].list[newIndex].key
            ? element.tabs[tabIndex].list[newIndex].key
            : key,
          dsId: this?.ds?.id ?? 'master',
          enName: this?.ds?.enName ?? 'master',
          tableName: this?.tableName ?? '',
          model: '',
          tableColumn: false,
          rules: element.tabs[tabIndex].list[newIndex].rules
            ? [...element.tabs[tabIndex].list[newIndex].rules]
            : [],
        }
      } else {
        element.tabs[tabIndex].list[newIndex] = {
          ...element.tabs[tabIndex].list[newIndex],
          options: {
            ...element.tabs[tabIndex].list[newIndex].options,
            remoteFunc:
              element.tabs[tabIndex].list[newIndex].options.remoteFunc ||
              'func_' + key,
            remoteOption:
              element.tabs[tabIndex].list[newIndex].options.remoteOption ||
              'option_' + key,
            tableColumn: false,
          },
          key: element.tabs[tabIndex].list[newIndex].key
            ? element.tabs[tabIndex].list[newIndex].key
            : key,
          model: element.tabs[tabIndex].list[newIndex].model
            ? element.tabs[tabIndex].list[newIndex].model
            : element.tabs[tabIndex].list[newIndex].type + '_' + key,
          rules: element.tabs[tabIndex].list[newIndex].rules
            ? [...element.tabs[tabIndex].list[newIndex].rules]
            : [],
        }
      }

      if (element.tabs[tabIndex].list[newIndex].type == 'report') {
        element.tabs[tabIndex].list[newIndex].rows = generateKeyToTD(
          element.tabs[tabIndex].list[newIndex].rows
        )
      }

      if (element.tabs[tabIndex].list[newIndex].type == 'grid') {
        element.tabs[tabIndex].list[newIndex].columns = generateKeyToCol(
          element.tabs[tabIndex].list[newIndex].columns
        )
      }

      this.selectWidget = element.tabs[tabIndex].list[newIndex]

      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      })
    },
    handleSelectChange(index, item) {
      setTimeout(() => {
        index >= 0
          ? (this.selectWidget = item.list[index])
          : (this.selectWidget = {})
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
