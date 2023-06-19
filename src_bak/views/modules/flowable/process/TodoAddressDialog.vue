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
        <el-form-item label="内网" prop="nwServerUrl">
          <el-input v-model="form.nwServerUrl" placeholder="例：http://ip:port/xx?url=xx/xx@a={0}">
            <template #prepend>
              <el-tooltip content="例：http://ip:port/xx?url=xx/xx@a={0}" placement="top-start">
                <el-icon><Warning /></el-icon>
              </el-tooltip>
            </template>
            <template #append>
              <el-switch v-model="form.nwOnOff" :active-value="0" :inactive-value="1"></el-switch>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="外网" prop="wwServerUrl">
          <el-input v-model="form.wwServerUrl" placeholder="例：http://ip:port/xx?url=xx/xx@a={0}">
            <template #prepend>
              <el-tooltip content="例：http://ip:port/xx?url=xx/xx@a={0}" placement="top-start">
                <el-icon><Warning /></el-icon>
              </el-tooltip>
            </template>
            <template #append>
              <el-switch v-model="form.wwOnOff" :active-value="0" :inactive-value="1"></el-switch>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="内容" prop="title">
          <el-input
            v-model="form.title"
            maxlength="50"
            placeholder="例：单号{0}，需要办理业务，请尽快处理"
          >
            <template #prepend>
              <el-tooltip content="例：单号{0}，需要办理业务，请尽快处理" placement="top-start">
                <el-icon><Warning /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
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
import DialogMixin from 'mixins/dialog';
import modelService from 'api/flowable/modelService';

export default {
  mixins: [DialogMixin],
  data() {
    return {
      loading: false,
      rules: {
        nwServerUrl: [
          {
            validator: (rule, value, callback) => {
              const { nwOnOff } = this.form;
              if (!nwOnOff && (!value || value === '')) {
                callback(new Error('请输入内网地址'));
              } else {
                callback();
              }
            },
            trigger: ['change', 'blur'],
          },
        ],
        wwServerUrl: [
          {
            validator: (rule, value, callback) => {
              const { wwOnOff } = this.form;
              if (!wwOnOff && (!value || value === '')) {
                callback(new Error('请输入外网地址'));
              } else {
                callback();
              }
            },
            trigger: ['change', 'blur'],
          },
        ],
      },
    };
  },
  methods: {
    /** =========== 基础事件 ========== */
    // 保存
    onSubmitOrSave() {
      this.$refs.form.validate((valid) => {
        if (valid) this.saveTodoAddress();
        else this.$message.error('请输入正确的值');
      });
    },
    /** =========== 接口请求 ========== */
    // 保存待办地址
    async saveTodoAddress() {
      const { appId, taskDefId } = this._get(this.config, 'params');
      const form = this._get(this, 'form');
      const params = {
        appId,
        taskDefId,
        ...form,
      };

      // 保存待办地址
      let [error] = await this._awaitWrap(modelService.taskSave(params));
      if (error) return this.$message.error(error);
      this.$message.success('提交成功');
      this.config.show = false;
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
