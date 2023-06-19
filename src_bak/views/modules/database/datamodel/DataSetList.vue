<template>
  <div class="page">
    <SearchForm
      class="query-form"
      ref="searchForm"
      :form="searchForm"
      @search="refreshList"
      @reset="resetSearch"
    ></SearchForm>
    <div class="jp-table">
      <vxe-toolbar ref="dataSetToolbar" :refresh="{ query: refreshList }" export print custom>
        <template #buttons>
          <el-button
            v-if="_hasPermission('database:datamodel:dataSet:add')"
            type="primary"
            icon="DocumentAdd"
            @click="add()"
            >新建</el-button
          >
          <el-button
            v-if="_hasPermission('database:datamodel:dataSet:edit')"
            type="warning"
            icon="edit"
            @click="edit()"
            :disabled="$refs.dataSetTable && $refs.dataSetTable.getCheckboxRecords().length !== 1"
            plain
            >修改</el-button
          >
          <el-button
            v-if="_hasPermission('database:datamodel:dataSet:del')"
            type="danger"
            icon="delete"
            @click="del()"
            :disabled="$refs.dataSetTable && $refs.dataSetTable.getCheckboxRecords().length === 0"
            plain
            >删除
          </el-button>
        </template>
      </vxe-toolbar>
      <div class="jp-table-body">
        <vxe-table
          border
          auto-resize
          resizable
          height="auto"
          :loading="loading"
          size="small"
          ref="dataSetTable"
          show-header-overflow
          show-overflow
          highlight-hover-row
          :menu-config="{}"
          :print-config="{}"
          :import-config="{}"
          :export-config="{}"
          @sort-change="sortChangeHandle"
          :sort-config="{ remote: true }"
          :data="dataList"
          :checkbox-config="{}"
        >
          <vxe-column type="seq" width="40"></vxe-column>
          <vxe-column type="checkbox" width="40px"></vxe-column>
          <vxe-column field="name" sortable title="模型名称">
            <template #default="scope">
              <el-link
                type="primary"
                :underline="false"
                v-if="_hasPermission('database:datamodel:dataSet:edit')"
                @click="edit(scope.row.id)"
                >{{ scope.row.name }}</el-link
              >
              <el-link
                type="primary"
                :underline="false"
                v-else-if="_hasPermission('database:datamodel:dataSet:view')"
                @click="view(scope.row.id)"
                >{{ scope.row.name }}</el-link
              >
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </vxe-column>
          <vxe-column field="dataSource.name" sortable title="目标数据库">
            <template #default="scope">
              <p v-if="scope.row.dataSource.id === 'master'">本地数据库</p>
              <p v-else>
                {{ scope.row.dataSource.name }}
              </p>
            </template>
          </vxe-column>
          <vxe-column field="sqlCmd" sortable show-overflow-tooltip title="sql语句"> </vxe-column>
          <vxe-column fixed="right" width="300" title="操作">
            <template #default="scope">
              <el-button
                v-if="_hasPermission('database:datamodel:dataSet:view')"
                type="primary"
                text
                icon="view"
                size="small"
                @click="view(scope.row.id)"
                >查看</el-button
              >
              <el-button
                v-if="_hasPermission('database:datamodel:dataSet:edit')"
                type="primary"
                text
                icon="edit"
                size="small"
                @click="edit(scope.row.id)"
                >修改</el-button
              >
              <el-button
                type="primary"
                text
                size="small"
                icon="coin"
                @click="getDbInterface(scope.row.id)"
                >获取数据接口</el-button
              >
              <el-button
                type="danger"
                v-if="_hasPermission('database:datamodel:dataSet:del')"
                text
                size="small"
                icon="delete"
                @click="del(scope.row.id)"
                >删除</el-button
              >
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
    <v-dialog title="数据接口" :close-on-click-modal="false" v-model="dialogInterfaceVisible">
      <el-table :data="interfaceTable">
        <el-table-column property="type" width="120px" title="接口格式"></el-table-column>
        <el-table-column property="url" title="接口地址"></el-table-column>
        <el-table-column width="40px">
          <template #default="scope">
            <el-button
              text
              icon="copy-document"
              v-copy="scope.row.url"
              style="padding-left: 10px"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        type="success"
        title="接口传递参数说明：/接口url?参数名=参数值, 如果不传递参数，则使用默认值"
        style="margin-top: 20px"
      ></el-alert>
    </v-dialog>
  </div>
</template>

<script>
import dataSetService from '@/api/database/dataSetService';
import SearchForm from './searchForm';
export default {
  data() {
    return {
      searchForm: {
        db: {
          id: '',
          name: '',
        },
        name: '',
      },
      dataList: [],
      tablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        orders: [],
      },
      isImportCollapse: false,
      dialogInterfaceVisible: false,
      interfaceTable: [],
      loading: false,
    };
  },
  components: {
    SearchForm,
  },
  activated() {
    this.$nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = this.$refs.dataSetTable;
      const $toolbar = this.$refs.dataSetToolbar;
      $table.connect($toolbar);
    });
    this.refreshList();
  },
  methods: {
    // 获取数据列表
    refreshList() {
      this.loading = true;
      dataSetService
        .list({
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
    // 排序
    sortChangeHandle(column) {
      this.tablePage.orders = [];
      if (column.order != null) {
        this.tablePage.orders.push({
          column: this.$utils.toLine(column.property),
          asc: column.order === 'asc',
        });
      }
      this.refreshList();
    },
    // 新增
    add() {
      this.$router.push('/database/datamodel/DataSetForm');
    },
    // 修改
    edit(id) {
      id =
        id ||
        this.$refs.dataSetTable.getCheckboxRecords().map((item) => {
          return item.id;
        })[0];
      this.$router.push({
        path: `/database/datamodel/DataSetForm`,
        query: { id: id, title: '数据模型配置' },
      });
    },
    // 查看
    view(id) {
      id =
        id ||
        this.$refs.dataSetTable.getCheckboxRecords().map((item) => {
          return item.id;
        })[0];
      this.$router.push({
        path: `/database/datamodel/DataSetForm`,
        query: { method: 'view', id: id, title: '数据模型配置' },
      });
    },
    // 删除
    del(id) {
      let ids =
        id ||
        this.$refs.dataSetTable
          .getCheckboxRecords()
          .map((item) => {
            return item.id;
          })
          .join(',');
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true;
        dataSetService.delete(ids).then((data) => {
          this.$message.success(data);
          this.loading = false;
          this.refreshList();
        });
      });
    },
    // 获取数据接口
    getDbInterface(id) {
      this.dialogInterfaceVisible = true;
      this.interfaceTable = [];
      this.interfaceTable.push({
        type: 'JSON',
        url: `/database/datamodel/dataSet/getData/${id}/json`,
      });
      this.interfaceTable.push({
        type: 'XML',
        url: `/database/datamodel/dataSet/getData/${id}/xml`,
      });
      this.interfaceTable.push({
        type: 'TABLE',
        url: `/database/datamodel/dataSet/getData/${id}/html`,
      });
    },
    resetSearch() {
      this.$refs.searchForm.reset();
      this.refreshList();
    },
  },
};
</script>
