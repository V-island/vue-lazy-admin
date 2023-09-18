<template>
  <g-modal :title="config.title" v-model:visible="config.show" width="600px">
    <a-spin :spinning="loading">
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
          <a-col :span="24">
            <a-form-item label="项目名称" name="projectId">
              <a-select v-model:value="formState.projectId" placeholder="请选择项目名称" allowClear>
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
          <a-col :span="24">
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
          <a-col :span="24">
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
                placeholder="请输入工作内容"
                :rows="3"
                show-count
                :maxlength="200"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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
  projectId: null,
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

// 初始化
const initLoadData = () => {
  const { orderType } = config.params;

  formState.orderType = orderType;
  formState.depotsId = useAuth.depotsId;
};

/** ================ 基础事件 ============== */
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
  const params = {
    ...formState,
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
