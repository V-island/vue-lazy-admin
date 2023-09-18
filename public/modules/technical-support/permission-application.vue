<template>
  <div>
    <div class="user_info">
      <span>用户名：{{ userInfo.realName }}</span>
      <span>单位名称：{{ userInfo.deptName || '无' }}</span>
      <span>门户账号：{{ userInfo.username }}</span>
    </div>

    <div style="margin-bottom: 20px">
      <el-button size="medium" type="primary" @click="showApplyCommonDialog">申请权限</el-button>
      <!--      <el-button size="medium" type="danger" @click="deleteDialog = true">删除权限</el-button>-->
      <el-button style="float: right" size="medium" type="primary" @click="recordDialog = true"
        >申请记录</el-button
      >
    </div>

    <!-- 当前权限列表 -->
    <base-table ref="applyList" :fetch="getPermissionList" row-key="id" :pagination="true">
      <el-table-column type="index" header-align="center" width="100" label="序号" align="center">
      </el-table-column>
      <el-table-column
        prop="appName"
        header-align="center"
        align="center"
        label="应用名称"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="orgName"
        header-align="center"
        align="center"
        label="所属组织(工厂/库/仓)"
        show-overflow-tooltip
      >
      </el-table-column>
    </base-table>

    <!-- 申请权限 -->
    <el-dialog
      title="申请权限"
      width="50%"
      :visible.sync="applyCommonDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeApplyCommonDialog"
    >
      <div class="user_info_dialog">
        <span>用户名：{{ userInfo.realName }}</span>
        <span>单位名称：{{ userInfo.deptName || '无' }}</span>
        <span>门户账号：{{ userInfo.username }}</span>
      </div>

      <!-- 新建申请的表单 -->
      <div style="margin-top: 20px" v-if="showDataForm">
        <el-form label-width="100px" :model="dataForm" :rules="dataRules">
          <el-form-item label="应用名称:" prop="clientId">
            <el-select
              ref="appSelect"
              v-model="dataForm.clientId"
              @change="clientChange"
              style="width: 90%"
              placeholder="请选择"
              filterable
            >
              <el-option
                v-for="item in clientOption"
                :key="item.appId"
                :label="item.appName"
                :value="item.appId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称:" prop="roleIdList" size="mini">
            <el-checkbox-group
              v-model="dataForm.roleIdList"
              style="max-height: 140px; width: 90%; overflow-y: auto"
            >
              <el-checkbox
                v-for="role in roleList"
                :key="role.id"
                :label="role.id"
                :disabled="currUserRoleIds.includes(role.id)"
                >{{ role.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="所属组织:" prop="deptId">
            <el-cascader
              ref="deptTree"
              style="width: 90%"
              v-model="dataForm.deptId"
              :options="deptTree"
              :props="{
                label: 'name',
                value: 'id',
                emitPath: false,
                checkStrictly: true,
                lazy: true,
                lazyLoad: lazyLoad,
              }"
              filterable
              clearable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="申请原因:" prop="applyReason">
            <el-input
              style="width: 90%"
              type="textarea"
              :rows="4"
              v-model="dataForm.applyReason"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button size="medium" type="primary" @click="confirmAdd">确 定</el-button>
          <el-button style="margin-left: 20px" size="medium" plain @click="applyCommonCancel"
            >取 消</el-button
          >
        </div>
      </div>

      <!-- 申请的列表 -->
      <div v-else>
        <div class="apply-detail" v-for="(item, index) in awaitSubmitList" :key="item.clientId">
          <div class="apply-item">
            <div class="apply-info">
              <div class="apply-text">
                <div
                  @click="openEditForm(index)"
                  class="apply-content expandable"
                  style="padding-right: 20px"
                >
                  <i :class="['el-icon-arrow-right', currEditIndex === index && 'rotate']"></i>
                  <span :title="item.appText">{{ item.appText }}</span>
                </div>
                <div class="apply-content" :title="item.deptText" style="text-align: right">
                  {{ item.deptText }}
                </div>
              </div>
              <div class="apply-text">
                <div class="apply-content" :title="item.roleText" style="padding-right: 20px">
                  {{ item.roleText }}
                </div>
                <div
                  class="apply-content"
                  :title="item.dataForm.applyReason"
                  style="text-align: right"
                >
                  {{ item.dataForm.applyReason }}
                </div>
              </div>
            </div>
            <div class="delete-btn">
              <el-button type="text" @click="deleteApply(index)">删除</el-button>
            </div>
          </div>
          <div class="detail-form" v-if="currEditIndex === index">
            <el-form label-width="100px" :model="dataForm" :rules="dataRules">
              <el-form-item label="应用名称:" prop="clientId">
                <el-select
                  ref="editAppSelect"
                  v-model="dataForm.clientId"
                  @change="clientChange"
                  style="width: 90%"
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in clientOption"
                    :key="item.appId"
                    :label="item.appName"
                    :value="item.appId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色名称:" prop="roleIdList" size="mini">
                <el-checkbox-group
                  v-model="dataForm.roleIdList"
                  style="max-height: 140px; width: 90%; overflow-y: auto"
                >
                  <el-checkbox
                    v-for="role in roleList"
                    :key="role.id"
                    :label="role.id"
                    :disabled="currUserRoleIds.includes(role.id)"
                    >{{ role.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="所属组织:" prop="deptId">
                <el-cascader
                  ref="editDeptTree"
                  style="width: 90%"
                  v-model="dataForm.deptId"
                  :options="deptTree"
                  :props="{
                    label: 'name',
                    value: 'id',
                    emitPath: false,
                    checkStrictly: true,
                    lazy: true,
                    lazyLoad: lazyLoad,
                  }"
                  filterable
                  clearable
                >
                </el-cascader>
              </el-form-item>
              <el-form-item label="申请原因:" prop="applyReason">
                <el-input
                  style="width: 90%"
                  type="textarea"
                  :rows="4"
                  v-model="dataForm.applyReason"
                ></el-input>
              </el-form-item>
            </el-form>
            <div class="dialog-footer" style="text-align: left; margin: -10px 0 10px 100px">
              <el-button size="medium" type="primary" plain @click="confirmAdd('edit')"
                >确 定</el-button
              >
              <el-button style="margin-left: 20px" size="medium" plain @click="currEditIndex = null"
                >取 消</el-button
              >
            </div>
          </div>
        </div>
        <!-- 继续添加申请 -->
        <div v-if="currEditIndex === null" class="addApply" @click="showDataForm = true">
          + 添加申请
        </div>
        <div class="dialog-footer">
          <el-button size="medium" type="primary" :loading="loading" @click="onSubmit"
            >提 交</el-button
          >
          <el-button
            style="margin-left: 20px"
            size="medium"
            type="warning"
            plain
            :loading="loading"
            @click="closeApplyCommonDialog"
            >关 闭</el-button
          >
        </div>
      </div>
    </el-dialog>

    <!-- 删除权限弹窗 -->
    <el-dialog
      title="删除权限"
      :visible.sync="deleteDialog"
      v-if="deleteDialog"
      width="70%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="width: 100%; border-top: 1px solid #dddddd; margin-bottom: 20px"></div>
      <base-table
        ref="deletePermissionTable"
        :fetch="getPermissionList2"
        :pagination="false"
        row-key="id"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column
          type="index"
          header-align="center"
          width="70"
          label="序号"
          align="center"
        />
        <el-table-column
          prop="appName"
          header-align="center"
          align="center"
          label="应用名称"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          header-align="center"
          align="center"
          label="角色名称"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="orgName"
          header-align="center"
          align="center"
          label="所属组织(工厂/库/仓)"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column align="center" label="删除原因" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.deleteReason"
              size="medium"
              placeholder="请输入"
            ></el-input>
          </template>
        </el-table-column>
      </base-table>
      <!-- 选择审批人 -->
      <!--      <div class="select-person">
        <span>选择审批人：</span>
        <el-select
          ref="appSelect"
          v-model="dataForm.clientId"
          @change="clientChange"
          placeholder="请选择"
          filterable
        >
          <el-option
            v-for="item in clientOption"
            :key="item.appId"
            :label="item.appName"
            :value="item.appId"
          >
          </el-option>
        </el-select>
      </div>-->
      <div class="dialog-footer">
        <el-button style="margin-right: 20px" type="primary" @click="deletePermission"
          >确 定</el-button
        >
        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 申请记录弹窗 -->
    <el-dialog
      title="申请记录"
      :visible.sync="recordDialog"
      v-if="recordDialog"
      width="70%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="width: 100%; border-top: 1px solid #dddddd; margin-bottom: 20px"></div>
      <base-table :fetch="recordList" row-key="id">
        <el-table-column align="center" type="index" width="70" label="序号"> </el-table-column>
        <el-table-column
          prop="billTypeDesc"
          align="center"
          width="180"
          label="单据类型"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="orderId"
          align="center"
          label="单据编号"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="applyTime"
          align="center"
          label="申请时间"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          prop="realName"
          align="center"
          label="申请人"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="reason" header-align="center" align="center" label="申请原因">
        </el-table-column>
        <el-table-column
          prop="statusDesc"
          align="center"
          label="单据状态"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column align="center" label="操作" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" @click="showStatusDialog(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </base-table>
      <div class="dialog-footer">
        <el-button style="margin-right: 20px" type="primary" @click="recordDialog = false"
          >确 定</el-button
        >
        <el-button @click="recordDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 申请记录弹窗 -> 查看单据状态弹窗 -->
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
import {
  getUserRole,
  getApplyList,
  getApplicationSelect,
  getRoleManagement,
  getOrgByPid,
  saveApply,
} from 'api/technical-support';
import { mapState } from 'vuex';
export default {
  name: 'permission-application',
  data() {
    return {
      applyCommonDialog: false,
      recordDialog: false,
      deleteDialog: false,
      statusDialog: false,
      showDataForm: false,
      currUserRoleIds: [], // 当前用户已有的角色ID列表
      dataForm: {
        clientId: '', //应用
        roleIdList: [], //申请的角色ID列表
        deptId: '', //所属组织机构
        applyReason: '', //申请原因
      },
      dataRules: {
        clientId: [{ required: true, message: '请选择应用', trigger: 'blur' }],
        roleIdList: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择所属组织', trigger: ['blur', 'change'] }],
        applyReason: [{ required: true, message: '申请原因不能为空', trigger: 'blur' }],
      },
      clientOption: [],
      roleList: [],
      deptTree: [],
      awaitSubmitList: [],
      currEditIndex: null,
      procInsId: '', //流程实例ID
      loading: false,
    };
  },
  computed: {
    ...mapState('user', ['token', 'userInfo']),
    getPermissionList() {
      return {
        fn: getUserRole,
        params: {
          userId: this.userInfo.id,
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        errorInfo: '获取角色列表失败',
      };
    },
    getPermissionList2() {
      return {
        fn: getUserRole,
        params: {
          limit: 99999,
          page: 1,
          userId: this.userInfo.id,
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        errorInfo: '获取角色列表失败',
      };
    },
    recordList() {
      return {
        fn: getApplyList,
        params: {
          applyUser: this.userInfo.id,
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        errorInfo: '获取申请列表失败',
      };
    },
  },
  watch: {
    showDataForm(val) {
      this.dataForm = {
        clientId: '',
        roleIdList: [],
        deptId: '',
        applyReason: '',
      };
      if (val) {
        this.clientOption = [];
        this.roleList = [];
        this.deptTree = [];
        this.getApps();
        this.getUserRoles();
        this.getDepts();
      }
    },
  },
  activated() {
    if (this._isEmpty(this.token)) {
      this.$message.error('请先登录！');
      this.$store.commit('sys/REMOVE_MAIN_TAB', this.$route.meta.title);
      this.$router.back();
    }
  },
  methods: {
    getAddress() {
      return process.env.VUE_APP_FLOW_ADDRESS + `?procInsId=${this.procInsId}`;
    },
    // 获取当前用户所有角色ID
    async getUserRoles() {
      const [, data] = await this._awaitWrap(
        getUserRole({ page: 1, limit: 99999, userId: this.userInfo.id }),
      );
      data.data.list.forEach((item) => {
        this.currUserRoleIds.push(item.roleId);
      });
    },
    showApplyCommonDialog() {
      this.applyCommonDialog = true;
      this.showDataForm = true;
    },
    // 显示单据状态弹窗
    showStatusDialog(row) {
      this.procInsId = row.procInsId;
      this.statusDialog = true;
    },
    // 获取所有应用
    async getApps() {
      const [, list] = await this._awaitWrap(
        getApplicationSelect({ clientName: '', page: 1, limit: 9999 }),
      );
      this.clientOption = list.data.list;
    },
    // 应用选择改变
    async clientChange(clientId) {
      const [roleErr, roleData] = await this._awaitWrap(getRoleManagement({ appId: clientId }));
      if (roleErr) {
        this.$message.error('获取角色列表失败');
        return;
      }
      if (roleData && roleData.code === 0) {
        this.roleList = roleData.data;
        // 默认勾选已有角色
        this.$nextTick(() => {
          let temArr = [];
          this.roleList.forEach((item) => {
            if (this.currUserRoleIds.includes(item.id)) {
              temArr.push(item.id);
            }
          });
          this.dataForm.roleIdList = temArr;
        });
      } else {
        this.$message.error(roleData.msg);
      }
    },
    // 获取部门列表
    async getDepts() {
      const [deptErr, deptData] = await this._awaitWrap(getOrgByPid({ pid: 0 }));
      if (deptErr) {
        this.$message.error('获取部门列表失败');
        return;
      }

      if (deptData && deptData.code === 0) {
        this.deptTree = this._get(deptData, 'data', []);
      } else {
        this.$message.error('获取部门列表失败');
      }
    },
    //懒加载组织机构
    async lazyLoad(node, resolve) {
      if (node.data) {
        const [, data] = await this._awaitWrap(getOrgByPid({ pid: node.data.id }));
        if (data.data && data.data.length > 0) {
          node.data.children = data.data;
        }
        resolve(data.data);
      }
    },
    // 添加一条申请
    confirmAdd(type) {
      if (this.dataForm.clientId === '') {
        this.$message.error('请选择应用');
        return;
      }

      const isAdd = this.dataForm.roleIdList.some((id) => {
        return !this.currUserRoleIds.includes(id);
      });

      if (!isAdd) {
        this.$message.error('请选择需要申请的角色');
        return;
      }

      if (this.dataForm.deptId === '') {
        this.$message.error('请选择组织');
        return;
      }
      if (this.dataForm.applyReason === '') {
        this.$message.error('请输入申请原因');
        return;
      }

      const roleIds = this.dataForm.roleIdList.filter((id) => {
        return !this.currUserRoleIds.includes(id);
      });
      const roleNames = roleIds.reduce((arr, id) => {
        this.roleList.some((item) => {
          if (item.id === id) {
            arr.push(item.name);
            return true;
          }
        });
        return arr;
      }, []);

      const bool = type === 'edit';
      let appText = '';
      let deptText = '';
      if (bool) {
        appText = this.$refs.editAppSelect[0].selectedLabel;
        deptText = this.$refs.editDeptTree[0].getCheckedNodes()[0].label;
      } else {
        appText = this.$refs.appSelect.selectedLabel;
        deptText = this.$refs.deptTree.getCheckedNodes()[0].label;
      }
      const obj = {
        clientId: this.dataForm.clientId,
        appText: appText,
        roleText: roleNames.join('/'),
        deptText: deptText,
        dataForm: this._clone(this.dataForm, true),
        clientOption: this._clone(this.clientOption, true),
        roleList: this._clone(this.roleList, true),
        deptTree: this._clone(this.deptTree, true),
      };

      // 判断当前是新建表单还是编辑表单
      const isExist = this.awaitSubmitList.some((item) => item.clientId === obj.clientId);
      if (bool) {
        if (isExist && this.awaitSubmitList[this.currEditIndex].clientId !== obj.clientId) {
          this.$message.error('该应用已在申请列表中，不能重复申请！');
          return;
        }
        this.awaitSubmitList.splice(this.currEditIndex, 1, obj);
        this.currEditIndex = null;
      } else {
        if (isExist) {
          this.$message.error('该应用已在申请列表中，不能重复申请！');
          return;
        }
        this.awaitSubmitList.push(obj);
        this.showDataForm = false;
      }
    },
    // 权限申请表单取消按钮事件
    applyCommonCancel() {
      this.showDataForm = false;
      if (this.awaitSubmitList.length < 1) {
        this.applyCommonDialog = false;
      }
    },
    // 关闭权限申请弹窗
    closeApplyCommonDialog() {
      Object.assign(this.$data, this.$options.data());
    },
    // 编辑某一条申请
    openEditForm(index) {
      if (this.currEditIndex === index) {
        this.currEditIndex = null;
        return;
      }
      // 数据回显
      const obj = this._clone(this.awaitSubmitList[index], true);
      this.clientOption = obj.clientOption;
      this.roleList = obj.roleList;
      this.deptTree = obj.deptTree;
      this.dataForm = obj.dataForm;
      this.currEditIndex = index;
    },
    // 删除某一条申请
    deleteApply(index) {
      this.awaitSubmitList.splice(index, 1);
      if (this.awaitSubmitList.length < 1) {
        this.showDataForm = true;
      }
    },
    // 权限申请表单提交
    async onSubmit() {
      this.loading = true;
      let params = {
        iscPermissionApplyRecordDTOS: null,
      };
      params.iscPermissionApplyRecordDTOS = this.awaitSubmitList.map((item) => {
        return {
          applyUser: this.userInfo.id,
          appId: item.dataForm.clientId,
          roleIds: item.dataForm.roleIdList.join(),
          orgId: item.dataForm.deptId,
          applyReason: item.dataForm.applyReason,
          billType: '10000001',
        };
      });

      const [err, data] = await this._awaitWrap(saveApply(params));
      if (err) {
        this.loading = false;
        this.$message.error('网络错误，请稍后重试！');
        return;
      }
      if (data && data.code === 0) {
        this.$message.success('提交成功');
        this.applyCommonDialog = false;
        this.loading = false;
        await this.$refs.applyList.getTableData(true);
      } else {
        this.loading = false;
        this.$message.error(data.msg);
      }
    },
    // 删除已有权限
    async deletePermission() {
      const selection = this.$refs.deletePermissionTable.getTableRef().selection;
      if (this._isEmpty(selection) || selection.length < 1) {
        this.$message.warning('请先选择一条记录');
        return;
      }

      if (selection.some((item) => this._isEmpty(item.deleteReason))) {
        this.$message.warning('请填写删除原因');
        return;
      }

      let params = {
        iscPermissionApplyRecordDTOS: null,
      };
      params.iscPermissionApplyRecordDTOS = selection.map((item) => {
        return {
          applyUser: item.userId,
          appId: item.appId,
          roleIds: item.roleId,
          deleteReason: item.deleteReason,
          billType: '10000002',
        };
      });

      const [, data] = await this._awaitWrap(saveApply(params));
      if (data && data.code === 0) {
        this.$message.success('提交成功');
        this.deleteDialog = false;
        await this.$refs.applyList.getTableData(true);
      } else {
        this.$message.error(data.msg);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '~@/styles/common';
.user_info {
  height: 50px;
  border-bottom: 1px solid #dddddd;
  margin-bottom: 20px;
  line-height: 30px;
  span {
    font-size: 16px;
    margin-right: 30px;
  }
}

.user_info_dialog {
  padding: 15px 0;
  border-top: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
  span {
    font-size: 14px;
    margin-right: 30px;
  }
}

::v-deep .el-dialog__body {
  padding: 10px 20px;
}

.apply-detail {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid #dddddd;

  .apply-item {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 70px;

    .apply-info {
      display: flex;
      flex-direction: column;
      flex: 1;

      .apply-text {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 50%;

        .apply-content {
          @extend %overflow-ellipsis;
          width: 50%;
          line-height: 35px;
        }

        .expandable {
          font-size: 16px;
          cursor: pointer;
          color: #000000;
          user-select: none;
          .el-icon-arrow-right {
            font-size: 18px;
            margin-right: 5px;
          }
          .rotate {
            transform: rotate(90deg);
          }
        }
      }
    }

    .delete-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 100%;
    }
  }

  .detail-form {
    margin-top: 10px;
    padding-top: 20px;
    background-color: #fafafa;
  }
}

.addApply {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 40px;
  margin-top: 20px;
  margin-left: 10%;
  cursor: pointer;
  border: 1px dashed #ccc;
  color: $app-menu-background-color;
}

.select-person {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;

  &::before {
    content: '*';
    color: red;
  }
}

.dialog-footer {
  width: 100%;
  margin-top: 30px;
  text-align: center;
}

.iframe-container {
  width: 100%;
  height: 60vh;

  .iframe {
    border: 0;
  }
}
</style>
