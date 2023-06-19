<template>
  <div class="content">
    <Toolbar
      class="toolbar"
      ref="toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="editor"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreatedEvent"
      @onChange="handleChangeEvent"
      @onFocus="handleFocusEvent"
    />
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ElMessage, ElLoading } from 'element-plus';

export default {
  components: { Editor, Toolbar },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    uploadImage: {
      type: Object,
      // default: () => {},
    },
  },
  setup(props, { emit }) {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();
    // 内容 HTML
    const valueHtml = ref(props.modelValue);

    const toolbarConfig = {};

    toolbarConfig.excludeKeys = [
      'emotion',
      'insertImage',
      'group-video',
      'insertTable',
      'codeBlock',
    ];

    const editorConfig = { placeholder: '请输入内容...', autoFocus: false };

    const uploadImageConfig = props.uploadImage;

    editorConfig.MENU_CONF = {
      // 上传图片的配置
    };

    editorConfig.MENU_CONF.uploadImage = {
      maxFileSize: 2 * 1024 * 1024, // 2M
      // base64LimitSize: 1024 * 1024, // 1M 以下插入 base64
      customUpload(file, insertFn) {
        const maxSize = file.size / 1024 / 1024 < uploadImageConfig.maxSize;
        if (!maxSize) {
          ElMessage({
            message: `上传文件大小不能超过 ${uploadImageConfig.maxSize}MB!`,
            type: 'warning',
          });
          return false;
        }
        const obj = new FormData();
        obj.append('file', file);
        var apiObj = uploadImageConfig.apiObj;
        const loading = ElLoading.service({
          lock: true,
          text: '图片上传中...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        // 上传请求
        apiObj(obj)
          .then((res) => {
            const parse = uploadImageConfig.parseData(res);
            /**
             * 	"url": "xxx", // 图片 src ，必须
             * 	"alt": "yyy", // 图片描述文字，非必须
             *  "href": "zzz" // 图片的链接，非必须
             */
            insertFn(parse.url, parse.alt, parse.href);
            // 以服务的方式调用的 Loading 需要异步关闭
            loading.close();
          })
          .catch(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loading.close();
          });
      },
    };

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    // 编辑器创建完毕时的回调函数
    const handleCreatedEvent = (editor) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };
    // 编辑器内容、选区变化时的回调函数。
    const handleChangeEvent = (editor) => {
      const html = editor.getHtml();
      // const text = editor.getText();
      console.log(html);
      // if (valueHtml.value != html) editor.redo(html);
      editor.move(3)

      emit('update:modelValue', html);
      // editor.clear()
      // 判断当前编辑器是否聚焦
      // if (!editor.isFocused()) editor.focus(true);
    };
    // 编辑器销毁时的回调函数
    const handleFocusEvent = (editor) => {
      editor.clear();
    };

    return {
      editorRef,
      valueHtml,
      mode: 'default', // default 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreatedEvent,
      handleChangeEvent,
      handleFocusEvent,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  z-index: 9;
  border: 1px solid #ccc;
}

.toolbar {
  border-bottom: 1px solid #ccc;
}

.editor {
  height: calc(100% - 81px) !important;
  overflow-y: hidden;
}
</style>
