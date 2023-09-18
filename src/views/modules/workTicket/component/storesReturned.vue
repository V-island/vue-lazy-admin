<template>
  <g-modal :title="config.title" v-model:visible="config.show" width="1200px">
    <a-spin :spinning="loading">
      <!-- 基础信息 -->
      <section class="common-box">
        <div class="title">
          <g-svg-icon name="g-orderInfo"></g-svg-icon>
          基础信息
        </div>
        <a-descriptions>
          <a-descriptions-item label="工作票单号">{{ config.params.workNo }}</a-descriptions-item>
          <a-descriptions-item label="单据号">{{ config.params.uuid }}</a-descriptions-item>
          <a-descriptions-item label="项目名称">
            {{
              getDictToName(cache.projectEnum, config.params.projectId, {
                value: 'projectId',
                name: 'projectName',
              })
            }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">{{
            $utils.toDateString(config.params.orderTime)
          }}</a-descriptions-item>
          <a-descriptions-item label="开始时间">{{
            $utils.toDateString(config.params.startTime)
          }}</a-descriptions-item>
          <a-descriptions-item label="结束时间">{{
            $utils.toDateString(config.params.endTime)
          }}</a-descriptions-item>
          <a-descriptions-item label="主管部门">{{ config.params.dept }}</a-descriptions-item>
          <a-descriptions-item label="工作内容">{{
            config.params.workContent
          }}</a-descriptions-item>
        </a-descriptions>
      </section>
      <a-divider dashed />
      <!-- 物料列表 -->
      <section class="common-box">
        <div class="title">
          <g-svg-icon name="g-orderInfo"></g-svg-icon>
          物料列表
        </div>
        <g-table
          ref="gTable"
          :columns="columns"
          :data="tableData"
          :total="formState.total"
          :pageCurrent="formState.pageNum"
          :pageSize="formState.pageSize"
          @handlePage="handlePageEvent"
        >
          <template #id="{ scope }">
            {{ scope.id?.substring(9, 18) }}
          </template>
          <template #materielCode="{ scope }">
            {{ scope.materielCode?.substring(9, 18) }}
          </template>
          <template #sjrcCount="{ scope }">
            <a-input-number v-model:value="scope.sjrcCount" :min="1" :max="scope.count" />
          </template>
        </g-table>
      </section>
    </a-spin>
    <template #footer>
      <a-button type="primary" @click="onSubmitOrValidate">确定</a-button>
    </template>
  </g-modal>
</template>

<script setup>
import { ref, reactive, toRefs, watch, getCurrentInstance } from 'vue';
import { Form, message } from 'ant-design-vue';
import { useAuthStore } from 'store/auth';
import { cacheStore } from 'store/cache';
import { utilFn, getDictToName } from 'utils';
import { addErpOrder, listByErpOrWorkId } from 'api/order.js';

const { config } = defineProps(['config']);
const emit = defineEmits(['onSave']);

const { proxy } = getCurrentInstance();
const useAuth = useAuthStore();
const cache = cacheStore();
const loading = ref(false);
const formState = reactive({
  erpOrWorkId: '',
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const columns = reactive([
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    align: 'center',
  },
  {
    title: '物料编码',
    dataIndex: 'materielCode',
    align: 'center',
    width: 140,
  },
  {
    title: '物料名称',
    dataIndex: 'materielName',
    align: 'center',
    width: 240,
    ellipsis: true,
  },
  {
    title: '单位',
    dataIndex: 'materielUnit',
    align: 'center',
    width: 100,
  },
  {
    title: '订单数量',
    dataIndex: 'count',
    align: 'center',
    width: 100,
  },
  {
    title: '当前入仓数量',
    dataIndex: 'sjrcCount',
    align: 'center',
    width: 100,
  },
]);
const tableData = ref([]);

// 初始化
const initLoadData = () => {
  const { uuid } = config.params;

  formState.erpOrWorkId = uuid;
  onSearch();
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
  };
  loading.value = true;
  const res = await listByErpOrWorkId(params);
  loading.value = false;
  if (res?.code != 200) return message.error(res.msg);

  const result = res.data || {};
  tableData.value = result.list;
  formState.total = result.total;
};
// 提交并验证
const onSubmitOrValidate = async () => {
  try {
    addErpOrderToData();
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
};
/** =============== 数据请求 ================= */
// 新增单据
const addErpOrderToData = async () => {
  const { projectId, projectName } = config.params;
  const selectList = [...tableData.value];
  const params = {
    projectId,
    projectName,
    orderType: '2',
    depotsId: useAuth.depotsId,
    userId: useAuth.userId,
    busiErpMaterielDtoList: selectList,
  };

  loading.value = true;
  const res = await addErpOrder(params);
  loading.value = false;
  if (res?.code != 200) return message.error(res.msg);

  message.success('发起成功');
  config.show = false;
  emit('onSave');
};
watch(
  () => config.show,
  (show) => {
    if (show) initLoadData();
  },
  { immediate: true, deep: true },
);
</script>

<style lang="scss" scoped>
.common-box {
  > .title {
    @include flexbox(flex-start);
    color: $--color-text-primary;
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 16px;
  }
}
</style>
