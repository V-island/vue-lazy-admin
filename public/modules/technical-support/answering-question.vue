<template>
  <div class="row-border">
    <el-dialog
      title="答疑问答"
      :visible.sync="$store.state.common.dialogVisi"
      width="60%"
      :before-close="handleClose"
    >
      <div style="width: 100%; border-top: 1px solid #dddddd" class="title"></div>
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="问题描述" prop="desc">
          <el-input type="textarea" v-model="form.desc" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="问题类型" prop="region">
          <el-select v-model="form.region" placeholder="请选择问题类型">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-select v-model="form.region" placeholder="请选择问题类型" class="select">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题页面" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="问题截图">
          <el-button icon="el-icon-picture" style="border: 1px solid #dcdfe6">上传图片</el-button>
          <span class="span">可通过截图保存，截图后上传，最大10MB。</span>
        </el-form-item>
        <el-form-item label="问题发生时间" prop="date1">
          <el-col :span="7">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.date1"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">
            <span class="col-span">-</span>
          </el-col>
          <el-col :span="7">
            <el-time-picker
              placeholder="选择时间"
              v-model="form.date2"
              style="width: 100%"
            ></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="反馈人电话" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="反馈人企讯号" prop="number">
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item label="反馈人邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">提 交</el-button>
        <el-button @click="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'answering-question',
  data() {
    return {
      dialogVisi: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        desc: '',
        phone: '',
        number: '',
        email: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入问题页面', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        region: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
        phone: [{ required: true, message: '请输入反馈人电话', trigger: 'blur' }],
        number: [{ required: true, message: '请输入反馈人企讯号', trigger: 'blur' }],
        email: [{ required: true, message: '请输入反馈人邮箱', trigger: 'blur' }],
        date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
        desc: [{ required: true, message: '请填写问题描述', trigger: 'blur' }],
      },
    };
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    // refs 调用
    btnOk() {
      this.$store.commit('common/SET_DIALOG_VISI', true);
    },
    // 叉号
    handleClose() {
      this.$store.commit('common/SET_DIALOG_VISI', false);
    },
    // 提交按钮
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 取消按钮
    btnCancel() {
      this.$store.commit('common/SET_DIALOG_VISI', false);
    },
  },
};
</script>

<style scoped lang="scss">
.row-border {
  &::v-deep .el-dialog {
    border-radius: 10px;
    .el-dialog__body {
      padding-top: 10px;
      .title {
        margin-bottom: 10px;
        .el-descriptions__table {
          margin-top: 20px;
        }
      }
      .el-button {
        border: 0;
      }
      .select {
        margin-left: 25px;
      }
      .span {
        margin-left: 15px;
        color: #aaaaaa;
      }
      .col-span {
        margin-left: 15px;
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
  }
}
</style>