<template>
  <section>
    <VcDialog
      :loading="loading"
      :visible="config.show"
      :title="config.title"
      width="700px"
      @update:visible="config.show = $event"
    >
      <vxe-table
        height="350px"
        ref="table"
        :data="tableData"
        :menu-config="{}"
        :print-config="{}"
        :import-config="{}"
        :export-config="{}"
        :checkbox-config="{}"
        show-header-overflow
        show-overflow
        highlight-hover-row
        border
        auto-resize
        resizable
      >
        <vxe-column type="seq" header-align="center" align="center" width="50"> </vxe-column>
        <vxe-column field="updateById" sortable title="修改人"></vxe-column>
        <vxe-column field="updateTime" sortable title="修改时间" width="200"></vxe-column>
        <!-- <vxe-column field="historicalSolution" sortable title="修改内容"></vxe-column> -->
        <vxe-column title="操作" width="80px" align="center">
          <template #default="{ row }">
            <el-button type="primary" text @click="handleSeeEvent(row)">查看</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <vxe-pager
        background
        :current-page="query.pageNumber"
        :page-size="query.pageSize"
        :total="total"
        :page-sizes="[10, 20, 100, 1000, { label: '全量数据', value: 1000000 }]"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handleCurrentChange"
      >
      </vxe-pager>
      <template #footer>
        <el-button @click="config.show = false" icon="circle-close">关闭</el-button>
      </template>
    </VcDialog>
    <!-- 查看更新记录 -->
    <SeeLogsDialog :config="seeConfig" />
  </section>
</template>

<script>
import DialogMixin from 'mixins/dialog';
import SeeLogsDialog from './SeeLogsDialog';
import { getResult } from 'utils';
import { getHistoricalList } from 'api/sys/questionService';

export default {
  mixins: [DialogMixin],
  components: {
    SeeLogsDialog,
  },
  data() {
    return {
      seeConfig: {
        title: '查看详情',
        show: false,
        params: {},
      },
      tableData: [],
      query: {
        id: '',
        pageNumber: 1,
        pageSize: 10,
      },
      pager: false,
    };
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.loading = true;
      // 获取历史更新记录列表
      let [err, data] = await this._awaitWrap(this.getAllData());
      this.loading = false;
      if (err || !data.result) return this.$message.error(err || data.message);
    },

    /** =========== 接口请求 ========== */
    // 获取历史更新记录列表
    async getAllData() {
      const logsParams = this._get(this.config, 'params', {});
      const query = this._get(this, 'query', {});

      const params = this.pager ? { ...query, id: logsParams.id } : { ...logsParams };

      // 获取历史更新记录列表
      let [error, List] = await this._awaitWrap(getHistoricalList(params));
      if (error) return Promise.resolve(getResult(false, error));

      const table = List || [];
      this.tableData = this._get(table, 'records');
      this.total = this._toInteger(this._get(table, 'total'));

      return Promise.resolve(getResult(true, '问答初始化完成'));
    },

    // 分页事件
    handleCurrentChange({ currentPage, pageSize }) {
      this.query.pageNumber = currentPage;
      this.query.pageSize = pageSize;
      this.pager = true;
      this.initLoadData();
    },

    // 查看详情
    handleSeeEvent(row) {
      this.seeConfig.show = true;
      this.seeConfig.title = '查看详情';
      this.seeConfig.params = row;
    },
  },
  watch: {
    'config.show': {
      immediate: true,
      deep: true,
      handler(show) {
        if (show) this.initLoadData();
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
