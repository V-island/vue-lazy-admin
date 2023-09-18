<template>
  <div class="bills-approval">
    <base-table ref="baseTable" :fetch="billsDetailList" @render-complete="tableDataHandle">
      <el-table-column align="center" type="index" width="70" label="序号"> </el-table-column>
      <el-table-column
        prop="appName"
        align="center"
        width="180"
        label="申请应用"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column align="center" label="申请角色" :show-overflow-tooltip="true">
        <template #default="scope">
          <span>{{ scope.row.roleNames.join(',') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orgName" align="center" label="组织机构" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="userName" align="center" label="申请人" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="applyReason" header-align="center" align="center" label="申请原因">
      </el-table-column>
      <el-table-column prop="auditStatusDesc" header-align="center" align="center" label="单据状态">
      </el-table-column>
      <el-table-column align="center" label="操作" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button type="text" @click="showStatusDialog(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </base-table>
    <div class="operation">
      <template v-if="approvalRow.node === 1 && approvalRow.auditStatus === 10">
        <el-button
          style="margin-right: 20px"
          size="medium"
          type="primary"
          :loading="loading"
          @click="approval(1)"
          >通过</el-button
        >
      </template>
      <template v-if="approvalRow.node !== 1 && approvalRow.auditStatus === 10">
        <el-button
          style="margin-right: 20px"
          size="medium"
          type="primary"
          :loading="loading"
          @click="approval(1)"
          >通过</el-button
        >
        <el-button size="medium" type="danger" :loading="loading" @click="approval(2)"
          >驳回</el-button
        >
      </template>
    </div>

    <!-- 流程状态页面弹窗 -->
    <el-dialog
      title="单据状态"
      :visible.sync="statusDialog"
      v-if="statusDialog"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="width: 100%; border-top: 1px solid #dddddd; margin-bottom: 20px"></div>
      <div class="iframe-container">
        <iframe class="iframe" :src="getAddress()" width="100%" height="100%"
          >当前浏览器不支持iframe，请升级。</iframe
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { billsApproval, getBillsDetail } from 'api/technical-support';
export default {
  name: 'bills-approval',
  data() {
    return {
      procInsId: '', //流程实例ID
      loading: false,
      statusDialog: false,
      approvalRow: {},
    };
  },
  computed: {
    billsDetailList() {
      return {
        fn: getBillsDetail,
        params: {
          auditOrderId: this.$route.query.auditOrderId,
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        errorInfo: '获取单据详情失败',
      };
    },
  },
  methods: {
    // 审批接口
    async approval(num) {
      this.loading = true;
      const params = {
        taskUrlParams: this.$route.query.auditOrderId,
        type: num,
      };
      const [err, data] = await this._awaitWrap(billsApproval(params));
      if (err) {
        this.loading = false;
        this.$message.error('网络错误，请稍后重试！');
        return;
      }

      if (data && data.code === 0) {
        this.loading = false;
        this.$message.success('审批成功！');
        this.$nextTick(() => {
          this.$utils.locationRef.reload();
        });
      } else {
        this.loading = false;
        this.$message.error(data.msg || '审批失败！');
      }
    },
    tableDataHandle(tableData) {
      if (tableData && tableData.length > 0) {
        this.approvalRow = tableData[0] || {};
      }
    },
    // 显示单据状态弹窗
    showStatusDialog(row) {
      if (this._isEmpty(row.procInsId)) {
        this.$message.error('流程实例ID为空！');
        return;
      }
      this.procInsId = row.procInsId;
      this.statusDialog = true;
    },
    getAddress() {
      return process.env.VUE_APP_FLOW_ADDRESS + `?procInsId=${this.procInsId}`;
    },
  },
};
</script>

<style scoped lang="scss">
@import '~@/styles/common';
.bills-approval {
  @extend %wh-full;
  display: flex;
  flex-direction: column;

  .iframe-container {
    width: 100%;
    height: 60vh;

    .iframe {
      border: 0;
    }
  }

  .operation {
    align-self: center;
    margin-top: 20px;
  }
}
</style>
