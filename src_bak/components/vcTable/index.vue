<template>
  <!-- 调用示例 -->
  <!-- <vc-table :data="tableData" :current-page="page" >
        <el-table-column  label="item.label" prop="item.prop"></el-table-column>
      </vc-table> -->

  <div class="vc-table">
    <el-table
      ref="table"
      :data="data"
      :height="height"
      :max-height="height"
      :size="size"
      v-loading="loading"
      :row-style="{ height: '41px' }"
      :cell-style="cellStyle"
      :row-class-name="xxxTableRowClassName"
      :show-summary="showSummary"
      :span-method="spanMethod"
      :header-cell-style="{
        'text-align': 'center',
        background: '#E1F2F2',
        color: '#333333',
      }"
      :row-key="rowKey"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblClick"
      @row-click="handleRowClick"
      @row-contextmenu="handleRowContextmenu"
      @row-dblclick="handleRowDblClick"
      @header-click="handleHeaderClick"
      @header-contextmenu="handleHeaderContextmenu"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      @current-change="handleCurrentChange"
      @header-dragend="handleHeaderChange"
      @expand-change="handleExpandChange"
      border
      stripe
    >
      <el-table-column
        v-if="selectionShow"
        :selectable="selectable"
        :reserve-selection="reserveSelection"
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="indexShow"
        type="index"
        label="序号"
        width="55"
        :fixed="indexFixed"
      ></el-table-column>
      <slot></slot>
      <template #empty>
        <div :style="{ height }">暂无数据</div>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-col :xs="24" :sm="24" :md="24" :lg="24" class="page" v-if="pagination">
      <el-pagination
        v-show="!loading"
        class="table-pagination"
        :style="{ textAlign: 'right' }"
        @size-change="handleSizeChange"
        @current-change="handlePaginationCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
      ></el-pagination>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'VcTable',
  props: {
    //表格数据源
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pagination: { type: Boolean, default: true },
    indexShow: { type: Boolean, default: true },
    indexFixed: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    selectionShow: { type: Boolean, default: false },
    reserveSelection: { type: Boolean, default: false },
    showSummary: { type: Boolean, default: false },
    selectable: [Object, Function],
    spanMethod: [Object, Function],
    size: { type: String, default: 'default' },
    rowStyle: [Object, Function],
    cellStyle: [Object, Function],
    headerCellStyle: [Object, Function],
    headerStyle: [Object, Function],
    rowKey: [String, Function],
    // 空数据时显示的文本内容
    emptyText: {
      type: String,
      default: () => {
        return '暂无数据';
      },
    },
    // 当前页数
    currentPage: {
      type: Number,
      default: 1,
    },
    // 当前页数
    selectRow: {
      type: Array,
      default: () => [],
    },
    // 每页显示条目个数
    pageSize: {
      type: Number,
      default: () => {
        return 10;
      },
    },
    // 总条目数
    total: {
      type: Number,
      default: () => {
        return 100;
      },
    },
    height: {
      type: [Number, String],
      default: '485px',
    },
  },
  data() {
    return {};
  },
  methods: {
    /** =========== 事件 ========== */
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    handleSelect(selection, row) {
      this.$emit('select', selection, row);
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    handleSelectAll(selection) {
      this.$emit('select-all', selection);
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection);
    },
    // 当单元格 hover 进入时会触发该事件
    handleCellMouseEnter(row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event);
    },
    // 当单元格 hover 退出时会触发该事件
    handleCellMouseLeave(row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event);
    },
    // 当某个单元格被点击时会触发该事件
    handleCellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event);
    },
    // 当某个单元格被双击击时会触发该事件
    handleCellDblClick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event);
    },
    // 当某一行被点击时会触发该事件
    handleRowClick(row, column, event) {
      this.$emit('row-click', row, column, event);
    },
    // 当某一行被鼠标右键点击时会触发该事件
    handleRowContextmenu(row, column, event) {
      this.$emit('row-contextmenu', row, column, event);
    },
    // 当某一行被双击时会触发该事件
    handleRowDblClick(row, column, event) {
      this.$emit('row-dblclick', row, column, event);
    },
    // 当某一列的表头被点击时会触发该事件
    handleHeaderClick(column, event) {
      this.$emit('header-click', column, event);
    },
    // 当某一列的表头被鼠标右键点击时触发该事件
    handleHeaderContextmenu(column, event) {
      this.$emit('header-contextmenu', column, event);
    },
    // 当表格的排序条件发生变化的时候会触发该事件
    handleSortChange({ column, prop, order }) {
      this.$emit('sort-change', { column, prop, order });
    },
    // 当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。
    handleFilterChange(filters) {
      this.$emit('filter-change', filters);
    },
    // 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('table-current-change', currentRow, oldCurrentRow);
    },
    // 当拖动表头改变了列的宽度的时候会触发该事件
    handleHeaderChange(newWidth, oldWidth, column, event) {
      this.$emit('header-dragend', newWidth, oldWidth, column, event);
    },
    // 当用户对某一行展开或者关闭的时候会触发该事件（展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded）
    handleExpandChange(row, expanded) {
      this.$emit('expand-change', row, expanded);
    },
    xxxTableRowClassName({ rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
        return 'selectRowColor ';
      }
    },
    /** =========== 分页事件 ========== */
    // 每页条数发生变化
    handleSizeChange(row) {
      this.$emit('size-change', row);
    },
    // currentPage 改变时会触发
    handlePaginationCurrentChange(row) {
      this.$emit('current-change', row);
    },
    /** =========== 方法 ========== */
    // 用于多选表格，清空用户的选择
    clearSelection() {
      return this.$refs.table.clearSelection();
    },
    // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
    toggleRowSelection(row, selected) {
      return this.$refs.table.toggleRowSelection(row, selected);
    },
    // 用于多选表格，切换所有行的选中状态
    toggleAllSelection() {
      return this.$refs.table.toggleAllSelection();
    },
    // 用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）
    toggleRowExpansion(row, expanded) {
      return this.$refs.table.toggleRowExpansion(row, expanded);
    },
    // 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
    setCurrentRow(row) {
      return this.$refs.table.setCurrentRow(row);
    },
    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort() {
      return this.$refs.table.clearSort();
    },
    // 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
    clearFilter(columnKey) {
      return this.$refs.table.clearFilter(columnKey);
    },
    // 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    doLayout() {
      return this.$refs.table.doLayout();
    },
    // 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。
    sort(prop, order) {
      return this.$refs.table.sort(prop, order);
    },
  },
};
</script>

<style lang="scss" scoped>
.vc-table {
  position: relative;

  .table-pagination {
    margin-top: 12px;
  }

  ::v-deep {
    .el-button--text {
      padding: 0px;
    }
  }
}
</style>
