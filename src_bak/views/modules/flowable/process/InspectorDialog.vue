<template>
  <section>
    <VcDialog
      :loading="loading"
      :visible="config.show"
      :title="config.title"
      width="800px"
      @update:visible="config.show = $event"
    >
      <div class="jp-table">
        <vxe-toolbar ref="modelToolbar">
          <template #buttons>
            <el-button type="primary" icon="DocumentAdd" @click="handleAssign">分配人员</el-button>
          </template>
        </vxe-toolbar>
        <div class="jp-table-body">
          <vxe-table
            height="400"
            :data="tableData"
            :loading="loading"
            :menu-config="{}"
            :print-config="{}"
            :import-config="{}"
            :export-config="{}"
            :checkbox-config="{}"
            show-header-overflow
            show-overflow
            highlight-hover-row
            border
            auto-resize
            resizable
          >
            <vxe-column type="seq" header-align="center" align="center" width="50"> </vxe-column>
            <vxe-column field="type" title="用户类型" sortable></vxe-column>
            <vxe-column field="assignAccountList" title="用户来自" sortable>
              <template #default="{ row }">
                <el-tag
                  v-for="(tag, index) in row.assignAccountList"
                  :key="index"
                  @close="handleDelEvent(tag)"
                  closable
                >
                  {{ tag.assignAccount }}
                </el-tag>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
      <!-- 分配人员 -->
      <InspectorAssignDialog :config="assignConfig" :form="assignObj" @save="handleSaveAssign" />
      <template #footer>
        <el-button @click="config.show = false" icon="circle-close">关闭</el-button>
        <el-button type="primary" @click="onSubmitOrSave" icon="circle-check" v-noMoreClick
          >保存</el-button
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
import InspectorAssignDialog from './InspectorAssignDialog';
export default {
  mixins: [DialogMixin],
  components: {
    InspectorAssignDialog,
  },
  data() {
    return {
      loading: false,
      tableList: [],
      tableData: [],
      submitData: [],
      // 分配人员
      assignConfig: {
        title: '分配人员',
        show: false,
        params: {},
      },
      assignObj: {},
    };
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.loading = true;
      // 获取节点审核者列表
      let [err, data] = await this._awaitWrap(this.getAllTask());
      this.loading = false;
      if (err || !data.result) return this.$message.error(err || data.message);

      this.formatTableData();
    },
    // 格式化列表数据
    formatTableData() {
      const list = this._get(this, 'tableList', []);
      if (list.length == 0) {
        this.tableData = [];
        this.submitData = [];
        return false;
      }

      const tableList = [];
      // const submitList = [];

      // 筛选用户列表
      const userList = xeUtils.filter(list, (item) => item.type == 'user');
      // 筛选角色列表
      const roleList = xeUtils.filter(list, (item) => item.type == 'role');

      // 判断是否存在用户
      if (userList.length > 0) {
        // const items = xeUtils.map(userList, (item) => item.assignAccount);
        tableList.push({
          type: 'user',
          assignAccountList: userList,
        });

        // 获取用户名
        // const users = tableList[0].assignAccountList.map((item) => item.assignAccount);
        // submitList.push({
        //   ...userList[0],
        //   assignAccount: users.join(','),
        // });
      }

      // 判断是否存在角色
      if (roleList.length > 0) {
        // const items = xeUtils.map(roleList,  (item) => item.assignAccount);
        tableList.push({
          type: 'role',
          assignAccountList: roleList,
        });

        // 获取角色名
        // const roles = tableList[1].assignAccountList.map((item) => item.assignAccount);
        // submitList.push({
        //   ...roleList[0],
        //   assignAccount: roles.join(','),
        // });
      }
      this.tableData = tableList;
      // this.submitData = submitList;
      this.submitData = list;
    },
    // 删除
    handleDelEvent(row) {
      const list = [...this.tableList];
      const index = xeUtils.findIndexOf(list, (item) => item.assignValue == row.assignValue);

      if (index < 0) return false;
      list.splice(index, 1);
      this.tableList = list;
      this.formatTableData();
    },
    /** =========== 基础事件 ========== */
    // 分配人员
    handleAssign() {
      const { appId } = this._get(this.config, 'params');
      this.assignConfig.show = true;
      this.assignObj = {
        appId,
        roleId: '',
        roleName: '',
        userId: '',
        userName: '',
      };
    },
    // 保存分配人员弹框回调事件
    handleSaveAssign(userInfo) {
      const tableList = [...this.tableList];
      // 判断当前选中为用户或角色。注：存在用户ID时已用户为准。
      const isUser = userInfo.userId ? true : false;
      // 判断当前表格是否已存在选中用户
      const hasUser = xeUtils.some(tableList, (item) => {
        if (isUser) return item.type == 'user' && item.assignValue == userInfo.userId;
        else return item.type == 'role' && item.assignValue == userInfo.roleId;
      });
      // 已存在当前选中用户信息
      if (hasUser) return this.$message.error('已存在当前选中用户或角色');

      const newTableItem = {
        type: isUser ? 'user' : 'role', // 用户类型(user:用户 role:角色)
        assignValue: isUser ? userInfo.userId : userInfo.roleId, // 用户ID/角色ID
        assignAccount: isUser ? userInfo.userName : userInfo.roleName, // 用户名称/角色名称
        assignCondition: '0',
        operationType: '0',
        sort: 1,
      };
      tableList.push(newTableItem);
      this.tableList = tableList;
      this.formatTableData();
    },
    // 保存审核者
    onSubmitOrSave() {
      // const flowAssigneeList = this.tableData || [];
      const flowAssigneeList = this.submitData || [];
      const { processInstanceDefKey, taskDefKey } = this._get(this.config, 'params');
      const params = {
        processDefKey: processInstanceDefKey,
        taskDefKey,
        flowAssigneeList,
      };
      if (flowAssigneeList.length == 0) return this.$message.error('请先选择审核者人员！');
      this.saveAssignList(params);
    },
    /** =========== 接口请求 ========== */
    // 获取节点审核者列表
    async getAllTask() {
      const params = this._get(this.config, 'params');

      // 获取节点审核者列表
      let [error, task] = await this._awaitWrap(modelService.taskList(params));
      if (error) return Promise.resolve(getResult(false, error));
      const taskList = task || [];
      if (taskList.length > 0)
        this.tableList = taskList.map((item) => {
          const { type, sort, operationType, assignAccount, value, condition } = item;
          return {
            type,
            sort,
            operationType,
            assignAccount,
            assignValue: value,
            assignCondition: condition,
          };
        });

      return Promise.resolve(getResult(true, '节点列表初始化完成'));
    },
    // 保存审核者列表
    async saveAssignList(params) {
      let [error] = await this._awaitWrap(modelService.assingeeSave(params));
      if (error) return this.$message.error(error);
      this.$message.success('保存成功');
      this.config.show = false;
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
  },
};
</script>
