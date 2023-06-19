<template>
    <div class="page">
      <el-form :inline="true" class="query-form m-b-10" ref="searchForm" :model="searchForm" @keyup.enter="refreshList()" @submit.prevent>
            <!-- 搜索框-->
         <el-form-item prop="student.id">
            <GridSelect
                    title="选择学生"
                    placeholder="请选择学生"
                    labelName = 'name'
                    labelValue = 'id'
                    v-model = "searchForm.student.id"
                    :limit="1"
                    :columns="[
                    {
                      prop: 'name',
                      label: '姓名'
                    }
                    ]"
                    :searchs="[
                    {
                      prop: 'name',
                      label: '姓名'
                    }
                    ]"
                    :api="testStudentService">
                  </GridSelect>
         </el-form-item>
         <el-form-item prop="course.id">
            <GridSelect
                    title="选择课程"
                    placeholder="请选择课程"
                    labelName = 'name'
                    labelValue = 'id'
                    v-model = "searchForm.course.id"
                    :limit="1"
                    :columns="[
                    {
                      prop: 'name',
                      label: '课程名'
                    }
                    ]"
                    :searchs="[
                    {
                      prop: 'name',
                      label: '课程名'
                    }
                    ]"
                    :api="testCourseService">
                  </GridSelect>
         </el-form-item>
         <el-form-item prop="score">
                <el-input v-model="searchForm.score" placeholder="分数" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" icon="search">查询</el-button>
            <el-button @click="resetSearch()" icon="refresh-right">重置</el-button>
          </el-form-item>
      </el-form>

      <div class="jp-table">
        <vxe-toolbar ref="testStudentCourseToolbar" :refresh="{query: refreshList}" export print custom>
          <template #buttons>
            <el-button v-if="hasPermission('test:manytomany:testStudentCourse:add')" type="primary"  icon="plus" @click="add()">新建</el-button>
            <el-button v-if="hasPermission('test:manytomany:testStudentCourse:edit')" type="warning" icon="edit" @click="edit()" :disabled="$refs.testStudentCourseTable && $refs.testStudentCourseTable.getCheckboxRecords().length !== 1" plain>修改</el-button>
            <el-button v-if="hasPermission('test:manytomany:testStudentCourse:del')" type="danger"   icon="delete" @click="del()" :disabled="$refs.testStudentCourseTable && $refs.testStudentCourseTable.getCheckboxRecords().length === 0" plain>删除</el-button>
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
            ref="testStudentCourseTable"
            show-header-overflow
            show-overflow
            highlight-hover-row
            :menu-config="{}"
            :print-config="{}"
            :import-config="{}"
            :export-config="{}"
            @sort-change="sortChangeHandle"
            :sort-config="{remote:true}"
            :data="dataList"
            :checkbox-config="{}">
            <vxe-column type="seq" width="40"></vxe-column>
            <vxe-column type="checkbox"  width="40px"></vxe-column>
      <vxe-column
        field="student.name"
        sortable
        title="学生">
            <template #default="{ row }">
              <el-link  type="primary" :underline="false" v-if="hasPermission('test:manytomany:testStudentCourse:edit')" @click="edit(row.id)">{{row.student && row.student.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('test:manytomany:testStudentCourse:view')"  @click="view(row.id)">{{row.student &&  row.student.name}}</el-link>
              <span v-else>{{row.student && row.student.name}}</span>
            </template>
      </vxe-column>
      <vxe-column
        field="course.name"
        sortable
        title="课程">
            <template #default="{ row }">
                {{row.course && row.course.name}}
            </template>
      </vxe-column>
    <vxe-column
        field="score"
        sortable
        title="分数">
      </vxe-column>
    <vxe-column
        field="remarks"
        sortable
        title="备注信息">
      </vxe-column>
      <vxe-column
        fixed="right"
        align="center"
        width="200"
        title="操作">
        <template   #default="{ row }">
          <el-button v-if="hasPermission('test:manytomany:testStudentCourse:view')" type="primary" text icon="view" size="small" @click="view(row.id)">查看</el-button>
          <el-button v-if="hasPermission('test:manytomany:testStudentCourse:edit')" type="primary" text icon="edit" size="small" @click="edit(row.id)">修改</el-button>
          <el-button v-if="hasPermission('test:manytomany:testStudentCourse:del')"  type="danger"  text icon="delete" size="small" @click="del(row.id)">删除</el-button>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      background
      size="small"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :total="tablePage.total"
      :page-sizes="[10, 20, 100, 1000, {label: '全量数据', value: 1000000}]"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="currentChangeHandle">
    </vxe-pager>
    </div>
    </div>
        <!-- 弹窗, 新增 / 修改 -->
    <TestStudentCourseForm  ref="testStudentCourseForm" @refreshDataList="refreshList"></TestStudentCourseForm>
  </div>
</template>

<script>
  import TestStudentCourseForm from './TestStudentCourseForm'
  import testStudentCourseService from '@/api/test/manytomany/testStudentCourseService'
  import GridSelect from '@/components/gridSelect'
  import testStudentService from '@/api/test/manytomany/testStudentService'   
  import testCourseService from '@/api/test/manytomany/testCourseService'   
  export default {
    data () {
      return {
        searchForm: {
          student: {
            id: ''
          },
          course: {
            id: ''
          },
          score: ''
        },
        testStudentService: testStudentService,  
        testCourseService: testCourseService,  
        dataList: [],
        tablePage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          orders: []
        },
        loading: false
      }
    },
    components: {
      GridSelect,
      TestStudentCourseForm
    },    
    mounted () {
      this.$nextTick(() => {
        // 将表格和工具栏进行关联
        const $table = this.$refs.testStudentCourseTable
        const $toolbar = this.$refs.testStudentCourseToolbar
        $table.connect($toolbar)
      })
    }, 
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        testStudentCourseService.list({
          'current': this.tablePage.currentPage,
          'size': this.tablePage.pageSize,
          'orders': this.tablePage.orders,
          ...this.searchForm
        }).then((data) => {
          this.dataList = data.records
          this.tablePage.total = data.total
          this.loading = false
        })
      },
      // 当前页
      currentChangeHandle ({ currentPage, pageSize }) {
        this.tablePage.currentPage = currentPage
        this.tablePage.pageSize = pageSize
        this.refreshList()
      },
      // 排序
      sortChangeHandle (column) {
        this.tablePage.orders = []
        if (column.order != null) {
          this.tablePage.orders.push({column: this.$utils.toLine(column.property), asc: column.order === 'asc'})
        }
        this.refreshList()
      },
      // 新增
      add () {
        this.$refs.testStudentCourseForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.$refs.testStudentCourseTable.getCheckboxRecords().map(item => {
          return item.id
        })[0]
        this.$refs.testStudentCourseForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.testStudentCourseForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.$refs.testStudentCourseTable.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          testStudentCourseService.delete(ids).then((data) => {
            this.$message.success(data)
            this.refreshList()
            this.loading = false
          })
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>

