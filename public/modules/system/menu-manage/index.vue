<template>
  <div class="mod-menu">
    <div
      style="display: flex; justify-content: space-between; margin-bottom: 20px"
    >
      <el-button
        v-permission="'sys:menu:save'"
        type="primary"
        @click="addOrUpdateHandle(null)"
        >新增菜单
      </el-button>
    </div>

    <base-table ref="menuTable" :fetch="fetch" row-key="id" :pagination="false">
      <el-table-column
        prop="name"
        header-align="center"
        min-width="150"
        label="名称"
      >
      </el-table-column>
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <i :class="`fa fa-fw ${scope.row.icon || ''}`" aria-hidden="true"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="info"
            >按钮
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="排序"
      >
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL"
      >
      </el-table-column>
      <el-table-column
        prop="permissions"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="授权标识"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template #default="scope">
          <el-button
            v-permission="'sys:menu:update'"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
            >修改
          </el-button>
          <el-button
            v-permission="'sys:menu:delete'"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </base-table>

    <!-- 新增 / 修改 -->
    <menu-add-or-update
      :visible.sync="showDialog"
      :menu-id="currMenuId"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script>
import { getAllMenu, deleteMenuByID } from 'api/system/menu-manage';
import MenuAddOrUpdate from './menu-add-or-update';

export default {
  name: 'menu-manage',
  components: { MenuAddOrUpdate },
  data() {
    return {
      showDialog: false,
      currMenuId: null,
    };
  },
  computed: {
    fetch() {
      return {
        fn: getAllMenu,
        errorInfo: '获取菜单列表失败',
      };
    },
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.$refs.menuTable.getTableData(true);
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.currMenuId = id;
      this.showDialog = true;
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const [err, data] = await this._awaitWrap(deleteMenuByID(id));
        if (err) {
          this.$message.error('菜单删除失败');
          return;
        }
        if (data && data.code === 0) {
          this.getDataList();
          this.$message.success('菜单删除成功');
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
.mod-menu {
  @extend %wh-full;
}
</style>
