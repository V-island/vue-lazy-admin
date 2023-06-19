<template>
  <section>
    <el-button
      v-if="disabled"
      type="primary"
      @click="disabledPrompt"
      class="btn-disabled"
      :disabled="trigDisabled"
    >
      <el-icon class="el-icon--left"><el-icon-upload /></el-icon>{{ trigger }}
    </el-button>
    <el-upload
      v-else
      class="upload"
      :ref="refs"
      :action="actionUrl"
      :data="data"
      :accept="accept"
      :file-list="fileList"
      :multiple="multiple"
      :show-file-list="false"
      :auto-upload="false"
      :disabled="trigDisabled"
      :limit="limit"
      :httpRequest="httpRequest"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :on-exceed="handleExceed"
      :headers="headers"
    >
      <template #trigger>
        <el-button type="primary" :disabled="trigDisabled"
          ><el-icon class="el-icon--left"><el-icon-upload /></el-icon>{{ trigger }}</el-button
        ></template
      >
      <template #tip>
        <div class="el-upload__tip">{{ tip }}</div></template
      >
    </el-upload>
    <el-table
      :data="fileList"
      :pagination="false"
      :indexShow="false"
      :header-cell-style="{
        'text-align': 'center',
        background: '#E1F2F2',
        color: '#333333',
      }"
      border
    >
      <el-table-column prop="name" label="文件" fixed></el-table-column>
      <el-table-column prop="status" label="状态" width="230" align="center" fixed>
        <template #default="scope">
          <el-tag v-if="scope.row.status == 'ready'">等待上传</el-tag>
          <el-tag v-else-if="scope.row.status == 'success'" type="success">上传成功</el-tag>
          <el-tag v-else-if="scope.row.status == 'fail'" type="danger">上传失败</el-tag>
          <el-tag v-else-if="scope.row.status == 'again'" type="danger"
            >格式不正确，请删除后重新上传</el-tag
          >
          <el-tag v-else-if="scope.row.status == 'verify'" type="warning">{{
            verifyMessage
          }}</el-tag>
          <el-tag v-else type="info">-</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="100" align="center" fixed>
        <template #default="scope">
          <el-button
            @click="handleClickRemove(scope.row)"
            type="text"
            size="small"
            :disabled="scope.row.status == 'success' && !isShowRemove"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { Upload as ElIconUpload } from '@element-plus/icons-vue';
import UploadMixin from './UploadMixin.js';
export default {
  components: {
    ElIconUpload,
  },
  name: 'VcUploadTable',
  mixins: [UploadMixin],
  props: {
    // 是否隐藏删除
    isShowRemove: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
      default: () => [],
    },
    trigDisabled: {
      type: Boolean,
      default: false,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    verifyMessage: {
      type: String,
      default: '',
    },
  },
  computed: {
    actionUrl() {
      return `${process.env.VUE_APP_WEB_SITE}${this.action}`;
    },
  },
  methods: {
    handleClickRemove(file) {
      const fileList = [...this.fileList];
      if (this.isShowRemove && file.status == 'success')
        this.$confirm('是否确定删除文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const newFileList = fileList.filter((item) => item.uid !== file.uid);

            this.$emit('handleRemove', file);
            this.$emit('update:fileList', newFileList);
          })
          .catch(() => {
            return false;
          });
      else {
        const newFileList = fileList.filter((item) => item.uid !== file.uid);
        this.$emit('update:fileList', newFileList);
      }
    },
    handleChange(file, fileList) {
      if (file.status === 'ready') {
        this.$emit('update:fileList', fileList);
        return this.$emit('verify', file, fileList);
      }

      const newFileList = [...this.fileList];
      const target = newFileList.filter((item) => item.uid === file.uid)[0];

      if (target) {
        target.status = file.status;
        this.$emit('update:fileList', newFileList);
      }
    },
    handleBeforeUpload(file) {
      if (!this.isVerify) return true;
      // 格式是否包含*
      const isWildcard = /\*$/.test(this.accept);
      const isVerify = isWildcard
        ? this.accept.indexOf(file.type.split('/')[0])
        : this.accept.indexOf(file.type);
      if (isVerify) {
        this.$message.error('上传文件格式不正确!');
        const index = this.fileList.findIndex((item) => item.uid === file.uid);
        this.fileList[index].status = 'again';
        return false;
      }
    },
  },
  watch: {
    trigDisabled: {
      immediate: true,
      handler(newValue) {
        this.trigDisabled = newValue;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-disabled {
  margin-bottom: 10px;
}
</style>
