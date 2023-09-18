<template>
  <g-form :model="formState" labelCol="100px">
    <a-col :span="6">
      <a-form-item label="工作票单号">
        <a-input v-model:value="formState.orderNum" placeholder="请输入工作票单号" allowClear />
      </a-form-item>
    </a-col>
    <a-col :span="6">
      <a-form-item label="单据状态">
        <a-select v-model:value="formState.orderState" placeholder="请选择单据状态" allowClear>
          <a-select-option v-for="(item, i) in cache.orderState" :key="i" :value="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
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
</script>
