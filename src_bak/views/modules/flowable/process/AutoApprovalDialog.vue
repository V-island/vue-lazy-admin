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
        <vxe-toolbar>
          <template #buttons>
            <el-button
              type="primary"
              icon="DocumentAdd"
              @click="handleAddEvent"
              :disabled="tableData.length > 0"
              >增加一列</el-button
            >
          </template>
        </vxe-toolbar>
        <el-table :data="tableData" :loading="loading">
          <el-table-column prop="type" label="类型">
            <template #default="{ row, $index }">
              <el-select
                v-model="row.type"
                placeholder="请选择"
                @change="() => handleTypeSelect($index)"
              >
                <el-option label="应用" value="system"></el-option>
                <el-option label="组织" value="org"></el-option>
                <el-option label="角色" value="user"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="项">
            <template #default="{ row }">
              <template v-if="row.type == 'system'">
                <el-select
                  v-model="row.value"
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
              <template v-if="row.type == 'org'">
                <el-cascader
                  v-model="row.value"
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
              <template v-if="row.type == 'user'">
                <el-select
                  v-model="row.value"
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
          <el-table-column prop="isStart" label="是否启用">
            <template #default="{ row }">
              <el-switch v-model="row.isStart" :active-value="0" :inactive-value="1"></el-switch>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="100px" align="center">
            <template #default="{ $index }">
              <el-button @click.prevent="handleDelEvent($index)" type="danger" text>
                移除
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
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

export default {
  mixins: [DialogMixin],
  data() {
    return {
      loading: false,
      tableData: [],
      dictTypeList: [],
      organList: [],
      roleList: [],
    };
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.loading = true;
      // 获取自动审批列表
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
      item.value = '';
      this.tableData = list;
    },
    // 新增
    handleAddEvent() {
      if (this.tableData.length > 0)
        return this.$message.error('自动审批功能只支持一种维度的方式，请修改类型');

      this.tableData.push({
        type: '',
        value: '',
        isStart: 1,
      });
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
      if (this.tableData.length == 0) return this.$message.error('请先添加自动审批信息');

      this.saveAutoApproval();
    },
    /** =========== 接口请求 ========== */
    // 获取自动审批列表
    async getAllProcess() {
      const { taskDefKey, appId } = this._get(this.config, 'params');
      const params = {
        taskDefKey,
      };

      // 获取自动审批列表
      let [error, list] = await this._awaitWrap(modelService.auditList(params));
      if (error) return Promise.resolve(getResult(false, error));
      if (list) this.tableData = [list];
      else this.tableData = [];

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
    // 新增或更新自动审批
    async saveAutoApproval() {
      const { id, taskDefKey } = this._get(this.config, 'params');
      const item = this._get(this, 'tableData[0]', {});
      const params = {
        id,
        taskDefKey,
        ...item,
      };

      // 新增或更新自动审批
      let [error] = await this._awaitWrap(modelService.auditSave(params));
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
