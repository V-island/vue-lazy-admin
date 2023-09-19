<template>
  <g-form :model="formState" labelCol="80px">
    <a-col :span="8">
      <a-form-item label="日期">
        <a-range-picker
          style="width: 100%"
          v-model:value="formState.timeData"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          @change="onTimeChange"
          show-time
          allowClear
        />
      </a-form-item>
    </a-col>
    <template #button>
      <a-button @click="emit('onSearch')" type="primary">查询</a-button>
      <a-button @click="handleResetEvent">重置</a-button>
    </template>
  </g-form>
</template>
<script setup>
import { reactive, ref, toRefs, watch, createVNode, onMounted } from 'vue';
import { cacheStore } from 'store/cache';

const cache = cacheStore();
const { formState } = defineProps(['formState']);
const emit = defineEmits(['onSearch']);

/** ============== 基础事件 ============== */
const handleResetEvent = () => {
  for (let i in formState) {
    if (!(i == 'pageNum' || i == 'pageSize' || i == 'total')) formState[i] = null;
  }
  emit('onSearch');
};

// 日期
const onTimeChange = (val) => {
  if (val) {
    formState.startTime = val[0];
    formState.endTime = val[1];
  } else {
    formState.startTime = '';
    formState.endTime = '';
  }
};
</script>
