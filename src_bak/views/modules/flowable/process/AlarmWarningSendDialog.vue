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
        <el-table :data="tableData" :loading="loading">
          <el-table-column prop="dataType" label="预警类型">
            <template #default="{ row, $index }">
              <el-select
                v-model="row.dataType"
                placeholder="请选择"
                @change="(value) => handleTypeSelect(value, $index)"
                clearable
              >
                <el-option label="告警" :value="Number(1)"></el-option>
                <el-option label="预警" :value="Number(0)"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="toPeopleName" label="发送人">
            <template #default="{ row, $index }">
              {{ row.toPeopleName || '-' }}
              <el-button icon="el-icon-user" @click="handleSendPeopleEvent($index)"></el-button>
            </template>
          </el-table-column>
          <el-table-column prop="timeStr" label="时间">
            <template #default="{ row }">
              <el-input
                v-model="row.timeStr"
                :disabled="row.dataType == '0' ? true : false"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="通知内容">
            <template #default="{ row }">
              <el-input v-model="row.content"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="isSend" label="是否发送">
            <template #default="{ row }">
              <el-switch v-model="row.isSend" :active-value="0" :inactive-value="1"></el-switch>
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
      <AlarmWarningPeopleDialog :config="peopleConfig" :form="peopleObj" @save="savePeopleEvent" />
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
import AlarmWarningPeopleDialog from './AlarmWarningPeopleDialog';

export default {
  mixins: [DialogMixin],
  components: {
    AlarmWarningPeopleDialog,
  },
  data() {
    return {
      loading: false,
      tableData: [],
      // 发送人
      peopleConfig: {
        title: '发送人',
        show: false,
        params: {},
      },
      peopleObj: {},
    };
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.loading = true;
      this.tableData = [];

      // 获取告警预警列表
      const { warningInfoVos } = this._get(this.config, 'params');
      this.tableData = warningInfoVos;

      // 获取自动审批列表
      let [err, data] = await this._awaitWrap(this.getAllProcess());
      this.loading = false;
      if (err || !data.result) return this.$message.error(err || data.message);
    },
    /** =========== 基础事件 ========== */
    // 选择预警类型事件
    handleTypeSelect(value, index) {
      const { timeVal } = this._get(this.config, 'params');
      const list = [...this.tableData];
      const item = list[index];

      if (!item) return false;
      item.timeStr = value == '0' ? timeVal : '';
      this.tableData = list;
    },
    // 新增
    handleAddEvent() {
      const list = this.tableData != undefined ? [...this.tableData] : [];
      const params = {
        dataType: null,
        toPeopleName: '',
        timeStr: '',
        content: '',
        isSend: 1,
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
    // 选择发送人
    handleSendPeopleEvent(index) {
      this.peopleConfig.show = true;
      this.peopleConfig.params = {
        index,
      };
      this.peopleObj = {
        appId: '',
        roleId: '',
        roleName: '',
        userId: '',
        userName: '',
      };
    },
    // 保存发送人回调
    savePeopleEvent(index, peopleInfo) {
      const list = [...this.tableData];
      const item = list[index];

      if (!item) return false;
      item.appId = peopleInfo.appId;
      item.toPeopleId = peopleInfo.userId;
      item.toPeopleName = peopleInfo.userName;
      this.tableData = list;
    },
    // 保存
    onSubmitOrSave() {
      if (this.tableData.length > 2) return this.$message.error('只存在两种预警类型');

      const rowList = this.tableData;
      const dataType = rowList.map((item) => item.dataType);
      const dataTypeSet = new Set(dataType);
      if (!(dataTypeSet.size === dataType.length)) {
        return this.$message.error('预警类型不能相同');
      }

      const aa = rowList.filter((item) => item.dataType == 0);
      const bb = rowList.filter((item) => item.dataType == 1);
      if (aa.length > 0 && bb.length > 0) {
        if (!(Number(aa[0].timeStr) < Number(bb[0].timeStr))) {
          return this.$message.error('告警时间应该大于预警时间');
        }
      }

      if (this.tableData.length == 0) return this.$message.error('请先添加发送人信息');
      const { index } = this._get(this.config, 'params');
      const sendList = this._get(this, 'tableData', []);

      this.$emit('save', index, sendList);
      this.config.show = false;
    },
    /** =========== 接口请求 ========== */
    // 获取自动审批列表
    async getAllProcess() {
      const { taskDefKey, appId } = this._get(this.config, 'params');
      // const params = {
      //   taskDefKey,
      // };

      // // 获取告警预警列表
      // let [error, list] = await this._awaitWrap(modelService.findWarningData(params));
      // if (error) return Promise.resolve(getResult(false, error));
      // this.tableData = list[0].warningInfoVos || [];

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

      return Promise.resolve(getResult(true, '自动审批初始化完成'));
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
