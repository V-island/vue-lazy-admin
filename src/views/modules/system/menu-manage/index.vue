<template>
  <section>
    <vxe-grid ref="table" v-bind="gridOptions"></vxe-grid>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue';
import XEUtils from 'xe-utils'

const serveApiUrl = 'https://api.vxetable.cn/demo'
// 创建VXETable实例
const table = ref(null);
// 创建VXETable配置
const gridOptions = reactive({
  border: true,
  showHeaderOverflow: true,
  showOverflow: true,
  keepSource: true,
  id: 'menu_table',
  height: 730,
  rowConfig: {
    keyField: 'id',
    isHover: true,
  },
  columnConfig: {
    resizable: true,
  },
  printConfig: {
    columns: [
      { field: 'name' },
      { field: 'email' },
      { field: 'nickname' },
      { field: 'age' },
      { field: 'amount' },
    ],
  },
  pagerConfig: {
    background: true,
    pageSize: 10,
    pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
  },
  formConfig: {
    titleWidth: 100,
    titleAlign: 'right',
    items: [
      {
        field: 'name',
        title: '名称',
        span: 8,
      },
      {
        span: 24,
        align: 'center',
        collapseNode: true,
        itemRender: {
          name: '$buttons',
          children: [
            { props: { type: 'submit', content: '搜索', status: 'primary' } },
            { props: { type: 'reset', content: '重置' } },
          ],
        },
      },
    ],
  },
  toolbarConfig: {
    buttons: [
      { code: 'insert_actived', name: '新增' },
      { code: 'delete', name: '直接删除' },
      { code: 'mark_cancel', name: '删除/取消' },
      { code: 'save', name: '保存', status: 'primary' },
    ],
  },
  proxyConfig: {
    seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
    sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
    filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
    form: true, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
    props: {
      // 对应响应结果 Promise<{ result: [], page: { total: 100 } }>
      result: 'result', // 配置响应结果列表字段
      total: 'page.total', // 配置响应结果总页数字段
    },
    // 只接收Promise，具体实现自由发挥
    ajax: {
      // 当点击工具栏查询按钮或者手动提交指令 query或reload 时会被触发
      query: ({ page, sorts, filters, form }) => {
        const queryParams = Object.assign({}, form);
        // 处理排序条件
        const firstSort = sorts[0];
        if (firstSort) {
          queryParams.sort = firstSort.field;
          queryParams.order = firstSort.order;
        }
        // 处理筛选条件
        filters.forEach(({ field, values }) => {
          queryParams[field] = values.join(',');
        });
        return fetch(
          `${serveApiUrl}/api/pub/page/list/${page.pageSize}/${
            page.currentPage
          }?${XEUtils.serialize(queryParams)}`,
        ).then((response) => response.json());
      },
      // 当点击工具栏删除按钮或者手动提交指令 delete 时会被触发
      delete: ({ body }) => {
        return fetch(`${serveApiUrl}/api/pub/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((response) => response.json());
      },
      // 当点击工具栏保存按钮或者手动提交指令 save 时会被触发
      save: ({ body }) => {
        return fetch(`${serveApiUrl}/api/pub/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }).then((response) => response.json());
      },
    },
  },
  columns: [
    {
      field: 'title',
      title: '名称',
    },{
      field: 'icon',
      title: '图标',
    },{
      field: 'type',
      title: '类型',
    },{
      field: 'sort',
      title: '排序',
    },{
      field: 'url',
      title: '菜单URL',
    },{
      field: 'permissions',
      title: '授权标识',
    },
  ],
});
</script>

<style lang="scss" scoped></style>
