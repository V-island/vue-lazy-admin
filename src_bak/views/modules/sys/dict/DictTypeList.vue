<template>
  <section style="height: 100%">
    <splitpanes class="default-theme">
      <pane class="page m-r-0" :size="leftPane">
        <SearchForm
          class="query-form"
          ref="searchForm"
          :form="searchForm"
          @search="refreshList"
          @reset="resetSearch"
        ></SearchForm>
        <div class="jp-table">
          <vxe-toolbar ref="dictToolbar" :refresh="{ query: refreshList }" export print custom>
            <template #buttons>
              <el-button
                v-if="_hasPermission('sys:dict:add')"
                type="primary"
                icon="DocumentAdd"
                @click="add()"
                >新建</el-button
              >
              <el-button
                v-if="_hasPermission('sys:dict:del')"
                type="danger"
                icon="delete"
                @click="del()"
                :disabled="$refs.dictTable && $refs.dictTable.getCheckboxRecords().length === 0"
                plain
                >删除</el-button
              >
            </template>
          </vxe-toolbar>
          <div class="jp-table-body">
            <vxe-table
              border
              auto-resize
              resizable
              height="auto"
              :row-config="{ isCurrent: true, isHover: true }"
              @current-change="showDetail"
              :loading="loading"
              ref="dictTable"
              @sort-change="sortChangeHandle"
              :sort-config="{ remote: true }"
              :data="dataList"
            >
              <vxe-column type="seq" width="40"></vxe-column>
              <vxe-column type="checkbox" width="40px"></vxe-column>
              <vxe-column title="类型" field="type" sortable>
                <template #default="{ row }">
                  <el-link type="primary" :underline="false">{{ row.type }}</el-link>
                </template>
              </vxe-column>
              <vxe-column title="描述" field="remarks" sortable></vxe-column>
            </vxe-table>
            <vxe-pager
              background
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
      </pane>
      <pane class="page m-l-0" :size="rightPane">
        <el-card shadow="never" style="border: none">
          <template #header>
            <div class="card-header">
              <span> {{ dictTypeTitle }}</span>
              <el-button icon="back" @click="closeDetail" text>关闭</el-button>
            </div>
            <el-divider style="margin-top: 5px; margin-bottom: 0px" />
          </template>

          <el-tabs v-model="cardIndex">
            <el-tab-pane label="基本信息" name="first">
              <!-- 弹窗, 新增 / 修改 -->
              <dict-type-form
                ref="dictTypeForm"
                @delTypeById="del"
                @getTypeTitle="getTypeTitle"
                @getDictTypeId="getDictTypeId"
                @refreshDataList="refreshList"
              ></dict-type-form>
            </el-tab-pane>
            <el-tab-pane v-if="dictTypeId" label="数据字典值列表" name="second">
              <dict-value-list ref="dictValueList" :dict-type-id="dictTypeId"></dict-value-list>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </pane>
    </splitpanes>
  </section>
</template>

<script>
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import DictTypeForm from './DictTypeForm';
import DictValueList from './DictValueList';
import SearchForm from './searchForm';
import dictService from '@/api/sys/dictService';
export default {
  data() {
    return {
      searchForm: {
        type: '',
      },
      dataList: [],
      cardIndex: 'first',
      leftPane: 100,
      rightPane: 0,
      tablePage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        orders: [],
      },
      dictTypeId: '',
      dictTypeTitle: '',
      loading: false,
    };
  },
  components: {
    DictTypeForm,
    DictValueList,
    Splitpanes,
    Pane,
    SearchForm,
  },
  mounted() {
    this.$nextTick(() => {
      // 将表格和工具栏进行关联
      const $table = this.$refs.dictTable;
      const $toolbar = this.$refs.dictToolbar;
      $table.connect($toolbar);
    });
    this.refreshList();
  },
  methods: {
    // 获取数据列表
    refreshList() {
      this.loading = true;
      dictService
        .list({
          current: this.tablePage.currentPage,
          size: this.tablePage.pageSize,
          orders: this.tablePage.orders,
          ...this.searchForm,
        })
        .then((data) => {
          this.dataList = data.records;
          this.tablePage.total = data.total;
          this.tablePage.currentPage = data.current;
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
        this.tablePage.orders.push({ column: column.property, asc: column.order === 'asc' });
      } else {
        this.tablePage.orders.push({ column: 'create_time', asc: false });
      }
      this.refreshList();
    },
    showDetail({ row }) {
      this.dictTypeId = row.id;
      this.leftPane = 50;
      this.rightPane = 50;
      this.edit(row.id);
    },
    closeDetail() {
      this.leftPane = 100;
      this.rightPane = 0;
    },
    getDictTypeId(dictTypeId) {
      this.dictTypeId = dictTypeId;
    },
    getTypeTitle(typeTitle) {
      this.dictTypeTitle = typeTitle;
    },
    // 新增
    add() {
      this.dictTypeId = null;
      this.leftPane = 50;
      this.rightPane = 50;
      this.cardIndex = 'first';
      this.$refs.dictTypeForm.init('');
    },

    // 修改
    edit(id) {
      this.$refs.dictTypeForm.init(id);
    },
    // 删除
    del(id) {
      let ids =
        id ||
        this.$refs.dictTable
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
        dictService.delete(ids).then((data) => {
          this.$message.success(data);
          if ((',' + ids + ',').indexOf(',' + this.dictTypeId + ',') >= 0) {
            this.closeDetail();
          }
          this.refreshList();
          this.$dictUtils.refreshDictList();
        });
      });
    },
    resetSearch() {
      this.$refs.searchForm.reset();
      this.refreshList();
    },
  },
};
</script>
<style lang="scss" scoped>
.default-theme.splitpanes--vertical > .splitpanes__splitter,
.default-theme .splitpanes--vertical > .splitpanes__splitter {
  width: 7px;
  border-left: none;
  margin-left: -1px;
}

.page .jp-table {
  height: calc(100% - 75px);
}
.splitpanes.default-theme .splitpanes__pane.page {
  // .top{
  //   border: none;
  //   height: 100%;
  // }
  // .body {
  //     height: calc(100% - 160px);
  // }
  border: 1px solid #ebeef5;
  background-color: #fff !important;
  transition: 0.3s;
  border-radius: 4px;
  overflow: hidden;
  // padding: 10px;
  height: 100%;
}
</style>
