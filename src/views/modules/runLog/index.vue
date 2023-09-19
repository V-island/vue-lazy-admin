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
      <template #logTime="{ scope }">
        {{ $utils.toDateString(scope.logTime) }}
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
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { cacheStore } from 'store/cache';
import { utilFn, getDictToName } from 'utils';
import { getExceptionLog } from 'api/systemMonitor.js';
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
    title: '请求代码/地址',
    dataIndex: 'urlOrCode',
    align: 'center',
  },
  {
    title: '请求类型',
    dataIndex: 'protocolType',
    align: 'center',
    width: 140,
  },
  {
    title: '日志时间',
    dataIndex: 'logTime',
    align: 'center',
    width: 160,
  },
  {
    title: '请求参数',
    dataIndex: 'params',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '报错信息',
    dataIndex: 'excMsg',
    align: 'center',
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
  const res = await getExceptionLog(params);
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
