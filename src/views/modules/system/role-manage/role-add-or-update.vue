<template>
  <base-dialog
    :title="_isEmpty(dataForm.id) ? '新增' : '修改'"
    :visible.sync="showDialog"
    @close="roleDialogClose"
  >
    <el-form
      ref="dataForm"
      label-width="80px"
      :model="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="授权菜单">
        <el-tree
          ref="menuListTree"
          :data="menuList"
          :props="{ label: 'name', children: 'children' }"
          node-key="id"
          accordion
          :default-expand-all="false"
          :highlight-current="true"
          :expand-on-click-node="false"
          show-checkbox
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </base-dialog>
</template>

<script>
import { getRoleInfo, saveRole, updateRole } from 'api/system/role-manage';
import { getAllSelectMenu } from 'api/system/menu-manage';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    roleId: {
      type: [String, Number],
    },
  },
  watch: {
    visible: {
      handler: function (val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true,
    },
  },
  computed: {
    showDialog: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  data() {
    return {
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children',
      },
      dataForm: {
        id: '',
        name: '',
        remark: '',
        menuIdList: [],
      },
      dataRule: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async initData() {
      this.dataForm.id = this.roleId;
      const [err, data] = await this._awaitWrap(getAllSelectMenu());
      if (err) {
        this.$message.error('获取菜单列表失败');
        return;
      }

      this.menuList = data.data;

      // 如果是修改，查询角色信息
      if (!this._isEmpty(this.dataForm.id)) {
        const [roleErr, roleData] = await this._awaitWrap(
          getRoleInfo(this.dataForm.id),
        );
        if (roleErr) {
          this.$message.error('获取角色信息失败');
          return;
        }

        if (roleData && roleData.code === 0) {
          this.dataForm = {
            ...this.dataForm,
            ...roleData.data,
          };
          this.dataForm.menuIdList.forEach((item) =>
            this.$refs.menuListTree.setChecked(item, true),
          );
        }
      }
    },
    // 关闭弹窗
    roleDialogClose() {
      this.$refs['dataForm'].resetFields();
      this.dataForm.menuIdList = [];
      this.$refs.menuListTree.setCheckedNodes([]);
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const requestFn = this._isEmpty(this.dataForm.id)
            ? saveRole
            : updateRole;
          const params = {
            id: this.dataForm.id,
            name: this.dataForm.name,
            remark: this.dataForm.remark,
            menuIdList: [
              ...this.$refs.menuListTree.getCheckedKeys(),
              ...this.$refs.menuListTree.getHalfCheckedKeys(),
            ],
          };
          const [err, data] = await this._awaitWrap(requestFn(params));
          if (err) {
            this.$message.error('保存角色信息失败');
            return;
          }
          if (data && data.code === 0) {
            this.showDialog = false;
            this.$message.success('操作成功');
            this.$emit('refreshDataList');
          } else {
            this.$message.error(data.msg);
          }
        }
      });
    },
  },
};
</script>
