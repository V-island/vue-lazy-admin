<template>
  <section>
    <g-table
      ref="gTable"
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :scroll="{ x: '1600' }"
      :total="formState.total"
      :pageCurrent="formState.pageNum"
      :pageSize="formState.pageSize"
      @handlePage="handlePageEvent"
    >
      <template #topSearch>
        <SearchForm :formState="formState" @onSearch="onSearch" />
      </template>
      <template #topButton>
        <a-button type="primary" @click="handleErpPut">发起工作票领料</a-button>
      </template>
      <template #orderState="{ scope }">
        <a-tag v-if="['1', '2'].includes(`${scope.orderState}`)" color="processing">
          {{ getDictToName(cache.orderState, scope.orderState) }}
        </a-tag>
        <a-tag v-else-if="['3'].includes(`${scope.orderState}`)" color="success">
          {{ getDictToName(cache.orderState, scope.orderState) }}
        </a-tag>
        <a-tag v-else color="error">
          {{ getDictToName(cache.orderState, scope.orderState || '0') }}
        </a-tag>
      </template>
      <template #projectId="{ scope }">
        {{
          getDictToName(cache.projectEnum, scope.projectId, {
            value: 'projectId',
            name: 'projectName',
          })
        }}
      </template>
      <template #orderTime="{ scope }">
        {{ $utils.toDateString(scope.orderTime) }}
      </template>
      <template #startTime="{ scope }">
        {{ $utils.toDateString(scope.startTime) }}
      </template>
      <template #pickTime="{ scope }">
        {{ $utils.toDateString(scope.pickTime) || '-' }}
      </template>
      <template #endTime="{ scope }">
        {{ $utils.toDateString(scope.endTime) }}
      </template>
      <template #action="{ scope }">
        <a-button
          type="link"
          v-if="['3'].includes(`${scope.orderState}`)"
          @click="handleStoresReturned(scope)"
          >退料入仓</a-button
        >
        <a-button type="link" @click="handleDetailsEvent(scope)">查看详情</a-button>
      </template>
    </g-table>

    <!-- 新增单据 -->
    <AddOrder v-if="config.show" :config="config" @onSave="onSearch" />
    <!-- 单据详情 -->
    <OrderDetails v-if="orderConfig.show" :config="orderConfig" />
    <!-- 退料入仓 -->
    <StoresReturned v-if="returnConfig.show" :config="returnConfig" />
  </section>
</template>

<script setup>
import { reactive, ref, toRefs, watch, createVNode, onMounted, getCurrentInstance } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { useAuthStore } from 'store/auth';
import { cacheStore } from 'store/cache';
import { utilFn, getDictToName } from 'utils';
import { getTableList } from 'api/order.js';
import SearchForm from './component/searchForm.vue';
import AddOrder from './component/addOrder.vue';
import OrderDetails from './component/orderDetails.vue';
import StoresReturned from './component/storesReturned.vue';

const { proxy } = getCurrentInstance();
const useAuth = useAuthStore();
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
    title: '单据ID',
    dataIndex: 'uuid',
    align: 'center',
    width: 140,
  },
  {
    title: '工作票单号',
    dataIndex: 'workNo',
    align: 'center',
    width: 140,
  },
  {
    title: '工作内容',
    dataIndex: 'workContent',
    align: 'center',
    width: 140,
  },
  {
    title: '主管部门',
    dataIndex: 'dept',
    align: 'center',
    width: 120,
  },
  {
    title: '项目名称',
    dataIndex: 'projectId',
    align: 'center',
    width: 120,
  },
  {
    title: '单据状态',
    dataIndex: 'orderState',
    align: 'center',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'orderTime',
    align: 'center',
    width: 140,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    align: 'center',
    width: 140,
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    align: 'center',
    width: 140,
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 160,
  },
]);
const tableData = ref([]);
const formState = reactive({
  orderNum: '',
  orderType: '3',
  orderState: null,
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const config = reactive({
  title: '新增单据',
  show: false,
  params: {},
});
const orderConfig = reactive({
  title: '单据详情',
  show: false,
  params: {},
});
const returnConfig = reactive({
  title: '发起退料入仓',
  show: false,
  params: {},
});
// 初始化
const initLoadData = () => {
  cache.getProjectEnum();

  getTableData();
};
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
    depotsId: useAuth.depotsId,
  };
  loading.value = true;
  const res = await getTableList(params);
  loading.value = false;
  if (res?.code != 200) return message.error(res.msg);

  const result = res.data || {};
  tableData.value = result.list;
  formState.total = result.total;
};
/** ============= 基础事件 ================ */
// 发起工作票领料
const handleErpPut = () => {
  config.title = '发起工作票领料';
  config.show = true;
  config.params = {
    ...formState,
  };
};
// 发起退料入仓
const handleStoresReturned = (scope) => {
  returnConfig.show = true;
  returnConfig.params = scope;
};
// 单据详情
const handleDetailsEvent = (scope) => {
  orderConfig.show = true;
  orderConfig.params = scope;
};
/**============= 数据请求 ============== */

onMounted(() => {
  initLoadData();
});
</script>

<style lang="scss" scoped></style>
