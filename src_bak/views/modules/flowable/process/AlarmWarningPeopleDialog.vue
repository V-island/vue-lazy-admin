<template>
  <section>
    <VcDialog
      :loading="loading"
      :visible="config.show"
      :title="config.title"
      width="400px"
      @update:visible="config.show = $event"
    >
      <VcForm ref="form" :model="form" :rules="rules">
        <el-form-item label="应用" prop="appId">
          <el-select
            v-model="form.appId"
            @change="handleAppSelect"
            filterable
            allow-create
            default-first-option
            clearable
          >
            <el-option
              v-for="item in dictTypeList"
              :key="item.label"
              :label="item.value"
              :value="item.label.split(':')[0]"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.appId" label="角色" prop="roleId">
          <el-select
            v-model="form.roleId"
            @change="handleRoleSelect"
            filterable
            allow-create
            default-first-option
            clearable
          >
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.roleId" label="账号" prop="userId">
          <el-select
            v-model="form.userId"
            @change="handleUserSelect"
            filterable
            allow-create
            default-first-option
            clearable
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </VcForm>
      <template #footer>
        <el-button @click="config.show = false" icon="circle-close">关闭</el-button>
        <el-button type="primary" @click="onSaveAssign" icon="circle-check" v-noMoreClick
          >确定</el-button
        >
      </template>
    </VcDialog>
  </section>
</template>

<script>
import xeUtils from 'xe-utils';
import DialogMixin from 'mixins/dialog';
import modelService from 'api/flowable/modelService';
import { getResult } from 'utils';

export default {
  mixins: [DialogMixin],
  data() {
    return {
      loading: false,
      tableData: [],
      dictTypeList: [],
      organList: [],
      roleList: [],
      userList: [],
      rules: {
        appId: [{ required: true, message: '应用不能为空', trigger: ['change', 'blur'] }],
        roleId: [{ required: true, message: '角色不能为空', trigger: ['change', 'blur'] }],
        userId: [{ required: true, message: '账号不能为空', trigger: ['change', 'blur'] }],
      },
    };
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.loading = true;
      // 获取分配人员列表
      let [err, data] = await this._awaitWrap(this.getAllAssign());
      this.loading = false;
      if (err || !data.result) return this.$message.error(err || data.message);
    },
    /** =========== 表单事件 ========== */
    // 选择应用
    handleAppSelect(value) {
      if (!value) {
        this.form.appId = '';
        this.form.roleId = '';
        this.form.roleName = '';
        this.form.userId = '';
        this.form.userName = '';
        return false;
      }

      const list = [...this.dictTypeList];
      const newList = list.map(({ label, value }) => {
        return { label: label.split(':')[0], value };
      });
      const item = xeUtils.find(newList, (item) => item.label === value);

      if (!item) return false;
      this.form.appId = item.label;
      this.form.roleId = '';
      this.form.roleName = '';
      this.form.userId = '';
      this.form.userName = '';
    },
    // 选择角色
    handleRoleSelect(value) {
      if (!value) {
        this.form.roleId = '';
        this.form.roleName = '';
        this.form.userId = '';
        this.form.userName = '';
        return false;
      }

      const list = [...this.roleList];
      const item = xeUtils.find(list, (item) => item.id === value);

      if (!item) return false;
      this.form.roleId = item.id;
      this.form.roleName = item.name;
      this.form.userId = '';
      this.form.userName = '';
    },
    // 选择人员
    handleUserSelect(value) {
      if (!value) {
        this.form.userId = '';
        this.form.userName = '';
        return false;
      }

      const list = [...this.userList];
      const item = xeUtils.find(list, (item) => item.id === value);

      if (!item) return false;
      this.form.userId = item.id;
      this.form.userName = item.username;
    },
    // 保存人员
    onSaveAssign() {
      const { index } = this._get(this.config, 'params');
      const form = this._get(this, 'form', {});
      if (!form.userId) return this.$message.error('未选择用户');

      this.$emit('save', index, form);
      this.config.show = false;
    },
    /** =========== 接口请求 ========== */
    // 获取人员列表
    async getAllAssign() {
      const params = {
        dictType: 'zhgyl_app_type',
      };

      // 获取应用列表
      let [error, dictList] = await this._awaitWrap(modelService.queryDictType(params));
      if (error) return Promise.resolve(getResult(false, error));
      this.dictTypeList = dictList || [];

      return Promise.resolve(getResult(true, '人员初始化完成'));
    },
    // 获取角色列表
    async getRoleList() {
      const { appId } = this._get(this, 'form', '');
      const params = {
        appId,
      };
      let [error, roleList] = await this._awaitWrap(modelService.roleList(params));
      if (error) return this.$message.error(error);
      this.roleList = roleList || [];
    },
    // 获取账号列表
    async getUserList() {
      const { appId, roleName } = this._get(this, 'form', '');
      const params = {
        appId,
        roleName,
      };
      let [error, userList] = await this._awaitWrap(modelService.userList(params));
      if (error) return this.$message.error(error);
      this.userList = userList || [];
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
    'form.appId': {
      immediate: true,
      deep: true,
      handler(id) {
        if (id && id != '') this.getRoleList();
      },
    },
    'form.roleId': {
      immediate: true,
      deep: true,
      handler(id) {
        if (id && id != '') this.getUserList();
      },
    },
  },
};
</script>
