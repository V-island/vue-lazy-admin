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
      <template #loginType="{ scope }">
        <a-tag :color="['1'].includes(`${scope.loginType}`) ? 'success' : 'processing'">{{
          getDictToName(cache.loginTypeList, scope.loginType)
        }}</a-tag>
      </template>
      <template #loginDate="{ scope }">
        {{ $utils.toDateString(scope.loginDate) }}
      </template>
    </g-table>
  </section>
</template>

<script setup>
import { reactive, ref, toRefs, watch, createVNode, onMounted, getCurrentInstance } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { cacheStore } from 'store/cache';
import { utilFn, getDictToName } from 'utils';
import { getLoginLog } from 'api/systemMonitor.js';
import SearchForm from './component/searchForm.vue';

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
    title: '登录账号',
    dataIndex: 'userId',
    align: 'center',
    width: 120,
  },
  {
    title: '登录人',
    dataIndex: 'userName',
    align: 'center',
    width: 180,
  },
  {
    title: '登录类型',
    dataIndex: 'loginType',
    align: 'center',
    width: 180,
    ellipsis: true,
  },
  {
    title: '登录时间',
    dataIndex: 'loginDate',
    align: 'center',
    width: 180,
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
  const res = await getLoginLog(params);
  loading.value = false;
  if (res?.code != 200) return message.error(res.msg);

  const result = res.data || {};
  tableData.value = result.list;
  formState.total = result.total;
};
/** ============= 基础事件 ================ */

onMounted(() => {
  onSearch();
});
</script>

<style lang="scss" scoped></style>
