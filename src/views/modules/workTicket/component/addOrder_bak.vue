<template>
  <g-modal :title="config.title" v-model:visible="config.show" width="1200px">
    <a-spin :spinning="loading">
      <!-- 基础信息 -->
      <section class="common-box">
        <div class="title">
          <g-svg-icon name="g-orderInfo"></g-svg-icon>
          基础信息
        </div>
        <a-form
          ref="formRef"
          :model="formState"
          :rules="rules"
          :label-col="{
            style: {
              width: '110px',
            },
          }"
        >
          <a-row>
            <a-col :span="8">
              <a-form-item label="项目名称" name="projectId">
                <a-select
                  v-model:value="formState.projectId"
                  placeholder="请选择项目名称"
                  allowClear
                >
                  <a-select-option
                    v-for="(item, i) in cache.projectEnum"
                    :key="i"
                    :value="item.projectId"
                  >
                    {{ item.projectName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="开始时间" name="startTime">
                <a-date-picker
                  v-model:value="formState.startTime"
                  format="YYYY-MM-DD HH:mm:ss"
                  :disabled-date="disabledDate"
                  :disabled-time="disabledDateTime"
                  :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="结束时间" name="endTime">
                <a-date-picker
                  v-model:value="formState.endTime"
                  format="YYYY-MM-DD HH:mm:ss"
                  :disabled-date="disabledDate"
                  :disabled-time="disabledDateTime"
                  :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="主管部门" name="dept">
                <a-input v-model:value="formState.dept" placeholder="请输入主管部门" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="工作内容" name="workContent">
                <a-textarea
                  v-model:value="formState.workContent"
                  :rows="3"
                  show-count
                  :maxlength="200"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
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
          :loading="loading"
          :columns="columns"
          :data="tableData"
          :pagination="false"
          :scroll="{ y: 550 }"
          height="600px"
        >
          <template #topButton>
            <a-button type="primary" @click="handleSelectMateriel">选择物料</a-button>
          </template>
          <template #id="{ scope }">
            {{ scope.id?.substring(9, 18) }}
          </template>
          <template #materielCode="{ scope }">
            {{ scope.materielCode?.substring(9, 18) }}
          </template>
          <template #count="{ scope }">
            <a-input-number v-model:value="scope.count" :min="1" />
          </template>
          <template #action="{ scope }">
            <a-button type="link" @click="handleDeleteEvent(scope)" danger>删除</a-button>
          </template>
        </g-table>
      </section>
      <!-- 选择物料 -->
      <SelectMaterielModal
        v-if="materielConfig.show"
        :config="materielConfig"
        @onSave="onSelectMateriel"
      />
    </a-spin>
    <template #footer>
      <a-button type="primary" @click="onSubmitOrValidate">确定</a-button>
    </template>
  </g-modal>
</template>

<script setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref, reactive, toRefs, watch, getCurrentInstance } from 'vue';
import { Form, message } from 'ant-design-vue';
import { useAuthStore } from 'store/auth';
import { cacheStore } from 'store/cache';
import { addErpOrder } from 'api/order.js';
import SelectMaterielModal from 'components/modules/selectMaterielModal.vue';

const { config } = defineProps(['config']);
const emit = defineEmits(['onSave']);

const { proxy } = getCurrentInstance();
const useAuth = useAuthStore();
const cache = cacheStore();
const loading = ref(false);
const formRef = ref(null);
const formState = reactive({
  depotsId: '',
  orderType: '',
  projectId: '',
  projectName: '',
  startTime: null,
  endTime: null,
  dept: '',
  workContent: '',
  busiErpMaterielDtoList: [],
});
const rules = reactive({
  projectId: [{ required: true, message: '项目名称不能为空' }],
  startTime: [{ required: true, message: '开始时间不能为空' }],
  endTime: [{ required: true, message: '结束时间不能为空' }],
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
    title: '当前入仓数量',
    dataIndex: 'count',
    align: 'center',
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    fixed: 'right',
    width: 80,
  },
]);
const tableData = ref([]);
const materielConfig = reactive({
  title: '选择物料',
  show: false,
  selectList: [],
});

// 初始化
const initLoadData = () => {
  const { orderType } = config.params;

  formState.orderType = orderType;
  formState.depotsId = useAuth.depotsId;
};

/** ================ 基础事件 ============== */
// 选择物料
const handleSelectMateriel = () => {
  materielConfig.show = true;
  materielConfig.selectList = [...tableData.value];
};
// 选择物料回调
const onSelectMateriel = (list) => {
  const selectList = [...tableData.value];

  // 合并数组
  const unionList = proxy.$utils.union(selectList, list);
  // 去重
  const newList = proxy.$utils.uniq(unionList, (item) => item.materielCode);
  // 设置默认数量
  const newSelectList = proxy.$utils.map(newList, (item) => ({
    ...item,
    count: item.count || 1,
  }));
  tableData.value = newSelectList;
};
// 删除物料
const handleDeleteEvent = (scope) => {
  const selectList = [...tableData.value];
  const newList = proxy.$utils.filter(
    selectList,
    (item) => item.materielCode != scope.materielCode,
  );
  tableData.value = newList;
};
// 提交并验证
const onSubmitOrValidate = async () => {
  try {
    await formRef.value.validateFields();
    addErpOrderToData();
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
};

/** =============== 数据请求 ================= */
// 新增单据
const addErpOrderToData = async () => {
  const selectList = [...tableData.value];
  const params = {
    ...formState,
    busiErpMaterielDtoList: selectList,
    userId: useAuth.userId,
  };

  loading.value = true;
  const res = await addErpOrder(params);
  loading.value = false;
  if (res?.code != 200) return message.error(res.msg);

  message.success('添加成功');
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
