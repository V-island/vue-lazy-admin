<template>
  <div class="edit-article-container">
    <div
      v-if="_isNotEmpty($route.query.articleId)"
      style="display: flex; align-items: center; margin-bottom: 10px"
    >
      <span style="width: 80px">启用状态：</span>
      <el-switch v-model="dataForm.titleStatus" :active-value="1" :inactive-value="0"> </el-switch>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 10px">
      <div style="width: 80px">文章标题:</div>
      <el-input v-model="dataForm.title"></el-input>
    </div>
    <div v-loading="uploadLoading" style="display: flex; align-items: center; margin-bottom: 10px">
      <span style="width: 80px">文章内容：</span>
      <div id="edit-article" style="width: 100%"></div>
    </div>

    <div style="display: flex; justify-content: center; margin-top: 20px">
      <el-button @click="cancel">取消</el-button>
      <el-button type="success" plain @click="preview">预览</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>

    <!--  预览弹窗  -->
    <base-dialog :visible.sync="showPreview" title="文章预览" width="80%">
      <div v-html="dataForm.content"></div>
    </base-dialog>
  </div>
</template>

<script>
import wangEditor from 'wangeditor';
import { getArticleDetail, saveArticle, updateArticle, uploadImg } from 'api/article-manage/index';
export default {
  data() {
    return {
      editor: null,
      uploadLoading: false,
      dataForm: {
        title: '',
        content: '',
        titleStatus: 1,
      },
      showPreview: false,
    };
  },
  mounted() {
    this.initEditor();
  },
  activated() {
    this.clear();
    this.getArticleDetail();
  },
  methods: {
    initEditor() {
      const editor = new wangEditor(`#edit-article`);
      // 设置编辑区域高度
      editor.config.height = 400;
      editor.config.zIndex = 5;
      // 编辑内容变化事件
      editor.config.onchange = this.editorContentChange;
      // 上传的图片最大10M
      editor.config.uploadImgMaxSize = 10 * 1024 * 1024;
      // 自定义图片上传方法
      editor.config.customUploadImg = this.customUploadImg;
      // 图片直接转base64，不能和自定义图片上传方法同时设置。
      //editor.config.uploadImgShowBase64 = true;
      // 排除视频和代码控件
      editor.config.excludeMenus = ['video', 'code', 'emoticon'];
      // 创建编辑器
      editor.create();
      this.editor = editor;
    },
    // 富文本内容变更
    editorContentChange(newHtml) {
      this.dataForm.content = newHtml;
    },
    // 自定义本地图片上传方法
    async customUploadImg(resultFiles, insertImgFn) {
      if (resultFiles.length > 1) {
        this.$message.error('每次最多上传一张图片');
        return;
      }
      this.uploadLoading = true;
      const [err, data] = await this._awaitWrap(uploadImg({ file: resultFiles[0] }));
      if (err) {
        this.uploadLoading = false;
        this.$message.error('上传失败，请稍后再试');
        return;
      }
      if (data && data.code === 0) {
        insertImgFn(data.data);
        this.$message.success('上传成功！');
      } else {
        this.$message.error(data.msg);
      }
      this.uploadLoading = false;
    },
    // 通过代码获取编辑器内容
    getEditorData() {
      let data = this.editor.txt.html();
      alert(data);
    },
    // 预览文章
    preview() {
      this.showPreview = true;
    },
    // 保存文章
    async save() {
      let fetchFn = this._isEmpty(this.$route.query.articleId) ? saveArticle : updateArticle;
      const [err, data] = await this._awaitWrap(fetchFn(this.dataForm));
      if (err) {
        this.$message.error('保存失败，请重试。');
        return;
      }
      if (data && data.code === 0) {
        this.$message.success('保存成功！');
        this.clear();
      } else {
        this.$message.error(data.msg);
      }
    },
    // 修改文章详情
    async getArticleDetail() {
      const articleId = this.$route.query.articleId;
      if (this._isNotEmpty(articleId)) {
        const [err, data] = await this._awaitWrap(getArticleDetail(articleId));
        if (err) {
          this.$message.error('获取文章详情失败');
          this.$router.back();
          return;
        }
        if (data && data.code === 0) {
          this.dataForm.title = data.data.title;
          this.dataForm.content = data.data.content;
          this.dataForm.titleStatus = data.data.titleStatus;
          this.dataForm.id = data.data.id;
          // 重新设置编辑器内容
          this.editor.txt.html(data.data.content);
        } else {
          this.$message.error(data.msg);
        }
      }
    },
    // 清除编辑器内容
    clear() {
      this.dataForm = {
        title: '',
        content: '',
        titleStatus: 1,
      };
      this.editor && this.editor.txt.clear();
    },
    cancel() {
      this.clear();
      this.$router.back();
    },
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    this.editor.destroy();
    this.editor = null;
  },
};
</script>

<style lang="scss" scoped>
.edit-article-container {
  position: relative;
  width: 100%;
  margin: auto;
  z-index: 1;

  h3 {
    margin: 30px 0 15px;
  }
}
</style>
<style lang="scss">
.edit-article-container {
  /* table 样式 */
  table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }
  table td,
  table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }
  table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }

  /* blockquote 样式 */
  blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* code 样式 */
  code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
  }
  pre code {
    display: block;
  }

  /* ul ol 样式 */
  ul,
  ol {
    margin: 10px 0 10px 20px;
  }
}
</style>
