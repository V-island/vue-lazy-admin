<template>
  <div class="operation-maintenance">
    <el-dialog
      title="运维热线"
      :visible.sync="$store.state.common.showDatp"
      width="60%"
      top="10vh"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="width: 100%; border-top: 1px solid #dddddd" class="title"></div>

      <base-table height="400px" :fetch="fetch" :pagination="false" stripe>
        <el-table-column align="center" type="index" width="70" label="序号"> </el-table-column>
        <el-table-column
          prop="title"
          align="center"
          width="180"
          label="应用名称"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="content"
          align="center"
          label="联系方式"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="qxphobe" align="center" label="企讯号" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="email" align="center" label="电子邮件" :show-overflow-tooltip="true">
        </el-table-column>
      </base-table>
    </el-dialog>
  </div>
</template>

<script>
import { getOperationsInfo } from 'api/technical-support/operation-maintenance';

export default {
  name: 'operation-maintenance',
  data() {
    return {};
  },
  computed: {
    fetch() {
      return {
        fn: getOperationsInfo,
        params: {
          dictTypeId: '1474205272117909122',
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        dataHandle: this.dataHandle,
        errorInfo: '获取运维信息失败',
      };
    },
  },
  methods: {
    dataHandle(data) {
      let str = data[0].dictValue;
      return JSON.parse(str);
    },
    handleClose() {
      this.$store.commit('common/SET_SHOWDATP', false);
    },
  },
};
</script>

<style scoped lang="scss">
.operation-maintenance {
  &::v-deep .el-dialog {
    border-radius: 10px;
    .el-dialog__body {
      padding-top: 10px;
      .title {
        margin-bottom: 10px;
        .el-descriptions__table {
          margin-top: 20px;
        }
      }
      .el-button {
        border: 0;
      }
      .download {
        cursor: pointer;
      }
      .el-table,
      .el-table .el-table__row,
      .el-table tr,
      .el-table tr td,
      .el-table tr th {
        border: none;
      }
      .el-table::before,
      .el-table--border::after {
        width: 0;
        height: 0;
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
  }
  .col {
    background-color: #e7f8f8;
    color: #11bbbb;
  }
}
</style>
<style lang="scss">
.operation-maintenance .el-dialog__headerbtn,
.el-dialog__close {
  font-size: 22px !important;
}
</style>
