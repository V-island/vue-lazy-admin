<template>
  <g-modal :title="config.title" v-model:visible="config.show" width="80%" :isFooter="false">
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
    <a-divider dashed />
    <!-- 报错信息 -->
    <section class="common-box">
      <div class="title">
        <g-svg-icon name="g-orderInfo"></g-svg-icon>
        报错信息
      </div>
      <div class="code-content">
        <g-highlightJS language="java" :code="formState.errorMsg"></g-highlightJS>
      </div>
    </section>
  </g-modal>
</template>

<script setup>
import { ref, reactive, toRefs, watch } from 'vue';
import { Form, message } from 'ant-design-vue';
import { addMateriel } from 'api/materiel.js';

const { config } = defineProps(['config']);
const emit = defineEmits(['onSave']);

const formState = reactive({
  request: null,
  errorMsg: null,
});

// 初始化
const initLoadData = () => {
  const { params, excMsg } = config.params;

  formState.request = JSON.stringify(JSON.parse(params), null, 2);
  formState.errorMsg = excMsg;
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
