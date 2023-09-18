<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
      <el-form-item>
        <el-input v-model="dataForm.module" placeholder="模块名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.status" placeholder="状态" clearable>
          <el-option label="失败" :value="0"></el-option>
          <el-option label="成功" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="getDataList">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" plain @click="exportHandle">导出</el-button>
      </el-form-item>
    </el-form>

    <base-table ref="logTable" :fetch="fetch">
      <el-table-column prop="creatorName" header-align="center" align="center" label="用户名">
      </el-table-column>
      <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        width="150"
        label="用户操作"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="module"
        header-align="center"
        align="center"
        label="模块名称"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="requestUri"
        header-align="center"
        align="center"
        label="请求URI"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="requestMethod"
        header-align="center"
        align="center"
        label="请求方法"
        width="120"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="requestParams"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="请求参数"
      >
      </el-table-column>
      <el-table-column
        prop="requestTime"
        header-align="center"
        align="center"
        label="请求时长(毫秒)"
        width="150"
      >
        <template slot-scope="scope">
          {{ `${scope.row.requestTime}ms` }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger">失败</el-tag>
          <el-tag v-else size="small" type="success">成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" header-align="center" align="center" width="150" label="操作IP">
      </el-table-column>
      <el-table-column
        prop="userAgent"
        header-align="center"
        align="center"
        width="180"
        label="User-Agent"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        width="180"
        label="创建时间"
      >
      </el-table-column>
    </base-table>
  </div>
</template>

<script>
import { getOperationLog } from 'api/system/log-manage';
import qs from 'qs';

export default {
  name: 'log-manage',
  data() {
    return {
      dataForm: {
        module: '',
        status: '',
      },
    };
  },
  computed: {
    fetch() {
      return {
        fn: getOperationLog,
        params: {
          module: this.dataForm.module,
          status: this.dataForm.status,
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        errorInfo: '查询日志列表失败',
      };
    },
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.$refs.logTable.getTableData(true);
    },
    // 导出
    exportHandle() {
      let params = qs.stringify({
        access_token: this.$store.state.user.token,
        ...this.dataForm,
      });
      this.$utils.locationRef.href = `${process.env.VUE_APP_BASE_API}/sys/log/operation/export?${params}`;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~@/styles/_common.scss';
.mod-log {
  @extend %wh-full;
}
</style>
