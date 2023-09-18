<template>
  <div class="operation-manual">
    <el-dialog
      title="操作手册"
      :visible.sync="$store.state.common.operation"
      width="60%"
      top="10vh"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="width: 100%; border-top: 1px solid #dddddd" class="title"></div>

      <base-table ref="operation-manual" height="400px" :fetch="fetch" :pagination="false" stripe>
        <el-table-column align="center" type="index" width="70" label="序号"> </el-table-column>
        <el-table-column
          prop="appName"
          align="center"
          width="180"
          label="应用名称"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="fileName"
          align="center"
          label="文件名称"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template #default="scope">
            <a
              class="download-btn"
              :href="scope.row.fileUrl"
              :download="scope.row.fileName"
              target="_blank"
              rel="noopenner noreferrer"
              >下载</a
            >
          </template>
        </el-table-column>
      </base-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'operation-manual',
  data() {
    return {};
  },
  computed: {
    fetch() {
      return {
        list: [
          {
            appName: '公共服务组件',
            fileName: '公共服务组件-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/qxzx.pdf',
          },
          {
            appName: '公共服务组件',
            fileName: '公共服务组件(流程引擎)-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/qxzxlcyq.pdf',
          },
          {
            appName: '湖北e物资',
            fileName: '湖北e物资-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/hbewz.pdf',
          },
          {
            appName: '湖北e物资',
            fileName: '湖北e物资(作业中心)-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/hbewzzyzx.pdf',
          },
          {
            appName: '物资库WMS',
            fileName: '物资库WMS(PC端)-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/wzkwms.pdf',
          },
          {
            appName: '专业仓系统',
            fileName: '专业仓系统(PC端)-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/zycpc.pdf',
          },
          {
            appName: '专业仓系统',
            fileName: '专业仓系统(APP端)-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/zycapp.pdf',
          },
          {
            appName: '单据电子化',
            fileName: '单据电子化(PC端)-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/djdzhpc.pdf',
          },
          {
            appName: '单据电子化',
            fileName: '单据电子化(APP端)-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/djdzhapp.pdf',
          },
          {
            appName: '供需对接',
            fileName: '供需对接-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/gxdj.pdf',
          },
          {
            appName: '全量资源可视化平台',
            fileName: '全量资源可视化平台v4.0-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/qlzykshpt.pdf',
          },
          {
            appName: '全网采购管控',
            fileName: '全网采购管控v3.2.5-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/qwcggk.pdf',
          },
          {
            appName: '物资质量检测管控平台',
            fileName: '物资质量检测管控平台V4.0-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/wzzljcgkpt.pdf',
          },
          {
            appName: '招标服务审查平台',
            fileName: '招标服务审查平台-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/zbfwscpt.pdf',
          },
          {
            appName: '招标物资审查平台',
            fileName: '招标物资审查平台-操作手册.pdf',
            fileUrl: 'http://utis.hb.sgcc.com.cn:18801/download/zbwzscpt.pdf',
          },
        ],
      };
    },
  },
  methods: {
    handleClose() {
      this.$store.commit('common/SET_OPERATION', false);
    },
  },
};
</script>

<style scoped lang="scss">
.operation-manual {
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
      .download-btn {
        text-decoration: none;
        color: #10b3b3;
        cursor: pointer;
      }
      .download-btn:hover {
        text-decoration: underline;
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
.operation-manual .el-dialog__headerbtn,
.el-dialog__close {
  font-size: 22px !important;
}
</style>
