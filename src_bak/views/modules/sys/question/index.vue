<template>
  <section>
    <div class="page m-r-0">
      <SearchForm
        class="query-form"
        ref="searchForm"
        :form="searchForm"
        @search="onSearch"
        @reset="onReset"
      ></SearchForm>
      <div class="jp-table">
        <vxe-toolbar>
          <template #buttons>
            <el-button type="primary" @click="handleAddEvent">新增</el-button>
            <el-button type="primary" @click="handleBatchDel">批量删除</el-button>
          </template>
        </vxe-toolbar>
        <vxe-table
          height="480"
          ref="table"
          :data="tableData"
          :loading="loading"
          :menu-config="{}"
          :print-config="{}"
          :import-config="{}"
          :export-config="{}"
          :checkbox-config="{}"
          @radio-change="radioChangeEvent"
          @checkbox-change="selectChangeEvent"
          @checkbox-all="selectAllEvent"
          show-header-overflow
          show-overflow
          highlight-hover-row
          border
          auto-resize
          resizable
        >
          <vxe-column type="seq" header-align="center" align="center" width="50"> </vxe-column>
          <vxe-column type="checkbox" width="50"></vxe-column>
          <vxe-column field="questionTypeName" sortable title="问题类型"></vxe-column>
          <vxe-column field="uniqueCode" sortable title="问题编码"></vxe-column>
          <vxe-column field="applicationName" sortable title="应用名称"></vxe-column>
          <vxe-column field="menuName" sortable title="菜单名称"></vxe-column>
          <vxe-column field="menuUrl" sortable title="菜单地址"></vxe-column>
          <vxe-column field="questionTitle" sortable title="问题标题"></vxe-column>
          <!-- <vxe-column field="questionDescription" sortable title="问题描述"></vxe-column> -->
          <!-- <vxe-column field="solution" sortable title="解决方案"></vxe-column> -->
          <vxe-column title="操作" width="220px" fixed="right" align="center">
            <template #default="{ row }">
              <el-button type="primary" text @click="handleEditEvent(row)">编辑</el-button>
              <el-button type="primary" text @click="handleDelEvent(row)">删除</el-button>
              <el-button type="primary" text @click="handleLogsEvent(row)">记录</el-button>
            </template>
          </vxe-column>
        </vxe-table>
        <vxe-pager
          background
          :current-page="searchForm.pageNumber"
          :page-size="searchForm.pageSize"
          :total="total"
          :page-sizes="[10, 20, 100, 1000, { label: '全量数据', value: 1000000 }]"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handleCurrentChange"
        >
        </vxe-pager>
      </div>
    </div>
    <!-- 问答 -->
    <QuestionDialog :config="questionConfig" :form="questionObj" />
    <!-- 历史更新记录 -->
    <LogsDialog :config="logsConfig" />
  </section>
</template>

<script>
import { getResult } from 'utils';
import { getQuestionList, deleteQuestion } from 'api/sys/questionService';
import SearchForm from './searchForm';
import QuestionDialog from './QuestionDialog';
import LogsDialog from './LogsDialog';

export default {
  components: {
    SearchForm,
    QuestionDialog,
    LogsDialog,
  },
  data() {
    return {
      searchForm: {
        type: '',
        questionType: '',
        uniqueCode: '',
        applicationName: '',
        menuName: '',
        menuUrl: '',
        questionTitle: '',
        pageNumber: 1,
        pageSize: 10,
      },
      loading: false,
      total: 0,
      tableData: [],
      // 问答
      questionConfig: {
        title: '问答',
        show: false,
        edit: false,
      },
      questionObj: {},
      // 历史
      logsConfig: {
        title: '历史更新记录',
        show: false,
        params: {},
      },
      selectList: [],
    };
  },
  mounted() {
    this.initLoadData();
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.loading = true;
      this.selectList = [];
      // 获取问答列表
      let [err, data] = await this._awaitWrap(this.getAllData());
      this.loading = false;
      if (err || !data.result) return this.$message.error(err || data.message);
    },
    /** =========== 基础事件 ========== */
    // 搜索
    onSearch() {
      this.searchForm.pageNumber = 1;
      this.initLoadData();
    },
    // 重置
    onReset() {
      this.$refs.searchForm.resetFields();
      this.initLoadData();
    },
    // 分页事件
    handleCurrentChange({ currentPage, pageSize }) {
      this.searchForm.pageNumber = currentPage;
      this.searchForm.pageSize = pageSize;
      this.initLoadData();
    },
    // 新增问答
    handleAddEvent() {
      this.questionConfig.show = true;
      this.questionConfig.title = '新增问答';
      this.questionConfig.edit = false;
      this.questionObj = {
        questionType: '',
        applicationName: '',
        menuName: '',
        menuUrl: '',
        questionTitle: '',
        questionDescription: '',
        solution: '',
        uniqueCode: '',
      };
    },
    // 编辑问答
    handleEditEvent(row) {
      this.questionConfig.show = true;
      this.questionConfig.title = '编辑问答';
      this.questionConfig.edit = true;
      this.questionObj = row;
    },
    // 查看历史
    handleLogsEvent({ id }) {
      this.logsConfig.show = true;
      this.logsConfig.title = '查看更新记录';
      this.logsConfig.params = {
        id,
        pageNumber: this.searchForm.pageNumber,
        pageSize: this.searchForm.pageSize,
      };
    },
    // 删除
    async handleDelEvent({ id }) {
      let [warning] = await this._awaitWrap(
        this.$confirm('确定删除该条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }),
      );
      if (warning) return this.$message.info('已取消删除');

      const params = {
        id,
      };
      this.deleteQuestion(params)
    },
    // 多选事件
    selectChangeEvent() {
      const selectList = this.$refs.table.getCheckboxRecords();
      this.selectList = selectList;
    },
    // 全选事件
    selectAllEvent(checked) {
      const selectList = checked.records;
      this.selectList = selectList;
    },
    // 批量删除
    async handleBatchDel() {
      let [warning] = await this._awaitWrap(
        this.$confirm('确定批量删除数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }),
      );
      if (warning) return this.$message.info('已取消删除');

      const ids = this.selectList.map((item) => item.id);
      const params = {
        ids,
      };
      this.deleteQuestion(params)
    },
    /** =========== 接口请求 ========== */
    // 删除数据
    async deleteQuestion(params) {
      this._showPageLoading();
      let [error] = await this._awaitWrap(deleteQuestion(params));
      this._hidePageLoading();
      if (error) return this.$message.error(error);

      this.$message.success('删除成功');
      this.initLoadData();
    },
    // 获取问答列表
    async getAllData() {
      const searchForm = this._get(this, 'searchForm', {});
      const params = {
        ...searchForm,
      };

      // 获取问答列表
      let [error, List] = await this._awaitWrap(getQuestionList(params));
      if (error) return Promise.resolve(getResult(false, error));

      const table = List || [];
      this.tableData = this._get(table, 'records');
      this.total = this._toInteger(this._get(table, 'total'));

      return Promise.resolve(getResult(true, '问答初始化完成'));
    },
  },
  watch: {
    'questionConfig.show': {
      handler(_new, _old) {
        if (_new != _old && !_new) this.initLoadData();
      },
    },
    'logsConfig.show': {
      handler(_new, _old) {
        if (_new != _old && !_new) this.initLoadData();
      },
    },
  },
};
</script>
