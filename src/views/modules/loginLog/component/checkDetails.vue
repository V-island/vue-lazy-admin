<template>
  <g-modal :title="config.title" v-model:visible="config.show" width="60%" :isFooter="false">
    <!-- 操作信息 -->
    <section class="common-box">
      <div class="title">
        <g-svg-icon name="g-orderInfo"></g-svg-icon>
        操作信息
      </div>
      <a-descriptions :column="2">
        <a-descriptions-item label="操作代码">{{ formState.businessCode }}</a-descriptions-item>
        <a-descriptions-item label="操作人">{{ formState.operationUser }}</a-descriptions-item>
        <a-descriptions-item label="操作时间">{{
          $utils.toDateString(formState.operationTime)
        }}</a-descriptions-item>
        <a-descriptions-item label="操作内容">{{
          formState.operationContext
        }}</a-descriptions-item>
      </a-descriptions>
    </section>
    <a-divider dashed />
    <!-- 请求参数 -->
    <section class="common-box">
      <div class="title">
        <g-svg-icon name="g-orderInfo"></g-svg-icon>
        请求参数
      </div>
      <div class="code-content">
        <g-highlightJS language="json" :code="formState.request"></g-highlightJS>
      </div>
    </section>
  </g-modal>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from 'vue';

const { config } = defineProps(['config']);
const emit = defineEmits(['onSave']);

const formState = ref({
  request: null,
});

// 初始化
const initLoadData = () => {
  const item = config.params;

  const request = JSON.stringify(JSON.parse(item.params), null, 2);

  formState.value = {
    ...item,
    request,
  };
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
.code-content {
  background-color: #eee;
  padding: 10px;
  min-height: 100px;
}
</style>
