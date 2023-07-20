<template>
  <base-dialog
    :title="_isEmpty(dataForm.id) ? '新增' : '修改'"
    :visible.sync="showDialog"
    @close="userDialogClose"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit"
      label-width="100px"
    >
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="dataForm.username" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="部门名称：" prop="deptId">
        <el-cascader
          ref="deptTree"
          style="width: 100%"
          v-model="dataForm.deptId"
          :options="deptTree"
          :props="{
            label: 'name',
            value: 'id',
            emitPath: false,
            checkStrictly: true,
          }"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="密码：" prop="userCode" :class="{ 'is-required': !dataForm.id }">
        <el-input
          v-model="dataForm.userCode"
          type="text"
          placeholder="密码"
          @focus="typeChange"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码："
        prop="confirmUserCode"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.confirmUserCode"
          type="text"
          placeholder="确认密码"
          @focus="typeChange"
        ></el-input>
      </el-form-item>
      <el-form-item prop="realName" label="真实姓名：">
        <el-input v-model="dataForm.realName" placeholder="真实姓名"></el-input>
      </el-form-item>
      <el-form-item prop="gender" label="性别：">
        <el-radio-group v-model="dataForm.gender">
          <el-radio v-for="gender in getGenders" :key="gender.dictValue" :label="gender.dictValue"
            >{{ gender.dictLabel }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="角色：" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id"
            >{{ role.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态：" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </base-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { getUserInfoByID, saveUserInfo, updateUserInfo } from 'api/system/user-manage';

import { getAllDept } from 'api/system/dept-manage';
import { getAllRoleList } from 'api/system/role-manage';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    userId: {
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
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'));
      } else {
        callback();
      }
    };
    const validateConfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'));
      } else if (this.dataForm.userCode !== value) {
        callback(new Error('确认密码与密码输入不一致'));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value) {
        const res =
          /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(
            value,
          );
        res ? callback() : callback(new Error('邮箱格式错误'));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      if (value) {
        const res = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/.test(value);
        res ? callback() : callback(new Error('手机号格式不正确'));
      } else {
        callback();
      }
    };
    return {
      roleList: [],
      deptTree: [],
      dataForm: {
        id: null,
        username: '',
        deptId: '',
        userCode: '',
        confirmUserCode: '',
        realName: '',
        gender: '',
        email: '',
        mobile: '',
        roleIdList: [],
        status: 1,
      },
      dataRule: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        deptId: [
          {
            required: true,
            message: '部门不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        userCode: [{ validator: validatePassword, trigger: 'blur' }],
        confirmUserCode: [{ validator: validateConfirmPassword, trigger: 'blur' }],
        realName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
        gender: [
          {
            required: true,
            message: '性别不能为空',
            trigger: ['blur', 'change'],
          },
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    ...mapState('user', ['allDict']),
    getGenders() {
      let genders = this.allDict.find((item) => item.dictType === 'gender');
      return this._get(genders, 'dataList', []);
    },
    showDialog: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    async initData() {
      this.dataForm.id = this.userId;
      const [roleErr, roleData] = await this._awaitWrap(getAllRoleList());
      const [deptErr, deptData] = await this._awaitWrap(getAllDept());
      if (roleErr) {
        this.$message.error('获取角色列表失败');
        return;
      }

      if (roleData && roleData.code === 0) {
        this.roleList = this._get(roleData, 'data', []);
      } else {
        this.$message.error('获取角色列表失败');
        return;
      }

      if (deptErr) {
        this.$message.error('获取部门列表失败');
        return;
      }

      if (deptData && deptData.code === 0) {
        this.deptTree = this._get(deptData, 'data', []);
      } else {
        this.$message.error('获取部门列表失败');
      }

      if (this.dataForm.id) {
        const [userErr, userData] = await this._awaitWrap(getUserInfoByID(this.dataForm.id));
        if (userErr) {
          this.$message.error('获取用户信息失败');
          return;
        }
        if (userData && userData.code === 0) {
          this.dataForm.id = this._get(userData, 'data.id', '');
          this.dataForm.username = this._get(userData, 'data.username', '');
          this.dataForm.deptId = this._get(userData, 'data.deptId', '');
          this.dataForm.gender = this._get(userData, 'data.gender', '').toString();
          this.dataForm.realName = this._get(userData, 'data.realName', '');
          this.dataForm.email = this._get(userData, 'data.email', '');
          this.dataForm.mobile = this._get(userData, 'data.mobile', '');
          this.dataForm.roleIdList = this._get(userData, 'data.roleIdList', []);
          this.dataForm.status = this._get(userData, 'data.status', 1);
        } else {
          this.$message.error(userData.msg);
        }
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const requestFn = this._isEmpty(this.dataForm.id) ? saveUserInfo : updateUserInfo;

          let params = this._clone(this.dataForm, true);
          params.deptName = this.$refs.deptTree.getCheckedNodes()[0].data.name;
          const [err, data] = await this._awaitWrap(requestFn(params));
          if (err) {
            this.$message.error('用户信息提交失败');
            return;
          }

          if (data && data.code === 0) {
            this.$emit('refreshDataList');
            this.showDialog = false;
            this.$message.success('用户信息提交成功！');
          } else {
            this.$message.error(data.msg);
          }
        }
      });
    },
    userDialogClose() {
      this.$refs['dataForm'].resetFields();
    },
    typeChange(e) {
      let node = e.target || e.srcElement;
      node.type = 'password';
    },
  },
};
</script>
