<template>
  <div
    class="widget-col widget-view"
    :class="{
      active: select.key && select.key == element.key,
      is_hidden: element.options.hidden,
    }"
    @click.stop="handleSelectWidget(index)"
  >
    <el-row
      :type="element.options.flex ? 'flex' : ''"
      :gutter="element.options.gutter || 0"
      :justify="element.options.justify"
      :align="element.options.align"
      :class="{
        [element.options && element.options.customClass]:
          element.options && element.options.customClass ? true : false,
      }"
    >
      <el-col
        class="widget-col-item"
        v-for="(item, i) in element.columns"
        :key="item.key"
        :class="{
          active: select.key && select.key == item.key,
          [item.options && item.options.customClass]:
            item.options && item.options.customClass ? true : false,
        }"
        @click.stop="handleSelectItemWidget(i)"
        :span="getColSpan(item.options)"
        :offset="item.options ? item.options.offset : 0"
        :push="item.options ? item.options.push : 0"
        :pull="item.options ? item.options.pull : 0"
      >
        <!-- <div v-if="element.columns[i].list.length == 0" class="widget-empty">{{$t('fm.description.tableEmpty')}}</div> -->
        <draggable
          :list="element.columns[i].list"
          v-bind="{
            group: 'people',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.drag-widget',
          }"
          :no-transition-on-drag="true"
          @add="handleWidgetColAdd($event, element, i)"
          @update="handleWidgetColUpdate"
          class="widget-col-list"
          item-key="key"
        >
          <template #item="{ element: col, index: colindex }">
            <!--jeeplus-->
            <widget-col-item
              v-if="col.type === 'grid'"
              :key="col.key"
              :element="col"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              v-model:select="selectWidget"
              :index="colindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :platform="platform"
              :form-key="formKey"
            >
            </widget-col-item>

            <!--jeeplus-->
            <widget-tab-item
              v-else-if="col.type === 'tabs'"
              :key="col.key"
              :element="col"
              v-model:select="selectWidget"
              :index="colindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              :platform="platform"
              :form-key="formKey"
            >
            </widget-tab-item>

            <!--jeeplus-->
            <widget-report
              v-else-if="col.type === 'report'"
              :key="col.key"
              :element="col"
              v-model:select="selectWidget"
              :index="colindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              :platform="platform"
              :form-key="formKey"
            >
            </widget-report>

            <!--jeeplus-->
            <widget-table
              v-else-if="col.type === 'table'"
              :key="col.key"
              :element="col"
              v-model:select="selectWidget"
              :index="colindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              :platform="platform"
              :form-key="formKey"
            >
            </widget-table>

            <widget-inline
              v-else-if="col.type === 'inline'"
              :key="col.key"
              :element="col"
              v-model:select="selectWidget"
              :index="colindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :platform="platform"
              :form-key="formKey"
            >
            </widget-inline>

            <widget-form-item
              v-else
              :key="col.key"
              :element="col"
              v-model:select="selectWidget"
              :index="colindex"
              :data="item"
              @select-change="handleSelectChange($event, item)"
              :form-key="formKey"
            >
            </widget-form-item>
          </template>
        </draggable>

        <div
          class="widget-view-action widget-col-action"
          v-if="select.key == item.key"
        >
          <i
            class="iconfont icon-icon_clone"
            @click.stop="handleColItemClone(index, i)"
            :title="$t('fm.tooltip.clone')"
          ></i>
          <i
            class="iconfont icon-trash"
            @click.stop="handleColItemDelete(index, i)"
            v-if="element.columns.length > 1"
            :title="$t('fm.tooltip.trash')"
          ></i>
        </div>
      </el-col>
    </el-row>

    <div
      class="widget-view-action widget-col-action"
      v-if="select.key == element.key"
    >
      <i
        class="iconfont icon-tianjiazengjiajia"
        @click.stop="handleAddCol(index)"
        :title="$t('fm.actions.addColumn')"
      ></i>

      <i
        class="iconfont icon-icon_clone"
        @click.stop="handleColClone(index)"
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
      v-if="select.key == element.key"
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
import WidgetTabItem from './WidgetTabItem.vue'
import WidgetInline from './WidgetInline.vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'
import { generateKeyToTD, generateKeyToCol, fixDraggbleList } from '../util'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'widget-col-item',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetTable,
    WidgetTabItem,
    WidgetInline,
    WidgetReport: defineAsyncComponent(() => import('./WidgetReport.vue')),
  },
  props: [
    'element',
    'select',
    'index',
    'data',
    'platform',
    'formKey',
    'ds',
    'bindDataTable',
    'tableName',
  ], //jeeplus
  emits: ['select-change', 'update:select'],
  data() {
    return {
      selectWidget: this.select || {},
      selectIndex: -1,
    }
  },
  methods: {
    getColSpan(options) {
      if (this.platform == 'pc') {
        return options && options.md
      }
      if (this.platform == 'pad') {
        return options && options.sm
      }
      if (this.platform == 'mobile') {
        return options && options.xs
      }
    },
    handleSelectWidget(index) {
      this.$emit('update:select', this.data.list[index])
    },
    handleSelectItemWidget(i) {
      this.$emit('update:select', this.data.list[this.index].columns[i])

      this.selectIndex = i
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

    handleColItemDelete(index, i) {
      this.data.list[index].columns.splice(i, 1)

      if (i == 0) {
        this.$emit('update:select', this.data.list[index].columns[0])
      } else {
        this.$emit('update:select', this.data.list[index].columns[i - 1])
      }

      setTimeout(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      }, 20)
    },

    handleAddCol(index) {
      this.data.list[index].columns.push({
        type: 'col',
        options: {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0,
          xs: 24,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
          customClass: '',
        },
        list: [],
        key: Math.random().toString(36).slice(-8),
      })

      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      })
    },

    handleColClone(index) {
      let cloneData = _.cloneDeep(this.data.list[index])
      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.data.list[index + 1]

        this.$nextTick(() => {
          EventBus.$emit('on-history-add-' + this.formKey)
        })
      })
    },

    handleColItemClone(index, i) {
      let cloneData = _.cloneDeep(this.data.list[index].columns[i])
      this.data.list[index].columns.splice(i + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.$emit('update:select', this.data.list[index].columns[i + 1])

        this.$nextTick(() => {
          EventBus.$emit('on-history-add-' + this.formKey)
        })
      })
    },

    handleWidgetColUpdate(evt) {
      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      })
    },

    handleWidgetColAdd($event, row, colIndex) {
      const newIndex = $event.newIndex

      fixDraggbleList(row.columns[colIndex].list, newIndex)

      row.columns[colIndex].list[newIndex] = _.cloneDeep(
        row.columns[colIndex].list[newIndex]
      )

      const key = Math.random().toString(36).slice(-8)

      if (this.bindDataTable) {
        //jeeplus
        row.columns[colIndex].list[newIndex] = {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            remoteFunc:
              row.columns[colIndex].list[newIndex].options.remoteFunc ||
              'func_' + key,
            remoteOption:
              row.columns[colIndex].list[newIndex].options.remoteOption ||
              'option_' + key,
            tableColumn: false,
          },
          novalid: {
            ...row.columns[colIndex].list[newIndex].novalid,
          },
          key: row.columns[colIndex].list[newIndex].key
            ? row.columns[colIndex].list[newIndex].key
            : key,
          dsId: this?.ds?.id ?? 'master', //jeeplus begin
          enName: this?.ds?.enName ?? 'master',
          tableName: this?.tableName ?? '',
          model: '', // jeeplus end
          rules: row.columns[colIndex].list[newIndex].rules
            ? [...row.columns[colIndex].list[newIndex].rules]
            : [],
        }
      } else {
        row.columns[colIndex].list[newIndex] = {
          ...row.columns[colIndex].list[newIndex],
          options: {
            ...row.columns[colIndex].list[newIndex].options,
            remoteFunc:
              row.columns[colIndex].list[newIndex].options.remoteFunc ||
              'func_' + key,
            remoteOption:
              row.columns[colIndex].list[newIndex].options.remoteOption ||
              'option_' + key,
            tableColumn: false,
          },
          novalid: {
            ...row.columns[colIndex].list[newIndex].novalid,
          },
          key: row.columns[colIndex].list[newIndex].key
            ? row.columns[colIndex].list[newIndex].key
            : key,
          model: row.columns[colIndex].list[newIndex].model
            ? row.columns[colIndex].list[newIndex].model
            : row.columns[colIndex].list[newIndex].type + '_' + key,
          rules: row.columns[colIndex].list[newIndex].rules
            ? [...row.columns[colIndex].list[newIndex].rules]
            : [],
        }
      }

      if (row.columns[colIndex].list[newIndex].type == 'report') {
        row.columns[colIndex].list[newIndex].rows = generateKeyToTD(
          row.columns[colIndex].list[newIndex].rows
        )
      }

      if (row.columns[colIndex].list[newIndex].type == 'grid') {
        row.columns[colIndex].list[newIndex].columns = generateKeyToCol(
          row.columns[colIndex].list[newIndex].columns
        )
      }

      this.$emit('update:select', row.columns[colIndex].list[newIndex])

      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      })
    },
    handleSelectChange(index, item) {
      setTimeout(() => {
        index >= 0
          ? this.$emit('update:select', item.list[index])
          : this.$emit('update:select', {})
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
  },
}
</script>
