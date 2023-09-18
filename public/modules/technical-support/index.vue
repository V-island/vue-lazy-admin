<template>
  <div>
    <el-button type="primary" @click="application">权限申请</el-button>
    <el-button type="success" @click="question">答疑问答</el-button>
    <el-button type="info" @click="manual">操作手册</el-button>
    <el-button type="warning" @click="maintenance">运维热线</el-button>

    <!-- 弹层 -->
    <answering-question ref="question"></answering-question>
    <operation-maintenance ref="maintenance"></operation-maintenance>
    <operation-manual ref="manual"></operation-manual>
    <permission-application ref="application"></permission-application>
  </div>
</template>

<script>
import answeringQuestion from './answering-question.vue'; //答疑问答
import operationMaintenance from './operation-maintenance.vue'; //运维热线
import operationManual from './operation-manual.vue'; //操作手册
import permissionApplication from './permission-application.vue'; //权限申请
export default {
  name: 'operation',
  components: {
    answeringQuestion,
    operationMaintenance,
    operationManual,
    permissionApplication,
  },
  data() {
    return {};
  },
  methods: {
    // 答疑问答
    question() {
      this.$refs.question.btnOk();
    },
    // 操作手册
    manual() {
      this.$refs.manual.btnOk();
    },
    //  权限
    application() {
      this.$refs.application.btnOk();
    },
    // 运维热线
    maintenance() {
      this.$refs.maintenance.btnOk();
    },
  },
};
</script>

