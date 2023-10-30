<template>
  <section>
    <div :class="$slots.topSearch ? 'top-search' : ''">
      <slot name="topSearch"></slot>
    </div>

    <g-box :title="title">
      <template #extra>
        <g-toolbar class="top-group">
          <slot name="topButton"></slot>
          <template v-if="$slots.topRightButton" #right>
            <slot name="topRightButton"></slot>
          </template>
        </g-toolbar>
      </template>

      <a-table
        ref="table"
        size="small"
        :class="className"
        :columns="columns"
        :bordered="bordered"
        :data-source="data"
        :pagination="pagination"
        :loading="loading"
        :isShowCheck="isShowCheck"
        :rowKey="rowKey"
        :row-selection="rowSelection"
        :scroll="scroll"
        :row-class-name="(record, index) => tableRowClass(record, index)"
        type="radio"
        :style="{ maxHeight: height }"
        sticky
        @resizeColumn="handleResizeColumn"
      >
        <template v-slot:bodyCell="{ column, record, index }">
          <slot name="index" :scope="record" v-if="column?.dataIndex == 'index'">{{
            index + 1
          }}</slot>
          <slot v-else :name="column?.dataIndex" :scope="record" :index="index"></slot>
        </template>

        <template v-slot:headerCell="{ title, column }">
          <slot :name="column?.solt" :title="title" :column="column"></slot>
        </template>

        <template v-if="slotTitle" #title><slot name="title"></slot></template>
        <template v-if="slotFooter" #footer><slot name="footer"></slot></template>
        <template v-if="slotSummary" #summary><slot name="summary"></slot></template>
      </a-table>
      <div :class="$slots.footerButton ? 'footer-group' : ''">
        <a-space align="center" :size="20">
          <slot name="footerButton"></slot>
        </a-space>
      </div>
    </g-box>
  </section>
</template>
<script>
import {
  defineComponent,
  watch,
  computed,
  ref,
  reactive,
  useSlots,
  toRef,
  toRefs,
  onMounted,
} from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: () => '数据列表',
    },
    // 每一行的id不同传过来
    rowKey: {
      type: String,
      default: () => 'id',
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    bordered: {
      type: Boolean,
      default: () => false,
    },
    data: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: () => 0,
    },
    // 是否有复选框
    isShowCheck: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: '',
    },
    tableRowClass: {
      type: Function,
      default: () => () => {
        return '';
      },
    },
    pageCurrent: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    rowSelectionObj: {
      type: Object,
      default: () => {},
    },
    scroll: {
      type: Object,
      default: () => {},
    },
    showSizeChanger: {
      type: Boolean,
      default: true,
    },
    showQuickJumper: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: 'auto',
    },
  },
  emits: ['handlePage', 'selectChange', 'handleSelect', 'onSelectAll'],
  setup(props, { emit }) {
    const { total, pageCurrent, pageSize } = toRefs(props);
    const pagination = reactive({
      current: pageCurrent,
      pageSize: pageSize,
      total: total,
      pageSizeOptions: ['10', '20', '50', '100'],
      showTotal: (total) => `共 ${total}条`,
      showSizeChanger: props.showSizeChanger,
      showQuickJumper: props.showQuickJumper,
      // hideOnSinglePage: true,
      onChange: (page, pageSize) => handlePage(page, pageSize),
    });
    // 判断<slot name="title">是否传值
    const slotTitle = !!useSlots().title;
    // 判断<slot name="footer">是否传值
    const slotFooter = !!useSlots().footer;
    // 判断<slot name="summary">是否传值
    const slotSummary = !!useSlots().summary;

    const columns = ref([]);

    const rowSelection = computed(() => {
      return {
        ...props.rowSelectionObj,
        checkStrictly: false,
        onChange: (selectedRowKeys, selectedRows) => {
          emit('selectChange', selectedRowKeys, selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
          emit('handleSelect', record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          emit('onSelectAll', selected, selectedRows, changeRows);
        },
      };
    });

    const handlePage = (page, pageSize) => {
      emit('handlePage', page, pageSize);
    };

    watch(
      () => props.columns,
      (val) => {
        columns.value = val;
      },
      {
        deep: true,
        immediate: true,
      },
    );
    return {
      slotTitle,
      slotFooter,
      slotSummary,
      current: ref(1),
      columns,
      data: toRef(props, 'data'),
      resetPage() {
        pagination.current = 1;
        // pagination.pageSize = 10
      },
      rowSelection: props.isShowCheck ? rowSelection : null,
      handlePage,
      pagination: props.pagination ? pagination : ref(props.pagination),
      handleResizeColumn: (w, col) => {
        col.width = w;
      },
    };
  },
});
</script>
<style lang="scss" scoped>
// 搜索框
.top-search {
  margin-bottom: $--layout-padding;

  :deep(.ant-form-item) {
    margin-bottom: $--layout-padding;
  }
}
// 顶部按钮组
.top-group {
  margin-bottom: 0;

  :deep(.ant-btn) {
    margin-right: $--layout-padding;

    &:last-child {
      margin-right: 0;
    }
  }
  :deep(.ant-form-item) {
    margin-bottom: $--layout-padding;
  }
}
// 底部按钮组
.footer-group {
  @include flexbox();
  margin-top: $--layout-padding;
}

:deep(.ant-table-wrapper) {
  .ant-table-thead {
    > tr > td,
    > tr > th {
      background-color: transparent;
    }
  }

  .ant-table-body {
    .ant-table-tbody {
      > tr {
        > td,
        > th {
          background-color: #fafafa;
        }
        &:nth-child(2n) {
          > td,
          > th {
            background-color: $--color-white;
          }
        }
      }
    }
  }
  .ant-table-cell-fix-left,
  .ant-table-cell-fix-right {
    background-color: $--color-white !important;
  }
}
</style>
