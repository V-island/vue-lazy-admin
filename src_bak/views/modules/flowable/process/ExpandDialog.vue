<template>
  <section>
    <VcDialog
      :loading="loading"
      :visible="config.show"
      :title="config.title"
      width="900px"
      @update:visible="config.show = $event"
    >
      <vxe-toolbar>
        <template #buttons>
          <el-button type="primary" @click="handleBoundApp" :disabled="selectList.length == 0"
            >绑定应用</el-button
          >
          <el-button type="primary" @click="handleInspector" :disabled="selectList.length == 0"
            >审核者</el-button
          >
          <el-button type="primary" @click="handleTodoAddress" :disabled="selectList.length == 0"
            >待办地址</el-button
          >
          <el-button type="primary" @click="handleAlarmWarning" :disabled="selectList.length == 0"
            >告警预警</el-button
          >
          <el-button type="primary" @click="handleAutoApproval" :disabled="selectList.length == 0"
            >自动审批</el-button
          >
        </template>
      </vxe-toolbar>
      <vxe-table
        height="400"
        ref="table"
        :data="tableData"
        :loading="loading"
        :menu-config="{}"
        :print-config="{}"
        :import-config="{}"
        :export-config="{}"
        :checkbox-config="{}"
        @checkbox-change="selectChangeEvent"
        show-header-overflow
        show-overflow
        highlight-hover-row
        border
        auto-resize
        resizable
      >
        <vxe-column type="seq" header-align="center" align="center" width="50"> </vxe-column>
        <vxe-column type="checkbox" width="50"></vxe-column>
        <vxe-column field="taskDefName" title="流程节点名称" sortable></vxe-column>
        <vxe-column
          field="system"
          title="绑定应用"
          :formatter="formatterDeploy"
          width="100"
          sortable
        >
        </vxe-column>
        <vxe-column
          field="auditPerson"
          title="配置审核者"
          :formatter="formatterDeploy"
          width="120"
          sortable
        >
        </vxe-column>
        <vxe-column field="task" title="配置待办" :formatter="formatterDeploy" width="100" sortable>
        </vxe-column>
        <vxe-column
          field="warn"
          title="配置告警预警"
          :formatter="formatterDeploy"
          width="130"
          sortable
        >
        </vxe-column>
        <vxe-column
          field="autoAudit"
          title="配置自动审批"
          :formatter="formatterDeploy"
          width="130"
          sortable
        ></vxe-column>
      </vxe-table>
      <!-- 绑定应用 -->
      <BoundAppDialog :config="boundAppConfig" :form="boundAppObj" />
      <!-- 审核者 -->
      <InspectorDialog :config="inspectorConfig" />
      <!-- 待办地址 -->
      <TodoAddressDialog :config="todoAddressConfig" :form="todoAddressObj" />
      <!-- 告警预警 -->
      <AlarmWarningDialog :config="alarmWarningConfig" />
      <!-- 自动审批 -->
      <AutoApprovalDialog :config="autoApprovalConfig" />
      <template #footer>
        <el-button @click="config.show = false" icon="circle-close">关闭</el-button>
      </template>
    </VcDialog>
  </section>
</template>

<script>
import xeUtils from 'xe-utils';
import DialogMixin from 'mixins/dialog';
import modelService from 'api/flowable/modelService';
import { getResult } from 'utils';
import BoundAppDialog from './BoundAppDialog';
import InspectorDialog from './InspectorDialog';
import TodoAddressDialog from './TodoAddressDialog';
import AlarmWarningDialog from './AlarmWarningDialog';
import AutoApprovalDialog from './AutoApprovalDialog';

export default {
  mixins: [DialogMixin],
  components: {
    BoundAppDialog,
    InspectorDialog,
    TodoAddressDialog,
    AlarmWarningDialog,
    AutoApprovalDialog,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      selectList: [],
      // 绑定应用
      boundAppConfig: {
        title: '绑定应用',
        show: false,
        params: {},
      },
      boundAppObj: {},
      // 审核者
      inspectorConfig: {
        title: '审核者',
        show: false,
        params: {},
      },
      // 待办地址
      todoAddressConfig: {
        title: '待办地址',
        show: false,
        params: {},
      },
      todoAddressObj: {},
      // 告警预警
      alarmWarningConfig: {
        title: '告警预警',
        show: false,
        params: {},
      },
      // 自动审批
      autoApprovalConfig: {
        title: '自动审批',
        show: false,
        params: {},
      },
    };
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.loading = true;
      this.selectList = [];
      // 获取节点列表
      let [err, data] = await this._awaitWrap(this.getAllProcess());
      this.loading = false;
      if (err || !data.result) return this.$message.error(err || data.message);
    },
    formatterDeploy({ cellValue }) {
      if (cellValue == `0`) return `否`;
      else if (cellValue == `1`) return `是`;
      else return `-`;
    },
    /** =========== 基础事件 ========== */
    selectChangeEvent() {
      const selectList = this.$refs.table.getCheckboxRecords();
      this.selectList = selectList;
    },
    // 绑定应用
    async handleBoundApp() {
      if (this.selectList.length > 1) return this.$message.warning('只能选中一条数据!');

      const { taskDefId } = this._get(this, 'selectList[0]', {});

      // 获取节点关联应用ID
      let [error, appInfo] = await this._awaitWrap(modelService.getAppIdByTaskDefId({ taskDefId }));
      if (error) return this.$message.error(error);
      const clientId = appInfo.clientId;

      this.boundAppConfig.show = true;
      this.boundAppConfig.params = {
        taskDefId,
      };
      this.boundAppObj = {
        clientId,
      };
    },
    // 审核者
    async handleInspector() {
      if (this.selectList.length > 1) return this.$message.warning('只能选中一条数据!');

      const { taskDefId } = this._get(this, 'selectList[0]', {});
      const { id } = this._get(this.config, 'params');

      // 获取节点关联应用ID
      let [error, appInfo] = await this._awaitWrap(modelService.getAppIdByTaskDefId({ taskDefId }));
      if (error) return this.$message.error(error);
      const appId = appInfo.clientId;

      if (!appId) return this.$message.error('请先给该节点绑定应用');

      this.inspectorConfig.show = true;
      this.inspectorConfig.params = {
        processInstanceDefKey: id.split(':')[0],
        taskDefKey: taskDefId,
        appId,
      };
    },
    // 待办地址
    async handleTodoAddress() {
      if (this.selectList.length > 1) return this.$message.warning('只能选中一条数据!');

      const { taskDefId } = this._get(this, 'selectList[0]', {});
      const params = {
        taskDefId,
      };

      // 获取节点关联应用ID
      let [err, appInfo] = await this._awaitWrap(modelService.getAppIdByTaskDefId({ taskDefId }));
      if (err) return this.$message.error(err);
      const appId = appInfo.clientId;

      if (!appId) return this.$message.error('请先给该节点绑定应用');

      // 获取应用列表
      let [errorDict, dictList] = await this._awaitWrap(
        modelService.queryDictType({ dictType: 'zhgyl_app_type' }),
      );
      if (errorDict) return Promise.resolve(getResult(false, errorDict));
      const appItem = xeUtils.find(dictList, (item) => item.label.split(':')[0] == appId);

      if (!appItem) return this.$message.error('请先给该节点绑定应用');

      // 获取待办地址详情
      let [error, todoAddress] = await this._awaitWrap(modelService.selectByTaskDefId(params));
      if (error) return this.$message.error(error);

      this.todoAddressConfig.show = true;
      this.todoAddressConfig.params = {
        appId: appItem.label.split(':')[1],
        taskDefId,
      };
      this.todoAddressObj = todoAddress || {
        nwServerUrl: '',
        nwOnOff: null,
        wwServerUrl: '',
        wwOnOff: null,
        title: '',
      };
    },
    // 告警预警
    async handleAlarmWarning() {
      if (this.selectList.length > 1) return this.$message.warning('只能选中一条数据!');

      const { taskDefId } = this._get(this, 'selectList[0]', {});

      // 获取节点关联应用ID
      let [err, appInfo] = await this._awaitWrap(modelService.getAppIdByTaskDefId({ taskDefId }));
      if (err) return this.$message.error(err);
      const appId = appInfo.clientId;

      if (!appId) return this.$message.error('请先给该节点绑定应用');
      this.alarmWarningConfig.show = true;
      this.alarmWarningConfig.params = {
        appId,
        taskDefKey: taskDefId,
      };
    },
    // 自动审批
    async handleAutoApproval() {
      if (this.selectList.length > 1) return this.$message.warning('只能选中一条数据!');

      const { taskDefId } = this._get(this, 'selectList[0]', {});
      const { id } = this._get(this.config, 'params');

      // 获取节点关联应用ID
      let [err, appInfo] = await this._awaitWrap(modelService.getAppIdByTaskDefId({ taskDefId }));
      if (err) return this.$message.error(err);
      const appId = appInfo.clientId;

      this.autoApprovalConfig.show = true;
      this.autoApprovalConfig.params = {
        appId,
        id: id.split(':')[0],
        taskDefKey: taskDefId,
      };
    },
    /** =========== 接口请求 ========== */
    // 获取节点列表
    async getAllProcess() {
      const { id } = this._get(this.config, 'params');
      const params = {
        processDefId: id,
      };

      // 获取节点列表
      let [error, info] = await this._awaitWrap(modelService.processesId(params));
      if (error) return Promise.resolve(getResult(false, error));
      this.tableData = info || [];

      return Promise.resolve(getResult(true, '节点列表初始化完成'));
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
    'boundAppConfig.show': {
      handler(_new, _old) {
        if (_new != _old && !_new) this.initLoadData();
      },
    },
    'inspectorConfig.show': {
      handler(_new, _old) {
        if (_new != _old && !_new) this.initLoadData();
      },
    },
    'todoAddressConfig.show': {
      handler(_new, _old) {
        if (_new != _old && !_new) this.initLoadData();
      },
    },
    'alarmWarningConfig.show': {
      handler(_new, _old) {
        if (_new != _old && !_new) this.initLoadData();
      },
    },
    'autoApprovalConfig.show': {
      handler(_new, _old) {
        if (_new != _old && !_new) this.initLoadData();
      },
    },
  },
};
</script>
