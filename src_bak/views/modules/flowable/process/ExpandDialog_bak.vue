<template>
  <section>
    <v-dialog v-model="visible">
      <div class="jp-table">
        <div class="jp-table-body">
          <vxe-table
            border
            auto-resize
            resizable
            height="400"
            size="small"
            ref="dataSourceTable"
            show-header-overflow
            show-overflow
            highlight-hover-row
            :loading="loading"
            :menu-config="{}"
            :print-config="{}"
            :import-config="{}"
            :export-config="{}"
            :data="dataTable"
            :checkbox-config="{}"
          >
            <vxe-column type="seq" header-align="center" align="center" width="50"> </vxe-column>
            <vxe-column field="taskDefName" sortable title="流程节点名称"> </vxe-column>
            <vxe-column title="操作" width="300px" fixed="right" align="center">
              <template #default="scope">
                <el-button type="primary" text size="small" @click="detail(scope.row, '审核者')"
                  >审核者</el-button
                >
                <el-button type="primary" text size="small" @click="detail(scope.row, '待办地址')"
                  >待办地址</el-button
                >
                <el-button type="primary" text size="small" @click="detail(scope.row, '告警预警')"
                  >告警预警</el-button
                >
                <el-button type="primary" text size="small" @click="detail(scope.row, '自动审批')"
                  >自动审批</el-button
                >
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false" icon="circle-close">关闭</el-button>
        </span>
      </template>
    </v-dialog>

    <!-- 流程节点操作弹窗 -->
    <v-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      v-model="dialogVisible"
      width="55%"
    >
      <div class="jp-table" v-if="dialogTitle == '审核者'">
        <vxe-toolbar ref="modelToolbar" :refresh="{ query: refreshList }" export print custom>
          <template #buttons>
            <el-button type="primary" icon="DocumentAdd" @click="assign()">分配人员</el-button>
          </template>
        </vxe-toolbar>
        <div class="jp-table-body">
          <vxe-table
            border
            auto-resize
            resizable
            height="200"
            size="small"
            ref="dataSourceList"
            show-header-overflow
            show-overflow
            highlight-hover-row
            :loading="loading"
            :menu-config="{}"
            :print-config="{}"
            :import-config="{}"
            :export-config="{}"
            :data="dataList"
            :checkbox-config="{}"
          >
            <vxe-column type="seq" header-align="center" align="center" width="50"> </vxe-column>
            <vxe-column field="type" sortable title="用户类型" :formatter="formatter"></vxe-column>
            <vxe-column
              field="assignAccount"
              sortable
              title="用户来自"
              :formatter="formatter1"
            ></vxe-column>
          </vxe-table>
        </div>
      </div>

      <div class="jp-table" v-if="dialogTitle == '待办地址'">
        <el-form :model="inputForm" ref="inputForm" label-width="120px">
          <el-row>
            <el-col :span="14">
              <el-form-item label="内网" prop="nwServerUrl">
                <el-input
                  v-model="inputForm.nwServerUrl"
                  placeholder="例：http://ip:port/xx?url=xx/xx@a={0}"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="margin-left: -45px">
              <el-switch
                v-model="inputForm.nwOnOff"
                :active-value="0"
                :inactive-value="1"
              ></el-switch>
            </el-col>
            <el-col :span="8" style="color: #8e8e8e">例：http://ip:port/xx?url=xx/xx@a={0}</el-col>
            <el-col :span="14">
              <el-form-item label="外网" prop="wwServerUrl">
                <el-input
                  v-model="inputForm.wwServerUrl"
                  maxlength="50"
                  placeholder="例：http://ip:port/xx?url=xx/xx@a={0}"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="margin-left: -45px">
              <el-switch
                v-model="inputForm.wwOnOff"
                :active-value="0"
                :inactive-value="1"
              ></el-switch>
            </el-col>
            <el-col :span="8" style="color: #8e8e8e">例：http://ip:port/xx?url=xx/xx@a={0}</el-col>
            <el-col :span="14">
              <el-form-item label="内容" prop="title">
                <el-input
                  v-model="inputForm.title"
                  maxlength="50"
                  placeholder="例：单号{0}，需要办理业务，请尽快处理"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="margin-left: -45px"></el-col>
            <el-col :span="8" style="color: #8e8e8e">例：单号{0}，需要办理业务，请尽快处理</el-col>
          </el-row>
        </el-form>
      </div>

      <div class="jp-table" v-if="dialogTitle == '告警预警'">
        <el-button type="primary" icon="DocumentAdd" @click="addRow" style="margin-bottom: 10px"
          >增加一列</el-button
        >
        <div class="jp-table-body">
          <el-table :loading="loading" :data="dataColumns" style="width: 100%">
            <el-table-column prop="dataType" label="类型">
              <template #default="scope">
                <el-select
                  v-model="scope.row.dataType"
                  placeholder="请选择"
                  @change="changeSelect"
                  style="width: 100%"
                >
                  <el-option label="应用" value="0"></el-option>
                  <el-option label="组织" value="1"></el-option>
                  <el-option label="角色" value="2"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="dataVal" label="项" width="220px">
              <template #default="scope">
                <el-select v-model="scope.row.dataVal" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="(item, index) in dataValList"
                    :key="index"
                    :label="item.value"
                    :value="item.label"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="timeType" label="时间类型">
              <template #default="scope">
                <el-select v-model="scope.row.timeType" placeholder="请选择" style="width: 100%">
                  <el-option label="分钟" value="0"></el-option>
                  <el-option label="小时" value="1"> </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="timeVal" label="时间值" width="100px">
              <template #default="scope">
                <el-input v-model="scope.row.timeVal"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="发送人" width="80px">
              <template #default="scope">
                <el-button icon="el-icon-setting" @click="sender"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="isUsed" label="是否启用" width="80px">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.isUsed"
                  :active-value="0"
                  :inactive-value="1"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px" fixed="right" align="center">
              <template #default="scope">
                <el-button
                  @click.prevent="deleteRow(scope.$index, dataColumns)"
                  type="danger"
                  size="small"
                  text
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="jp-table" v-if="dialogTitle == '自动审批'">
        <el-button type="primary" icon="DocumentAdd" @click="addRow1" style="margin-bottom: 10px"
          >增加一列</el-button
        >
        <div class="jp-table-body">
          <el-table :loading="loading" :data="dataColumns1" style="width: 100%">
            <el-table-column prop="type" label="类型">
              <template #default="scope">
                <el-select
                  v-model="scope.row.type"
                  placeholder="请选择"
                  @change="changeSelect"
                  style="width: 100%"
                >
                  <el-option label="应用" value="system"></el-option>
                  <el-option label="组织" value="org"></el-option>
                  <el-option label="角色" value="user"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="项">
              <template #default="scope">
                <el-select v-model="scope.row.value" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="(item, index) in dataValList"
                    :key="index"
                    :label="item.value"
                    :value="item.label"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="isStart" label="是否启用">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.isStart"
                  :active-value="0"
                  :inactive-value="1"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px" fixed="right" align="center">
              <template #default="scope">
                <el-button
                  @click.prevent="deleteRow(scope.$index, dataColumns1)"
                  type="danger"
                  size="small"
                  text
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false" icon="circle-close">关闭</el-button>
          <el-button type="primary" @click="submit()" icon="circle-check" v-noMoreClick
            >确定</el-button
          >
        </span>
      </template>
    </v-dialog>

    <!-- 审核者--分配人员弹窗 -->
    <v-dialog title="分配人员" :close-on-click-modal="false" v-model="dialog2Visible" width="30%">
      <el-form :model="assignForm" ref="assignForm" label-width="80px">
        <el-row>
          <el-col :span="22">
            <el-form-item
              label="应用"
              prop="queryDictType"
              :rules="[{ required: true, message: '应用不能为空', trigger: 'blur' }]"
            >
              <el-select
                style="width: 100%"
                v-model="assignForm.queryDict"
                filterable
                allow-create
                default-first-option
                clearable
              >
                <el-option
                  v-for="item in queryDictType"
                  :key="item.label"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="组织机构" prop="organ">
              <el-select
                style="width: 100%"
                v-model="assignForm.organ"
                filterable
                allow-create
                default-first-option
                clearable
              >
                <el-option
                  v-for="item in organList"
                  :key="item.label"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="角色" prop="role">
              <el-select
                style="width: 100%"
                v-model="assignForm.role"
                filterable
                allow-create
                default-first-option
                clearable
                @change="changeRole"
              >
                <el-option
                  v-for="item in roleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="账号" prop="user">
              <el-select
                style="width: 100%"
                v-model="assignForm.user"
                filterable
                allow-create
                default-first-option
                clearable
                @change="changeUser"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog2Visible = false" icon="circle-close">关闭</el-button>
          <el-button type="primary" @click="assignSave()" icon="circle-check" v-noMoreClick
            >确定</el-button
          >
        </span>
      </template>
    </v-dialog>

    <!-- 告警预警--发送人弹窗 -->
    <v-dialog title="发送人" :close-on-click-modal="false" v-model="dialog3Visible" width="50%">
      <div class="jp-table" v-if="dialogTitle == '告警预警'">
        <el-button type="primary" icon="DocumentAdd" @click="addRowSend" style="margin-bottom: 10px"
          >增加一列</el-button
        >
        <div class="jp-table-body">
          <el-table :data="sendColumns" style="width: 100%">
            <el-table-column prop="dataType" label="优先级">
              <template #default="scope">
                <el-select
                  v-model="scope.row.dataType"
                  placeholder="请选择"
                  @change="changeSelect1(scope.row)"
                  style="width: 100%"
                >
                  <el-option label="告警" value="1"></el-option>
                  <el-option label="预警" value="0"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="toPeopleName" label="发送人">
              <template #default="scope">
                <el-select
                  v-model="scope.row.toPeopleName"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option label="王五" value="0"></el-option>
                  <el-option label="小红" value="1"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="dataVal" label="发送人">
            <template #default="scope">
              <el-select v-model="scope.row.dataVal" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="(item, index) in dataValList"
                  :key="index"
                  :label="item.value"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column> -->
            <el-table-column prop="timeStr" label="时间">
              <template #default="scope">
                <el-input v-model="scope.row.timeStr"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="通知内容">
              <template #default="scope">
                <el-input v-model="scope.row.content"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="isSend" label="是否发送">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.isSend"
                  :active-value="0"
                  :inactive-value="1"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px" fixed="right" align="center">
              <template #default="scope">
                <el-button
                  @click.prevent="deleteRowSend(scope.$index, sendColumns)"
                  type="danger"
                  size="small"
                  text
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog3Visible = false" icon="circle-close">关闭</el-button>
          <el-button type="primary" @click="sendSave()" icon="circle-check" v-noMoreClick
            >确定</el-button
          >
        </span>
      </template>
    </v-dialog>
  </section>
</template>

<script>
import modelService from '@/api/flowable/modelService';
export default {
  data() {
    return {
      visible: false,
      dialogVisible: false,
      dialogTitle: '',
      dialog2Visible: false,
      dialog3Visible: false,
      loading: false,
      dataTable: [],
      dataList: [],
      dataListNew: [],
      queryDictType: [],
      organList: [],
      roleList: [
        {
          value: 1,
          label: '管理员',
        },
        {
          value: 2,
          label: '管理员11',
        },
      ],
      userList: [
        {
          value: 1,
          label: 'admin',
        },
      ],
      assignForm: {
        queryDict: '',
        organ: '',
        role: '',
        user: '',
        type: '',
        assignValue: '',
        assignCondition: '0',
        operationType: '0',
        sort: '1',
      },
      inputForm: {
        nwServerUrl: '',
        nwOnOff: 1,
        wwServerUrl: '',
        wwOnOff: 1,
        title: '',
      },
      dataColumns: [],
      dataValList: [
        {
          value: '项1',
          label: 1,
        },
      ],
      sendColumns: [],
      dataColumns1: [],
      processDefId: '', // 流程id
      taskDefKey: '', // 节点id
    };
  },
  methods: {
    init(processDefId) {
      this.visible = true;
      this.loading = true;
      this.processDefId = processDefId;
      modelService
        .processesId({
          processDefId,
        })
        .then((data) => {
          this.dataTable = data;
          this.loading = false;
        });

      // 应用
      modelService.queryDictType({ dictType: 'zhgyl_app_type' }).then((data) => {
        this.queryDictType = data;
      });
      // 组织机构
      modelService.organList().then((data) => {
        this.organList = data;
      });
      // 角色
      modelService.roleList().then((data) => {
        this.roleList = data;
      });
      // 账号
      modelService.userList().then((data) => {
        this.userList = data;
      });
    },

    detail(scope, title, id) {
      this.dialogTitle = title;
      this.taskDefKey = scope.taskDefId;

      if (this.dialogTitle == '审核者') {
        this.dialogVisible = true;
        this.loading = true;
        modelService
          .taskList({
            processInstanceDefKey: this.processDefId.split(':')[0],
            taskDefKey: this.taskDefKey,
          })
          .then((data) => {
            this.dataList = data;
            this.loading = false;
          });
      }
      if (this.dialogTitle == '待办地址') {
        modelService
          .selectByTaskDefId({
            taskDefId: this.taskDefKey,
          })
          .then((data) => {
            this.inputForm = data;
            this.dialogVisible = true;
          });
      }
      if (this.dialogTitle == '告警预警') {
        this.dialogVisible = true;
        this.loading = true;
        modelService
          .findWarningData({
            taskDefKey: this.taskDefKey,
          })
          .then((data) => {
            this.dataColumns = data;
            this.loading = false;
          });
      }
      if (this.dialogTitle == '自动审批') {
        this.dialogVisible = true;
        this.loading = true;
        modelService
          .auditList({
            taskDefKey: this.taskDefKey,
          })
          .then((data) => {
            this.dataColumns1 = data;
            this.loading = false;
          });
      }
    },

    // 分配人员
    assign() {
      this.dialog2Visible = true;
    },

    // 分配人员--角色下拉框方法
    changeRole(val) {
      if (val) {
        const role = this.roleList.find((item) => item.label == val);
        this.assignForm.type = 'role';
        this.assignForm.assignValue = role.value;
      }
    },

    // 分配人员--账号下拉框方法
    changeUser(val) {
      if (val) {
        const user = this.userList.find((item) => item.label == val);
        this.assignForm.type = 'user';
        this.assignForm.assignValue = user.value;
      }
    },

    // 分配人员--保存
    assignSave() {
      this.dialog2Visible = false;

      const form = JSON.parse(JSON.stringify(this.assignForm));
      this.dataListNew.push(form);
      this.dataList = this.dataListNew;
      this.$refs.dataSourceList.loadData(this.dataList);
    },

    // 审核者--用户类型
    formatter(val) {
      if (val.row.user || val.cellValue == 'user') {
        return '用户';
      } else if (val.row.role || val.cellValue == 'role') {
        return '角色';
      }
    },

    // 审核者--用户来自
    formatter1(val) {
      if (val.row.user) {
        return val.row.user;
      } else if (val.row.role) {
        return val.row.role;
      } else {
        return val.cellValue;
      }
    },

    // 告警预警--新增行
    addRow() {
      if (this.dataColumns.length > 0) {
        return this.$message.error('只存在一种维度的预警方式，请修改预警类型');
      }
      this.dataColumns.push({
        dataType: '',
        dataVal: '',
        timeType: '',
        timeVal: '',
        isUsed: 1,
      });
    },

    // 告警预警--删除行
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },

    // 告警预警--根据类型来展示对应的项
    changeSelect(val) {
      // this.dataColumns[0].dataVal = '';
      // if (val == 0) {
      //   this.dataValList = this.queryDictType;
      // } else if (val == 1) {
      //   this.dataValList = this.organList;
      // } else if (val == 2) {
      //   this.dataValList = this.roleList;
      // }
    },

    // 告警预警--发送人
    sender() {
      this.dialog3Visible = true;
    },

    // 告警预警--发送人--新增行
    addRowSend() {
      this.sendColumns.push({
        dataType: '',
        toPeopleName: '',
        timeStr: '',
        content: '',
        isSend: 1,
      });
    },

    // 告警预警--发送人--删除行
    deleteRowSend(index, rows) {
      rows.splice(index, 1);
    },

    // 告警预警--发送人--根据优先级来展示对应的时间
    changeSelect1(val) {
      if (val.dataType == '0') {
        val.timeStr = this.dataColumns[0].timeVal;
      } else {
        val.timeStr = '';
      }
    },

    // 告警预警--发送人保存
    sendSave() {
      this.dialog3Visible = false;
    },

    // 自动审批--新增行
    addRow1() {
      if (this.dataColumns1.length > 0) {
        return this.$message.error('自动审批功能只支持一种维度的方式，请修改类型');
      }
      this.dataColumns1.push({
        type: '',
        value: '',
        isStart: 1,
      });
    },

    // 流程节点提交
    submit() {
      if (this.dialogTitle == '审核者') {
        modelService
          .assingeeSave({
            processDefKey: this.processDefId.split(':')[0],
            taskDefKey: this.taskDefKey,
            flowAssigneeList: this.dataList,
          })
          .then((data) => {
            this.dialogVisible = false;
            this.dataList = [];
            this.$message.success('提交成功');
          });
      }

      if (this.dialogTitle == '待办地址') {
        modelService
          .taskSave({
            appId: this.processDefId.split(':')[0],
            taskDefId: this.taskDefKey,
            ...this.inputForm,
          })
          .then((data) => {
            this.dialogVisible = false;
            this.$message.success('提交成功');
          });
      }

      if (this.dialogTitle == '告警预警') {
        if (this.dataColumns[0].timeVal == '') {
          return this.$message.error('发送人数据不能为空！');
        }
        modelService
          .warnSave({
            id: this.dataColumns[0].id,
            taskDefKey: this.taskDefKey,
            dataType: this.dataColumns[0].dataType,
            dataVal: this.dataColumns[0].dataVal,
            timeType: this.dataColumns[0].timeType,
            timeVal: this.dataColumns[0].timeVal,
            isUsed: this.dataColumns[0].isUsed,
            warningInfoVos: this.sendColumns,
          })
          .then((data) => {
            this.dialogVisible = false;
            this.$message.success('提交成功');
          });
      }

      if (this.dialogTitle == '自动审批') {
        modelService
          .auditSave({
            id: this.processDefId.split(':')[0],
            taskDefKey: this.taskDefKey,
            type: this.dataColumns[0].type,
            value: this.dataColumns[0].value,
            isStart: this.dataColumns[0].isStart,
          })
          .then((data) => {
            this.dialogVisible = false;
            this.$message.success('提交成功');
          });
      }
    },
  },
};
</script>
