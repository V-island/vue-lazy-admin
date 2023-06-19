<template>
  <section>
    <VcDialog
      :loading="loading"
      :visible="config.show"
      :title="config.title"
      width="700px"
      @update:visible="config.show = $event"
      @close="close"
      fullscreen
    >
      <VcForm ref="form" :model="form" :rules="rules" label-width="100px" inline>
        <el-form-item label="问题类型" prop="questionType">
          <el-select
            v-model="form.questionType"
            placeholder="请选择问题类型"
            @change="handleTypeChange"
            filterable
            allow-create
            default-first-option
            clearable
            :disabled="config.edit ? true : false"
          >
            <el-option
              v-for="item in getQuestionType"
              :key="item.code"
              :label="item.message"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属应用" prop="applicationCode">
          <el-select
            v-model="form.applicationCode"
            placeholder="请选择所属应用"
            @change="handleApplicationChange"
            filterable
            allow-create
            default-first-option
            clearable
            :disabled="config.edit ? true : false"
          >
            <el-option
              v-for="item in getApplicationSelect"
              :key="item.applicationCode"
              :label="item.appName"
              :value="item.applicationCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属菜单" prop="menuName">
          <el-cascader
            v-model="form.menuName"
            :options="menuList"
            placeholder="请选择所属菜单"
            :props="{
              label: 'name',
              value: 'name',
              children: 'children',
              checkStrictly: true,
              emitPath: false,
            }"
            @change="handleMenuChange"
            :show-all-levels="false"
            clearable
            :disabled="config.edit ? true : false"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="menuUrl">
          <template #label>
            <span>菜单地址</span>
          </template>
          <el-input v-model="form.menuUrl" :disabled="config.edit ? true : false"></el-input>
        </el-form-item>
        <el-form-item prop="questionTitle">
          <template #label>
            <span>问题标题</span>
            <el-tooltip content="填写规则：应用名称-业务功能名称-详情内容" placement="right">
              <el-icon style="margin-top: 8px">
                <Warning />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input
            v-model="form.questionTitle"
            placeholder="例：单据中心-到货交接单-交接单如何签署？"
            maxlength="100"
          ></el-input>
        </el-form-item>
        <el-form-item prop="uniqueCode">
          <template #label>
            <span>问题编码</span>
            <el-tooltip content="显示规则：问题类型-应用简称-序号" placement="right">
              <el-icon style="margin-top: 8px">
                <Warning />
              </el-icon>
            </el-tooltip>
          </template>
          <el-input v-model="form.uniqueCode" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="问题描述" prop="questionDescription">
          <el-input v-model="form.questionDescription" placeholder="请输入问题描述"></el-input>
        </el-form-item> -->
        <el-form-item label="解决方案" prop="solution" class="block">
          <section class="editor">
            <VcWangEditor ref="editor" v-model="form.solution" :uploadImage="uploadConfigToQA" />
          </section>
          <el-space class="update-body" v-if="form.updateTime">
            <span>创建于 {{ form.createTime }} {{ form.createById }}</span>
            <span>更新于 {{ form.updateTime }} {{ form.updateById }}</span>
          </el-space>
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
import { mapGetters } from 'vuex';
import xeUtils from 'xe-utils';
import DialogMixin from 'mixins/dialog';
import VcWangEditor from 'components/editor/WangEditor';
import {
  updateQuestion,
  addQuestion,
  updateFileManage,
  getAcquireCode,
} from 'api/sys/questionService';

export default {
  mixins: [DialogMixin],
  components: {
    VcWangEditor,
  },
  data() {
    // // 校验异常编码
    // var checkUniqueCode = (rule, value, callback) => {
    //   if (value) {
    //     let regs = /[A-Z]+[-]{1}[0-9]+$/;
    //     if (!regs.test(value)) {
    //       return callback(new Error('请输入正确的异常编码'));
    //     }
    //   }
    // };

    return {
      loading: false,
      menuList: [],
      rules: {
        questionType: [{ required: true, message: '类型不能为空', trigger: ['change', 'blur'] }],
        applicationCode: [{ required: true, message: '应用不能为空', trigger: ['change', 'blur'] }],
        // menuName: [{ required: true, message: '菜单不能为空', trigger: ['change', 'blur'] }],
        // uniqueCode: [{ required: true, message: '编码不能为空', trigger: ['change', 'blur'], validator: checkUniqueCode }],
        questionTitle: [{ required: true, message: '标题不能为空', trigger: ['change', 'blur'] }],
      },
      uploadConfigToQA: {
        apiObj: updateFileManage, //上传请求API对象
        filename: 'file', //form请求时文件的key
        successCode: 0, //请求完成代码
        maxSize: 10, //最大文件大小 默认10MB
        parseData: function (res) {
          const { url } = res.data;
          return {
            url: url, //分析图片远程地址结构
            alt: '',
            href: url,
          };
        },
      },
    };
  },
  computed: {
    ...mapGetters('cache', ['getQuestionType', 'getApplicationSelect']),
  },
  methods: {
    initLoadData() {
      const edit = this._get(this.config, 'edit', false);

      if (edit) {
        // 编辑时数据回显
        const { applicationCode, questionTitle, menuName, menuUrl } = this._get(
          this.config,
          'questionObj',
          false,
        );
        this.form = {
          applicationCode,
          questionTitle,
          menuName,
          menuUrl,
        };

        console.log('edit', this._get(this.config, 'questionObj', false));
        this.handleApplicationChange(applicationCode, false);
        this.handleMenuChange(menuName, false);
      }
    },
    /** =========== 基础事件 ========== */
    // 选择所属问题类型
    handleTypeChange(code, searchQuestion) {
      const { applicationCode } = this._get(this, 'form', {});
      if (applicationCode != '' && applicationCode != undefined) {
        const appList = [...this.getApplicationSelect];
        const item = xeUtils.find(appList, (item) => item.applicationCode === applicationCode);
        this.form.applicationName = item.appName;

        if (searchQuestion == undefined) {
          this.getQuestionCode();
        }
      } else {
        return this.$message.error('请选择应用');
      }
    },
    // 选择所属应用联动
    handleApplicationChange(code, searchQuestion) {
      const appList = [...this.getApplicationSelect];
      const item = xeUtils.find(appList, (item) => item.applicationCode === code);

      if (item) this.menuList = this._get(item, 'children', []);
      this.form.questionTitle = item.appName + '-';

      const { questionType } = this._get(this, 'form', {});
      if (!questionType) return this.$message.error('请选择类型');
      this.form.applicationName = item.appName;

      if (searchQuestion == undefined) {
        this.getQuestionCode();
      }
    },
    // 选中菜单联动数据
    handleMenuChange(name) {
      const tree = [...this.menuList];
      const itemTree = xeUtils.findTree(tree, (item) => item.name === name);
      if (!itemTree) return false;
      const item = itemTree.item;

      this._set(this.form, 'menuUrl', item.url);

      this.form.questionTitle = this.form.applicationName + '-' + item.name;
    },
    // 保存
    onSubmitOrSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.config.edit) this.updateQuestion();
          else this.addQuestion();
        } else this.$message.error('请输入正确的值');
      });
    },
    // 关闭弹窗
    close() {
      this.menuList = [];
    },

    /** =========== 接口请求 ========== */
    // 问题编码
    async getQuestionCode() {
      const { questionType, applicationCode, applicationName } = this._get(this, 'form', {});
      const params = {
        questionType,
        applicationCode,
        applicationName,
      };
      let [error, data] = await this._awaitWrap(getAcquireCode(params));
      if (error) return this.$message.error(error);
      console.log('code', data);
      this.form.uniqueCode = data.acquireCode;
    },

    // 新增问题
    async addQuestion() {
      const form = this._get(this, 'form', {});
      const params = {
        ...form,
      };
      console.log('add1', params);
      let [error] = await this._awaitWrap(addQuestion(params));
      if (error) return this.$message.error(error);
      this.$message.success('新增成功');
      this.config.show = false;
      this.menuList = [];
    },

    // 编辑问题
    async updateQuestion() {
      const {
        id,
        questionType,
        applicationCode,
        menuName,
        menuUrl,
        questionTitle,
        questionDescription,
        solution,
        uniqueCode,
      } = this._get(this, 'form', {});
      const params = {
        id,
        questionType,
        applicationCode,
        menuName,
        menuUrl,
        questionTitle,
        questionDescription,
        solution,
        uniqueCode,
      };
      console.log('edit1', params);
      let [error] = await this._awaitWrap(updateQuestion(params));
      if (error) return this.$message.error(error);
      this.$message.success('编辑成功');
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
.update-body {
  width: 100%;
  font-size: 12px;
  color: #999;
  justify-content: space-between;
}

.editor {
  width: 100%;
  height: 450px;
}

::v-deep {
  .el-form-item {
    width: calc(50% - 32px);
    margin-bottom: 25px !important;

    &.block {
      width: calc(100% - 32px);
    }
  }

  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
