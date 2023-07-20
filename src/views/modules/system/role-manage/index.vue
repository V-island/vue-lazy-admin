<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
      <el-form-item>
        <el-input
          v-model="dataForm.name"
          placeholder="角色名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList">查询</el-button>
        <el-button
          v-permission="'sys:role:save'"
          type="primary"
          @click="addOrUpdateHandle()"
          >新增
        </el-button>
        <el-button
          v-permission="'sys:role:delete'"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量删除
        </el-button>
      </el-form-item>
    </el-form>

    <base-table
      ref="roleTable"
      :fetch="fetch"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="200"
        label="角色名称"
      >
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        width="230"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="200"
        label="操作"
      >
        <template #default="scope">
          <el-button
            v-permission="'sys:role:update'"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
            >修改
          </el-button>
          <el-button
            v-permission="'sys:role:delete'"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </base-table>

    <!-- 新增/修改 弹窗 -->
    <role-add-or-update
      :visible.sync="addOrUpdateVisible"
      :role-id="currRoleId"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script>
import roleAddOrUpdate from './role-add-or-update';
import { getRoleList, deleteRoleByIds } from 'api/system/role-manage';

export default {
  name: 'role-manage',
  data() {
    return {
      dataForm: {
        name: '',
      },

      dataListSelections: [],
      addOrUpdateVisible: false,
      currRoleId: null,
    };
  },
  components: {
    roleAddOrUpdate,
  },
  computed: {
    fetch() {
      return {
        fn: getRoleList,
        params: {
          name: this.dataForm.name,
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        errorInfo: '获取角色列表失败',
      };
    },
  },
  methods: {
    // 获取角色列表
    getDataList() {
      this.$refs.roleTable.getTableData(true);
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(roleId) {
      this.currRoleId = roleId;
      this.addOrUpdateVisible = true;
    },
    // 删除
    deleteHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const [err, data] = await this._awaitWrap(
          deleteRoleByIds({ data: ids }),
        );
        if (err) {
          this.$message.error('删除失败，请稍后再试！');
          return;
        }

        if (data && data.code === 0) {
          this.getDataList();
          this.$message.success('操作成功');
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~@/styles/_common.scss';
.mod-role {
  @extend %wh-full;
}
</style>
