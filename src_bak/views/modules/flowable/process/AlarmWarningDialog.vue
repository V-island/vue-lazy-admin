<template>
  <section>
    <VcDialog
      :loading="loading"
      :visible="config.show"
      :title="config.title"
      width="900px"
      @update:visible="config.show = $event"
    >
      <div class="jp-table">
        <vxe-toolbar>
          <template #buttons>
            <el-button type="primary" icon="DocumentAdd" @click="handleAddEvent"
              >增加一列</el-button
            >
          </template>
        </vxe-toolbar>
        <el-table :loading="loading" :data="tableData">
          <el-table-column prop="dataType" label="类型">
            <template #default="{ row, $index }">
              <el-select
                v-model="row.dataType"
                placeholder="请选择"
                @change="() => handleTypeSelect($index)"
                clearable
              >
                <el-option label="应用" :value="Number(0)"></el-option>
                <el-option label="组织" :value="Number(1)"></el-option>
                <el-option label="角色" :value="Number(2)"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="dataVal" label="项" width="220px">
            <template #default="{ row }">
              <template v-if="row.dataType == 0">
                <el-select
                  v-model="row.dataVal"
                  placeholder="请选择"
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
              </template>
              <template v-if="row.dataType == 1">
                <el-cascader
                  v-model="row.dataVal"
                  :options="organList"
                  placeholder="请选择"
                  :props="{
                    label: 'name',
                    value: 'uniCode',
                    children: 'children',
                    checkStrictly: true,
                    emitPath: false,
                  }"
                  :show-all-levels="false"
                  clearable
                ></el-cascader>
              </template>
              <template v-if="row.dataType == 2">
                <el-select
                  v-model="row.dataVal"
                  placeholder="请选择"
                  filterable
                  allow-create
                  default-first-option
                  clearable
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="timeType" label="时间类型">
            <template #default="{ row }">
              <el-select v-model="row.timeType" placeholder="请选择" clearable>
                <el-option label="天" :value="Number(0)"></el-option>
                <el-option label="小时" :value="Number(1)"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="timeVal" label="时间值" width="100px">
            <template #default="{ row }">
              <el-input v-model="row.timeVal"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="发送人" width="80px">
            <template #default="{ row, $index }">
              <el-button icon="el-icon-setting" @click="handleSendEvent($index, row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="isUsed" label="是否启用" width="80px">
            <template #default="{ row }">
              <el-switch v-model="row.isUsed" :active-value="0" :inactive-value="1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px" align="center">
            <template #default="{ $index }">
              <el-button @click.prevent="handleDelEvent($index)" type="danger" text>
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 发送人 -->
      <AlarmWarningSendDialog :config="sendConfig" @save="saveSendEvent" />
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
import DialogMixin from 'mixins/dialog';
import modelService from 'api/flowable/modelService';
import { getResult } from 'utils';
import AlarmWarningSendDialog from './AlarmWarningSendDialog';

export default {
  mixins: [DialogMixin],
  components: {
    AlarmWarningSendDialog,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      dictTypeList: [],
      organList: [],
      roleList: [],
      // 发送人
      sendConfig: {
        title: '发送人',
        show: false,
        params: {},
      },
    };
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.loading = true;
      this.tableData = [];
      this.dictTypeList = [];
      this.organList = [];
      this.roleList = [];
      // 获取告警预警列表
      let [err, data] = await this._awaitWrap(this.getAllProcess());
      this.loading = false;
      if (err || !data.result) return this.$message.error(err || data.message);
    },
    /** =========== 基础事件 ========== */
    // 选择类型事件
    handleTypeSelect(index) {
      const list = [...this.tableData];
      const item = list[index];

      if (!item) return false;
      item.dataVal = '';
      this.tableData = list;
    },
    // 新增
    handleAddEvent() {
      if (this.tableData.length > 0)
        return this.$message.error('只存在一种维度的预警方式，请修改预警类型');

      const list = [...this.tableData];
      const params = {
        dataType: 0,
        dataVal: '',
        timeType: 0,
        timeVal: '',
        isUsed: 1,
      };
      list.push(params);
      this.tableData = list;
    },
    // 删除
    handleDelEvent(index) {
      const list = [...this.tableData];
      const item = list[index];

      if (!item) return false;
      list.splice(index, 1);
      this.tableData = list;
    },
    // 保存
    onSubmitOrSave() {
      if (this.tableData.length == 0) return this.$message.error('发送人数据不能为空！');

      this.saveAlarmWarning();
    },
    // 发送人
    handleSendEvent(index, row) {
      const { appId, taskDefKey } = this._get(this.config, 'params');
      this.sendConfig.show = true;
      this.sendConfig.params = {
        index,
        appId,
        taskDefKey,
        timeVal: row.timeVal,
        warningInfoVos: row.warningInfoVos
      };
    },
    // 保存发送人回调
    saveSendEvent(index, sendList) {
      const list = [...this.tableData];
      const item = list[index];

      if (!item) return false;
      item.warningInfoVos = sendList;
      this.tableData = list;
    },
    /** =========== 接口请求 ========== */
    // 获取告警预警列表
    async getAllProcess() {
      const { taskDefKey, appId } = this._get(this.config, 'params');
      const params = {
        taskDefKey,
      };

      // 获取应用列表
      let [errorDict, dictList] = await this._awaitWrap(
        modelService.queryDictType({ dictType: 'zhgyl_app_type' }),
      );
      if (errorDict) return Promise.resolve(getResult(false, errorDict));
      this.dictTypeList = dictList || [];

      // 获取组织列表
      let [errOrgan, organList] = await this._awaitWrap(modelService.organList());
      if (errOrgan) return this.$message.error(errOrgan);
      this.organList = organList || [];

      // 获取角色列表
      let [errRole, roleList] = await this._awaitWrap(modelService.roleList({ appId }));
      if (errRole) return this.$message.error(errRole);
      this.roleList = roleList || [];

      // 获取告警预警列表
      let [error, list] = await this._awaitWrap(modelService.findWarningData(params));
      if (error) return Promise.resolve(getResult(false, error));
      this.tableData = list || [];

      return Promise.resolve(getResult(true, '告警预警初始化完成'));
    },
    // 新增或更新告警预警
    async saveAlarmWarning() {
      const { taskDefKey } = this._get(this.config, 'params');
      const item = this._get(this, 'tableData[0]', {});
      const params = {
        taskDefKey,
        ...item,
      };

      // 新增或更新自动审批
      let [error] = await this._awaitWrap(modelService.warnSave(params));
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
