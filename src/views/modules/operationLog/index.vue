<template>
  <section>
    <g-table
      ref="gTable"
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :scroll="{ x: '1200' }"
      :total="formState.total"
      :pageCurrent="formState.pageNum"
      :pageSize="formState.pageSize"
      @handlePage="handlePageEvent"
    >
      <template #topSearch>
        <SearchForm :formState="formState" @onSearch="onSearch" />
      </template>
      <template #operationTime="{ scope }">
        {{ $utils.toDateString(scope.operationTime) }}
      </template>
      <template #action="{ scope }">
        <a-button type="link" @click="handleDetailsEvent(scope)">详情</a-button>
      </template>
    </g-table>

    <!-- 查看详情 -->
    <CheckDetails v-if="config.show" :config="config" @onSave="onSearch" />
  </section>
</template>

<script setup>
import { reactive, ref, toRefs, watch, createVNode, onMounted, getCurrentInstance } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { cacheStore } from 'store/cache';
import { utilFn, getDictToName } from 'utils';
import { getOperationLog } from 'api/systemMonitor.js';
import SearchForm from './component/searchForm.vue';
import CheckDetails from './component/checkDetails.vue';

const { proxy } = getCurrentInstance();
const cache = cacheStore();
const loading = ref(false);
const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    align: 'center',
  },
  {
    title: '操作代码',
    dataIndex: 'businessCode',
    align: 'center',
    width: 120,
  },
  {
    title: '操作人',
    dataIndex: 'operationUser',
    align: 'center',
    width: 180,
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    align: 'center',
    width: 180,
  },
  {
    title: '操作内容',
    dataIndex: 'operationContext',
    align: 'center',
    width: 180,
    ellipsis: true,
  },
  {
    title: '请求参数',
    dataIndex: 'params',
    align: 'center',
    width: 180,
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 100,
  },
]);
const tableData = ref([]);
const formState = reactive({
  timeData: [],
  startTime: null,
  endTime: null,
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const config = reactive({
  title: '查看详情',
  show: false,
  params: {},
});

/** ============= 表单/列表事件 ================ */
// 查询
const onSearch = () => {
  formState.pageNum = 1;
  formState.pageSize = 10;
  getTableData();
};
// 分页
const handlePageEvent = (page, size) => {
  formState.pageNum = page;
  formState.pageSize = size;
  getTableData();
};
// 查询列表
const getTableData = async () => {
  const params = {
    ...formState,
  };
  loading.value = true;
  const res = await getOperationLog(params);
  loading.value = false;
  if (res?.code != 200) return message.error(res.msg);

  const result = res.data || {};
  tableData.value = result.list;
  formState.total = result.total;
};
/** ============= 基础事件 ================ */
// 查看详情
const handleDetailsEvent = (scope) => {
  config.title = '查看详情';
  config.show = true;
  config.params = scope;
};

onMounted(() => {
  onSearch();
});
</script>

<style lang="scss" scoped></style>
