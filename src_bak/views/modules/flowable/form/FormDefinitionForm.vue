<template>
<div>
  <v-dialog
    :title="title"
    :close-on-click-modal="false"
    v-model="visible">
    <el-form  :model="inputForm" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"
             label-width="120px">
      <el-row  :gutter="15">
        <el-col :span="24">
            <el-form-item label="分类" prop="category.id"
                :rules="[
                  {required: true, message:'分类不能为空', trigger:'blur'}
                 ]">
             <el-tree-select      
                ref="category"
                value-key="id" 
                :props="{
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
                :data="formCategoryTreeData"
                v-model="inputForm.category.id"
                check-strictly 
                style="width:100%"
                :clearable="true" 
                :accordion="true" />      
           </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="表单名称" prop="name"
                :rules="[
                  {required: true, message:'表单名称不能为空', trigger:'blur'}
                 ]">
              <el-input v-model="inputForm.name" placeholder="请填写表单名称"     ></el-input>
           </el-form-item>
        </el-col>
        </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="visible = false" icon="circle-close">关闭</el-button>
        <el-button  type="primary" v-if="method != 'view'" @click="doSubmit()" icon="circle-check" v-noMoreClick>确定</el-button>
      </span>
    </template>
  </v-dialog>
</div>
</template>

<script>
  import formCategoryService from '@/api/flowable/formCategoryService'
  import formDefinitionService from '@/api/flowable/formDefinitionService'
  export default {
    data () {
      return {
        title: '',
        method: '',
        visible: false,
        loading: false,
        formCategoryTreeData: [],
        inputForm: {
          id: '',
          category: {
            id: ''
          },
          name: ''
        }
      }
    },
    created () {
      formCategoryService.treeData().then((data) => {
        this.formCategoryTreeData = data
      })
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = `新建流程表单`
        } else if (method === 'edit') {
          this.title = '修改流程表单'
        } else if (method === 'view') {
          this.title = '查看流程表单'
        }
        this.visible = true
        this.loading = false
        this.$nextTick(() => {
          this.$refs.inputForm.resetFields()
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.loading = true
            formDefinitionService.queryById(this.inputForm.id).then((data) => {
              this.inputForm = this.recover(this.inputForm, data)
              this.loading = false
            })
          }
        })
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            formDefinitionService.save(this.inputForm).then((data) => {
              this.loading = false
              this.visible = false
              this.$message.success(data.msg)
              if (this.method === 'add') {
                this.$emit('showDesignForm', data.id)
              }
              this.$emit('refreshDataList')
            })
          }
        })
      }
    }
  }
</script>