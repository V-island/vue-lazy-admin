<template>
  <section class="pages">
    <!-- 流程图 -->
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>流程图</span>
        </div>
      </template>
      <flow-chart ref="chart1" v-if="procInsId" :processInstanceId="procInsId" />
      <flow-chart ref="chart2" v-if="!procInsId" :processDefId="procDefId" />
    </el-card>
    <!-- 流转记录 -->
    <flow-step :historicTaskList="historicTaskList" />
  </section>
</template>

<script>
import { getResult } from 'utils';
import taskService from 'api/flowable/taskService';
import FlowStep from 'views/modules/flowable/components/FlowStep';
export default {
  components: {
    FlowStep,
  },
  data() {
    return {
      procDefId: '',
      procInsId: '',
      historicTaskList: [],
    };
  },
  created() {
    const { procInsId, procDefId } = this.$route.query;

    if (!procInsId)
      return this.$message.error(`操作失败：当前账号，没有绑定【报表流程】应用，请联系管理员`);

    this.procInsId = procInsId;
    this.procDefId = procDefId;
    this.initLoadData();
  },
  methods: {
    // 初始化
    async initLoadData() {
      this._showPageLoading();
      // 读取历史任务列表
      let [err, data] = await this._awaitWrap(this.getAllProcess());
      this._hidePageLoading();
      if (err || !data.result) return this.$message.error(err || data.message);

      if (this.procInsId) {
        this.$refs.chart1.init();
      } else {
        this.$refs.chart2.init();
      }
    },
    /** =========== 接口请求 ========== */
    // 获取历史任务列表
    async getAllProcess() {
      const procInsId = this._get(this, 'procInsId');

      // 获取历史任务列表
      let [error, list] = await this._awaitWrap(taskService.historicTaskList(procInsId));
      if (error) return Promise.resolve(getResult(false, error));
      this.historicTaskList = list || [];

      return Promise.resolve(getResult(true, '流程初始化完成'));
    },
  },
};
</script>

<style lang="scss" scoped>
.pages {
  width: 100%;
  padding: 10px;
}
</style>
