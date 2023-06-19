<template>
  <section>
    <el-upload
      class="upload"
      :ref="refs"
      :action="actionUrl"
      :data="data"
      :headers="headers"
      :accept="accept"
      :file-list="fileList"
      :multiple="multiple"
      :show-file-list="showFileList"
      :list-type="listType"
      :auto-upload="autoUpload"
      :disabled="disabled"
      :limit="limit"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :on-exceed="handleExceed"
    >
      <template v-if="listType == 'picture-card'" #trigger>
        <el-icon><ElIconPlus /></el-icon>
      </template>
      <template v-else #trigger>
        <el-button size="small" type="primary"
          ><el-icon class="el-icon--left"><el-icon-upload /></el-icon>{{ trigger }}</el-button
        >
      </template>
      <template #tip>
        <div class="el-upload__tip">{{ tip }}</div>
      </template>
    </el-upload>
    <VcDialog
      :visible="previewConfig.show"
      :title="previewConfig.title"
      width="800px"
      @update:visible="previewConfig.show = $event"
      append-to-body
    >
      <el-image :src="previewConfig.imageUrl" fit="fill" style="width: 100%"></el-image>
    </VcDialog>
  </section>
</template>

<script>
import { Plus as ElIconPlus, Upload as ElIconUpload } from '@element-plus/icons-vue';
import xeUtils from 'xe-utils';
import UploadMixin from './UploadMixin.js';
export default {
  components: {
    ElIconPlus,
    ElIconUpload,
  },
  name: 'VcUpload',
  mixins: [UploadMixin],
  data() {
    return {
      previewConfig: {
        show: false,
        title: '预览',
        imageUrl: '',
      },
    };
  },
  computed: {
    actionUrl() {
      return `${process.env.VUE_APP_WEB_SITE}${this.action}`;
    },
  },
  methods: {
    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      if (response.code != 0) {
        // const index = fileList.findIndex((item) => item.uid == file.uid);
        // fileList[index].status = 'fail';
        xeUtils.remove(fileList, (item) => item.uid == file.uid);
        return this.$message.error(response.msg);
      }
      this.$emit('onSuccess', response, file, fileList);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.previewConfig.show = true;
      this.previewConfig.imageUrl = file.url;
      this.$emit('onPreview', file);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-image {
    > img {
      width: 100%;
    }
  }
}
</style>
