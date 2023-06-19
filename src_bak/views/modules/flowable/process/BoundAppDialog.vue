<template>
  <section>
    <VcDialog
      :loading="loading"
      :visible="config.show"
      :title="config.title"
      width="500px"
      @update:visible="config.show = $event"
    >
      <VcForm ref="form" :model="form" :rules="rules" label-width="80px" inline>
        <el-form-item label="应用" prop="clientId">
          <el-select v-model="form.clientId" filterable allow-create default-first-option clearable>
            <el-option
              v-for="item in dictTypeList"
              :key="item.label"
              :label="item.value"
              :value="item.label.split(':')[0]"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </VcForm>
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
import { getResult } from 'utils';
import DialogMixin from 'mixins/dialog';
import modelService from 'api/flowable/modelService';

export default {
  mixins: [DialogMixin],
  data() {
    return {
      loading: false,
      dictTypeList: [],
      rules: {
        appId: [{ required: true, message: '应用不能为空', trigger: ['change', 'blur'] }],
      },
    };
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.loading = true;
      // 获取应用列表
      let [err, data] = await this._awaitWrap(this.getAllAssign());
      this.loading = false;
      if (err || !data.result) return this.$message.error(err || data.message);
    },
    /** =========== 基础事件 ========== */
    // 保存
    onSubmitOrSave() {
      this.$refs.form.validate((valid) => {
        if (valid) this.saveAppId();
        else this.$message.error('请输入正确的值');
      });
    },
    /** =========== 接口请求 ========== */
    // 获取应用列表
    async getAllAssign() {
      const params = {
        dictType: 'zhgyl_app_type',
      };

      // 获取应用列表
      let [error, dictList] = await this._awaitWrap(modelService.queryDictType(params));
      if (error) return Promise.resolve(getResult(false, error));
      this.dictTypeList = dictList || [];

      return Promise.resolve(getResult(true, '应用初始化完成'));
    },
    // 新增或更新关联应用
    async saveAppId() {
      const { taskDefId } = this._get(this.config, 'params');
      const form = this._get(this, 'form');
      const params = {
        taskDefId,
        ...form,
      };

      // 新增或更新关联应用
      let [error] = await this._awaitWrap(modelService.saveAppIdByTaskDefId(params));
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

<style lang="scss" scoped>
::v-deep {
  .el-form-item {
    width: 460px;
    flex: 0 0 460px;
    margin-bottom: 22px !important;
  }
  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
