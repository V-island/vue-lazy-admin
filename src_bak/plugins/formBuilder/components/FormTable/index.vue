<template>
  <div class="form-table" :class="{ 'is-disabled': disableddata }">
    <el-table
      :data="paging ? pagingData : tableData"
      border
      :class="{ 'form-table-pc': !preview }"
      v-show="(preview && platform != 'mobile') || !preview"
    >
      <el-table-column label="#" fixed width="50">
        <template #default="scope">
          <div class="scope-index">
            <span>{{
              (paging ? pageSize * (currentPage - 1) : 0) + scope.$index + 1
            }}</span>
          </div>
          <div class="scope-action">
            <el-button
              v-if="!printRead"
              :disabled="disableddata"
              @click="
                handleRemove(
                  (paging ? pageSize * (currentPage - 1) : 0) + scope.$index
                )
              "
              type="danger"
              size="small"
              circle
              ><i
                class="iconfont icon-trash"
                style="font-size: 12px; margin: 5px"
              ></i
            ></el-button>
            <span v-if="printRead">{{
              (paging ? pageSize * (currentPage - 1) : 0) + scope.$index + 1
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.length == 0"></el-table-column>
      <template v-else>
        <section v-for="column in columns" :key="column.model">
          <el-table-column
            v-if="displayFields[column.model]"
            :label="column.options.hideLabel ? '' : column.name"
            :width="column.options.width"
            :label-class-name="column.options.required ? 'required' : ''"
          >
            <template #default="scope">
              <el-form-item
                :ref="`${name}-item`"
                :prop="`${name}.${
                  (paging ? pageSize * (currentPage - 1) : 0) + scope.$index
                }.${column.model}`"
                :rules="rules[`${name}.${column.model}`]"
              >
                <GenerateElementItem
                  :edit="
                    !tableDisabledFields[scope.$index][column.model] &&
                    !disableddata
                  "
                  :blanks="blanks"
                  :is-table="true"
                  :widget="column"
                  v-model="scope.row[column.model]"
                  :models="
                    tableData[
                      (paging ? pageSize * (currentPage - 1) : 0) + scope.$index
                    ]
                  "
                  :remote="remote"
                  :remote-option="remoteOption"
                  :row-index="
                    (paging ? pageSize * (currentPage - 1) : 0) + scope.$index
                  "
                  :table-name="name"
                  :event-function="eventFunction"
                  :data-source-value="dataSourceValue"
                  :print-read="printRead"
                  @on-table-change="handleTableChange"
                  v-if="!tableHideFields?.[scope.$index]?.[column.model]"
                >
                  <template v-slot:[blank.name] v-for="blank in blanks" :key="blank.name">
                    <slot :name="blank.name" :model="scope.row"></slot>
                  </template>
                </GenerateElementItem>
              </el-form-item>
            </template>
          </el-table-column>
        </section>
      </template>
    </el-table>

    <div
      class="form-table-mobile"
      v-show="(preview && platform === 'mobile') || !preview"
      :style="{ display: preview && platform === 'mobile' ? 'block' : '' }"
    >
      <div
        class="form-table-mobile-item"
        v-for="(t, index) in paging ? pagingData : tableData"
        :key="(paging ? pageSize * (currentPage - 1) : 0) + index"
      >
        <div class="form-table-mobile-item__top">
          <span
            >#
            {{ (paging ? pageSize * (currentPage - 1) : 0) + index + 1 }}</span
          >
          <el-button
            v-if="!printRead"
            :disabled="disableddata"
            @click="
              handleRemove((paging ? pageSize * (currentPage - 1) : 0) + index)
            "
            type="danger"
            size="small"
            circle
            ><i
              class="iconfont icon-trash"
              style="font-size: 12px; margin: 5px"
            ></i
          ></el-button>
        </div>
        <div class="form-table-mobile-item__content">
          <section v-for="column in columns" :key="column.key">
            <el-form-item
              :ref="`${name}-item`"
              v-if="displayFields[column.model]"
              :label="column.options.hideLabel ? '' : column.name"
              :label-width="
                column.options.hideLabel
                  ? '0px'
                  : column.options.isLabelWidth
                  ? column.options.labelWidth + 'px'
                  : ''
              "
              :prop="`${name}.${
                (paging ? pageSize * (currentPage - 1) : 0) + index
              }.${column.model}`"
              :rules="rules[`${name}.${column.model}`]"
            >
              <GenerateElementItem
                :edit="
                  !tableDisabledFields[index][column.model] && !disableddata
                "
                :blanks="blanks"
                :is-table="true"
                :widget="column"
                v-model="
                  tableData[
                    (paging ? pageSize * (currentPage - 1) : 0) + index
                  ][column.model]
                "
                :models="
                  tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]
                "
                :remote="remote"
                :remote-option="remoteOption"
                :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
                :table-name="name"
                :event-function="eventFunction"
                :data-source-value="dataSourceValue"
                :print-read="printRead"
                @on-table-change="handleTableChange"
                :is-mobile="true"
                v-if="!tableHideFields?.[index]?.[column.model]"
              >
                <template v-slot:[blank.name] v-for="blank in blanks" :key="blank.name">
                  <slot
                    :name="blank.name"
                    :model="
                      tableData[
                        (paging ? pageSize * (currentPage - 1) : 0) + index
                      ]
                    "
                  ></slot>
                </template>
              </GenerateElementItem>
            </el-form-item>
          </section>
        </div>
      </div>
    </div>

    <el-row>
      <el-col
        :span="(preview && platform != 'mobile') || !preview ? 12 : 24"
        :xs="24"
      >
        <el-button type="text" @click="handleAddRow" v-if="!disableddata">
          <i class="iconfont icon-plus" style="font-size: 12px; margin: 5px"></i
          >{{ $t('fm.actions.add') }}
        </el-button>
      </el-col>
      <el-col
        :span="
          ((preview && platform != 'mobile') || !preview) && !disableddata
            ? 12
            : 24
        "
        :xs="24"
      >
        <el-pagination
          style="float: right"
          layout="total, prev, pager, next"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="tableData.length"
          :pager-count="5"
          @current-change="handlePageChange"
          v-if="paging && tableData.length"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    GenerateElementItem: defineAsyncComponent(() =>
      import('../GenerateElementItem.vue')
    ),
  },
  props: [
    'columns',
    'value',
    'models',
    'remote',
    'blanks',
    'disableddata',
    'rules',
    'name',
    'remoteOption',
    'preview',
    'platform',
    'dataSourceValue',
    'eventFunction',
    'widget',
    'printRead',
    'formComponent',
    'paging',
    'pageSize',
  ],

  data() {
    return {
      tableData: this.value,
      displayFields: {},
      changeItem: {},
      pagingData: [],
      currentPage: 1,
      tableHideFields: this.value
        ? this.value.map((item) =>
            Object.keys(item).map((o) => ({ [o]: false }))
          )
        : [],
      tableDisabledFields: this.value
        ? this.value.map((item) =>
            Object.keys(item).map((o) => ({ [o]: false }))
          )
        : [],
    }
  },
  created() {
    for (let i = 0; i < this.columns.length; i++) {
      this.displayFields[this.columns[i].model] =
        !this.columns[i].options.hidden
    }

    this.loadPagingData()
  },
  methods: {
    handleAddRow() {
      let item = {}
      let hideItem = {}
      let disabledItem = {}

      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].type === 'blank') {
          item[this.columns[i].model] =
            this.columns[i].options.defaultType == 'String'
              ? ''
              : this.columns[i].options.defaultType == 'Object'
              ? {}
              : []
        } else if (
          this.columns[i].type === 'component' ||
          this.columns[i].type === 'link' ||
          this.columns[i].type === 'button'
        ) {
          item[this.columns[i].model] = undefined
        } else {
          item[this.columns[i].model] = JSON.parse(
            JSON.stringify(this.columns[i].options.defaultValue)
          )
        }
        hideItem[this.columns[i].model] = false
        disabledItem[this.columns[i].mode] = false
      }

      this.tableData.push(item)
      this.tableHideFields.push(hideItem)
      this.tableDisabledFields.push(disabledItem)

      if (this.widget && this.widget.events && this.widget.events.onRowAdd) {
        let funcKey = this.widget.events.onRowAdd

        this.eventFunction[funcKey]({
          rowIndex: this.tableData.length - 1,
          field: this.widget.model,
        })
      }

      this.changeItem = {}

      if (this.paging) {
        this.$nextTick(() => {
          if (this.tableData.length > this.currentPage * this.pageSize) {
            this.currentPage =
              parseInt((this.tableData.length - 1) / this.pageSize) + 1
          }

          this.loadPagingData()
        })
      }
    },

    handleRemove(index) {
      this.tableData.splice(index, 1)

      if (this.widget && this.widget.events && this.widget.events.onRowRemove) {
        let funcKey = this.widget.events.onRowRemove

        this.eventFunction[funcKey]({
          removeIndex: index,
          field: this.widget.model,
        })
      }

      this.changeItem = {}

      this.pagingData = []

      if (this.paging) {
        this.$nextTick(() => {
          if (
            this.tableData.length % this.pageSize == 0 &&
            this.currentPage > parseInt(this.tableData.length / this.pageSize)
          ) {
            this.currentPage = parseInt(this.tableData.length / this.pageSize)
          }

          this.loadPagingData()
        })
      }
    },
    hideChild(rowIndex, fields) {
      fields.forEach((field) => {
        this.tableHideFields[rowIndex][field] = true
      })
    },
    displayChild(rowIndex, fields) {
      fields.forEach((field) => {
        this.tableHideFields[rowIndex][field] = false
      })
    },
    hide(fields) {
      Object.keys(this.displayFields).forEach((key) => {
        if (fields.indexOf(key) >= 0) {
          this.displayFields[key] = false
        }
      })

      this.displayFields = { ...this.displayFields }
    },
    display(fields) {
      Object.keys(this.displayFields).forEach((key) => {
        if (fields.indexOf(key) >= 0) {
          this.displayFields[key] = true
        }
      })
      this.displayFields = { ...this.displayFields }
    },
    disabledChild(rowIndex, fields, disabled) {
      fields.forEach((field) => {
        this.tableDisabledFields[rowIndex][field] = disabled
      })
    },
    disabled(fields, disabled) {
      for (let i = 0; i < this.columns.length; i++) {
        if (fields.indexOf(this.columns[i].model) >= 0) {
          this.columns[i].options.disabled = disabled
        }
      }
    },
    handleTableChange(value) {
      this.changeItem = value
    },

    handlePageChange(val) {
      this.currentPage = val

      this.pagingData = []

      this.$nextTick(() => {
        this.loadPagingData()

        this.$refs[this.name + '-item'].forEach((item) => {
          item.clearValidate()
        })
      })
    },

    loadPagingData() {
      let beginIndex = (this.currentPage - 1) * this.pageSize

      let endIndex = beginIndex + this.pageSize

      this.pagingData = this.tableData.slice(beginIndex, endIndex)
    },
  },
  watch: {
    value(val) {
      this.tableData = val

      let hideFields = []
      let disabledFields = []
      for (let i = 0; i < this.value.length; i++) {
        let row = this.value[i]
        let rowArray = Object.keys(row)
        let hideRow = {}
        let disabledRow = {}
        for (let f = 0; f < rowArray.length; f++) {
          hideRow[rowArray[f]] =
            this.tableHideFields?.[i]?.[rowArray[f]] ?? false
          disabledRow[rowArray[f]] =
            this.tableDisabledFields?.[i]?.[rowArray[f]] ?? false
        }

        hideFields.push(hideRow)
        disabledFields.push(disabledRow)
      }

      this.tableHideFields = hideFields
      this.tableDisabledFields = disabledFields
    },
    tableData: {
      deep: true,
      handler(val) {
        this.loadPagingData()

        if (this.changeItem.haveEvent) {
          this.eventFunction[this.changeItem.haveEvent](this.changeItem)
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.form-table {
  position: relative;

  .el-form-item {
    margin-top: 2px;
  }

  .el-table th.required > div::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    background: transparent;
    vertical-align: top;
  }

  .el-table td {
    padding-bottom: 0;
  }

  .el-table__header-wrapper {
    background: #f5f7fa;

    div,
    th {
      background: #f5f7fa;
    }

    th.el-table-fixed-column--left {
      background: #f5f7fa;
    }
  }

  .el-table__fixed-header-wrapper {
    div,
    th {
      background: #f5f7fa;
    }
  }

  .el-table__empty-block {
    // display: none;
    min-height: 50px;
  }

  .scope-action {
    display: none;
    margin-bottom: 18px;
  }

  .scope-index {
    display: block;
    margin-bottom: 18px;
  }

  .hover-row {
    .scope-action {
      display: block;
      .el-button {
        padding: 3px;
      }
    }

    .scope-index {
      display: none;
    }
  }

  .form-table-pc {
    display: block;
  }

  .form-table-mobile {
    display: none;

    .form-table-mobile-item {
      border: 1px solid #ebeef5;
      // background:  #f5f7fa;
      margin-bottom: 10px;

      .form-table-mobile-item__top {
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        background: #f5f7fa;
        border-bottom: 1px solid #ebeef5;
        font-weight: 500;

        button {
          float: right;
          margin-top: 4px;
        }
      }

      .form-table-mobile-item__content {
        padding: 8px;
        // background: #fff;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .form-table {
    .form-table-pc {
      display: none;
    }

    .form-table-mobile {
      display: block;
    }
  }
}
</style>
