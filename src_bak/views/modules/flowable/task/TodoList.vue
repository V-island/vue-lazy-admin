<template>
  <div class="page">
    <el-form
      :inline="true"
      size="default"
      class="query-form m-b-10"
      ref="searchForm"
      :model="searchForm"
      @keyup.enter="refreshList()"
      @submit.prevent
    >
      <el-form-item label="创建时间" prop="searchDates">
        <el-date-picker
          v-model="searchDates"
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          :shortcuts="shortcuts"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" icon="search">查询</el-button>
        <el-button @click="resetSearch()" icon="refresh-right">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="jp-table">
      <vxe-toolbar
        ref="todoToolbar"
        :refresh="{ query: refreshList }"
        export
        print
        custom
      ></vxe-toolbar>
      <div class="jp-table-body">
        <vxe-table
          border
          auto-resize
          resizable
          height="auto"
          :loading="loading"
          size="small"
          ref="todoTable"
          show-header-overflow
          show-overflow
          highlight-hover-row
          :menu-config="{}"
          :print-config="{}"
          :import-config="{}"
          :export-config="{}"
          :data="dataList"
          :checkbox-config="{}"
        >
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column type="checkbox" width="40px"></vxe-column>
          <vxe-column title="实例标题" field="vars.title">
            <template #default="scope">
              <!-- <el-link
                type="primary"
                :underline="false"
                v-if="scope.row.status === 'todo'"
                @click="todo(scope.row)"
                >{{ scope.row.vars.title }}</el-link
              >
              <span v-else>{{ scope.row.vars.title }}</span> -->
              <el-link type="primary" :href="scope.row.outTableUrl" target="_blank" v-if="scope.row.status === 'todo'">{{ scope.row.vars.title }}</el-link>
              <span v-else>{{ scope.row.vars.title }}</span> 
            </template>
          </vxe-column>
          <vxe-column title="流程名称" field="processDefinitionName"> </vxe-column>
          <vxe-column title="当前环节" field="task.name">
            <template #default="scope">
              <el-tag>{{ scope.row.task.name }}</el-tag>
            </template>
          </vxe-column>
          <vxe-column title="流程发起人" field="vars.userName"></vxe-column>
          <vxe-column field="task.createTime" title="创建时间"> </vxe-column>
          <vxe-column title="操作" width="200px" fixed="right" align="center">
            <template #default="scope">
              <!-- <el-button type="primary" text size="small" @click="todo(scope.row)">办理</el-button> -->
              <el-button type="primary" text size="small">
                <el-link type="primary" :href="scope.row.outTableUrl" target="_blank" v-if="scope.row.status === 'todo'">办理</el-link>
                <span v-else>办理</span> 
              </el-button>
              <el-button type="primary" text size="small" @click="trace(scope.row)">进度</el-button>
            </template>
          </vxe-column>
        </vxe-table>
        <vxe-pager
          background
          size="small"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="tablePage.total"
          :page-sizes="[10, 20, 100, 1000, { label: '全量数据', value: 1000000 }]"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="currentChangeHandle"
        >
        </vxe-pager>
      </div>
    </div>
    <v-dialog
      title="查看进度"
      :close-on-click-modal="true"
      v-model="visible"
      width="70%"
      height="600px"
    >
      <flow-chart ref="preview" :processInstanceId="processInstanceId"></flow-chart>
    </v-dialog>
    <user-select ref="userSelect" :limit="1" @doSubmit="selectUsersToTransferTask"></user-select>
  </div>
</template>

<script>
// import FlowChart from '../modeler/FlowChart'
import pick from 'lodash.pick';
import UserSelect from '@/components/userSelect/UserSelectDialog';
import taskService from '@/api/flowable/taskService';
export default {
  data() {
    return {
      searchForm: {
        beginDate: '',
        endDate: '',
      },
      searchDates: '',
      dataList: [],
      tablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        orders: [],
      },
      loading: false,
      visible: false,
      currentTask: null,
      processInstanceId: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
  activated() {
    this.$nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = this.$refs.todoTable;
      const $toolbar = this.$refs.todoToolbar;
      $table.connect($toolbar);
    });
    this.refreshList();
  },
  components: {
    UserSelect,
    // FlowChart
  },
  watch: {
    searchDates() {
      if (this.searchDates) {
        this.searchForm.beginDate = this.searchDates[0];
        this.searchForm.endDate = this.searchDates[1];
      } else {
        this.searchForm.beginDate = '';
        this.searchForm.endDate = '';
      }
    },
  },
  methods: {
    // 获取数据列表
    refreshList() {
      this.loading = true;
      taskService
        .todoList({
          current: this.tablePage.currentPage,
          size: this.tablePage.pageSize,
          orders: this.tablePage.orders,
          ...this.searchForm,
        })
        .then((data) => {
          this.dataList = data.records;
          this.tablePage.total = data.total;
          this.loading = false;
        });
    },
    // 当前页
    currentChangeHandle({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.refreshList();
    },
    todo(row) {
      taskService
        .getTaskDef({
          taskId: row.task.id,
          taskName: row.task.name,
          taskDefKey: row.task.taskDefinitionKey,
          procInsId: row.task.processInstanceId,
          procDefId: row.task.processDefinitionId,
          procDefKey: row.task.processDefKey,
          status: row.status,
        })
        .then((data) => {
          this.$router.push({
            path: '/flowable/task/TaskForm',
            query: {
              formTitle: `${row.vars.title}`,
              title: `审批【${row.task.name || ''}】`,
              ...pick(
                data,
                'formType',
                'formReadOnly',
                'formUrl',
                'procDefKey',
                'taskDefKey',
                'procInsId',
                'procDefId',
                'taskId',
                'status',
                'title',
                'businessId',
              ),
            },
          });
        });
    },
    trace(row) {
      this.processInstanceId = row.task.processInstanceId;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.preview.init();
      });
    },
    transferTask(row) {
      this.currentTask = row.task;
      this.$refs.userSelect.init();
    },
    selectUsersToTransferTask(user) {
      taskService.delegate(this.currentTask.id, user[0].id).then((data) => {
        this.$message.success(data);
        this.refreshList();
      });
    },
    resetSearch() {
      this.searchDates = '';
      this.$refs.searchForm.resetFields();
      this.$nextTick(() => {
        this.refreshList();
      });
    },
  },
};
</script>
