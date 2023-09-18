<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getTableData">查询</el-button>
        <el-button v-permission="'sys:user:save'" type="primary" @click="addOrUpdateHandle()"
          >新增
        </el-button>
        <el-button
          v-permission="'sys:user:delete'"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量删除
        </el-button>
      </el-form-item>
    </el-form>

    <base-table ref="userTable" :fetch="fetch" @selection-change="selectionChangeHandle">
      <base-table-column :columns="userTableColumn" />
    </base-table>

    <!-- 新增/修改 弹窗 -->
    <user-add-or-update
      :visible.sync="addOrUpdateVisible"
      :user-id="currUserId"
      @refreshDataList="getTableData"
    ></user-add-or-update>
  </div>
</template>

<script>
import UserAddOrUpdate from './user-add-or-update';
import { getUserList, deleteUsers } from 'api/system/user-manage';

export default {
  name: 'user-manage',
  components: {
    UserAddOrUpdate,
  },
  data() {
    return {
      dataForm: {
        userName: '',
      },
      dataListSelections: [],
      addOrUpdateVisible: false,
      currUserId: null,
      userTableColumn: [
        {
          type: 'selection',
          width: '50',
        },
        {
          prop: 'username',
          label: '用户名',
        },
        {
          prop: 'email',
          label: '邮箱',
        },
        {
          prop: 'mobile',
          label: '手机号',
        },
        {
          prop: 'gender',
          label: '性别',
          render: (h, scope) => h('span', this.formatGender(scope.row.gender)),
        },
        {
          prop: 'status',
          label: '状态',
          render: (h, scope) => {
            const disabled = scope.row.status === 0;
            return h(
              'el-tag',
              { props: { size: 'small', type: disabled ? 'danger' : '' } },
              disabled ? '禁用' : '正常',
            );
          },
        },
        {
          prop: 'createDate',
          label: '创建时间',
        },
        {
          label: '操作',
          render: (h, scope) => {
            return [
              h(
                'el-button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click: this.addOrUpdateHandle.bind(this, scope.row.id),
                  },
                  directives: [
                    {
                      name: 'permission',
                      value: 'sys:user:update',
                    },
                  ],
                },
                '修改',
              ),
              h(
                'el-button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on: {
                    click: this.deleteHandle.bind(this, scope.row.id),
                  },
                  directives: [
                    {
                      name: 'permission',
                      value: 'sys:user:delete',
                    },
                  ],
                },
                '删除',
              ),
            ];
          },
        },
      ],
    };
  },
  computed: {
    fetch() {
      return {
        fn: getUserList,
        params: {
          username: this.dataForm.userName,
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        errorInfo: '获取用户列表失败',
      };
    },
  },
  methods: {
    getTableData() {
      this.$refs.userTable.getTableData(true);
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(userId) {
      this.addOrUpdateVisible = true;
      this.currUserId = userId;
    },
    // 删除
    deleteHandle(id) {
      let userIds = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });

      this.$confirm(
        `确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(async () => {
          const [err, data] = await this._awaitWrap(deleteUsers(userIds));
          if (err) {
            this.$message.error('用户删除失败');
            return;
          }

          if (data && data.code === 0) {
            this.getTableData();
            this.$message.success('操作成功');
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(() => {
          console.log('已取消');
        });
    },
    formatGender(gender) {
      switch (gender) {
        case 0:
          return '男';
        case 1:
          return '女';
        case 2:
          return '保密';
        default:
          return '';
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~@/styles/_common.scss';
.mod-user {
  @extend %wh-full;
}
</style>
