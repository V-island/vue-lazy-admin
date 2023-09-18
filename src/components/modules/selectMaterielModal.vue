<template>
  <g-modal :title="config.title" v-model:visible="config.show" width="1200px">
    <g-table
      ref="gTable"
      rowKey="materielCode"
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :scroll="{ x: '1200' }"
      :total="formState.total"
      :pageCurrent="formState.pageNum"
      :pageSize="formState.pageSize"
      :rowSelectionObj="rowSelection"
      @handlePage="handlePageEvent"
      @selectChange="handleSelectChange"
      isShowCheck
    >
      <template #topSearch>
        <g-form :model="formState" labelCol="80px">
          <a-col :span="6">
            <a-form-item label="物料编码">
              <a-input
                v-model:value="formState.materielCode"
                placeholder="请输入物料编码"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="物料名称">
              <a-input
                v-model:value="formState.materielName"
                placeholder="请输入物料名称"
                allowClear
              />
            </a-form-item>
          </a-col>
          <template #button>
            <a-button @click="onSearch" type="primary">查询</a-button>
            <a-button @click="handleResetEvent">重置</a-button>
          </template>
        </g-form>
      </template>
      <template #id="{ scope }">
        {{ scope.id?.substring(9, 18) }}
      </template>
      <template #materielCode="{ scope }">
        {{ scope.materielCode?.substring(9, 18) }}
      </template>
      <template #inventoryStatus="{ scope }">
        {{ getDictToName(cache.inventoryStatus, scope.inventoryStatus) }}
      </template>
      <template #shiwu="{ scope }">
        <template v-if="[0].includes(scope.shiwu)">否</template>
        <template v-else>{{ scope.shiwu }}</template>
      </template>
      <template #createTime="{ scope }">
        {{ $utils.toDateString(scope.createTime) }}
      </template>
    </g-table>
    <template #footer>
      <a-button type="primary" @click="onSubmitOrValidate">确定</a-button>
    </template>
  </g-modal>
</template>

<script setup>
import { ref, reactive, computed, watch, getCurrentInstance } from 'vue';
import { Form, message } from 'ant-design-vue';
import { cacheStore } from 'store/cache';
import { utilFn, getDictToName } from 'utils';
import { getMaterielData, getTableList } from 'api/materiel.js';

const { config } = defineProps(['config']);
const emit = defineEmits(['onSave']);

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
    title: '物料ID',
    dataIndex: 'id',
    align: 'center',
    width: 140,
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
]);
const tableData = ref([]);
const formState = reactive({
  materielCode: '',
  materielName: '',
  pageNum: 1,
  pageSize: 10,
  total: 0,
});
const selectedList = ref([]);
// 多选属性
const rowSelection = computed(() => {
  const list = [...selectedList.value];
  return {
    selectedRowKeys: proxy.$utils.map(list, (item) => item.materielCode),
    getCheckboxProps: (record) => {
      const newList = [...config.selectList];
      return {
        disabled: proxy.$utils.some(newList, (item) => item.materielCode == record.materielCode),
        name: record.materielName,
      };
    },
  };
});

// 初始化
const initLoadData = () => {
  onSearch();
};
/** ============= 表单/列表事件 ================ */
// 查询
const onSearch = () => {
  formState.pageNum = 1;
  formState.pageSize = 10;
  getTableData();
};
// 重置
const handleResetEvent = () => {
  for (let i in formState) {
    if (!(i == 'pageNum' || i == 'pageSize' || i == 'total')) formState[i] = null;
  }
  onSearch();
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
  const res = config.isErp ? await getMaterielData(params) : await getTableList(params);
  loading.value = false;
  if (res?.code != 200) return message.error(res.msg);

  const result = res.data || {};
  tableData.value = result.list;
  formState.total = result.total;
};

/** ================ 基础事件 ============== */
// 列表选中事件
const handleSelectChange = (_, rows) => {
  selectedList.value = rows;
};
// 提交并验证
const onSubmitOrValidate = async () => {
  const list = [...selectedList.value];

  if (list.length == 0) return message.error(`请先选择需添加的物料！`);

  message.success('添加成功');
  config.show = false;
  emit('onSave', list);
};

/** =============== 数据请求 ================= */
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
