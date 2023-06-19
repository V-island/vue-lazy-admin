export default {
  props: {
    // 必选参数，上传的地址
    action: {
      type: String,
      default: '/Upload',
      require: true,
    },
    // 设置上传的请求头部
    headers: {
      type: Object,
    },
    // 上传时附带的额外参数
    data: {
      type: Object,
    },
    // 上传的文件字段名
    name: {
      type: String,
      default: 'file',
    },
    // ref
    refs: {
      type: String,
      default: 'upload',
    },
    // 上传的文件列表 [{name: 'test.png', url: 'xxx/test.png'}]
    fileList: {
      type: Array,
      default: () => [],
    },
    // 触发文件选择框的内容
    trigger: {
      type: String,
      default: '选择上传文件',
    },
    // 提示说明文字
    tip: {
      type: String,
    },
    // 是否支持多选文件
    multiple: {
      type: Boolean,
      default: false,
    },
    // 是否显示已上传文件列表
    showFileList: {
      type: Boolean,
      default: true,
    },
    // 文件列表的类型 text/picture/picture-card
    listType: {
      type: String,
      default: 'text',
    },
    // 接受上传的文件类型
    accept: {
      type: String,
      default: 'image/*,.pdf,.doc,.docx,.xls,.xlsx',
    },
    // 是否在选取文件后立即进行上传
    autoUpload: {
      type: Boolean,
      default: true,
    },
    // 是否启用拖拽上传
    drag: {
      type: Boolean,
      default: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 最大允许上传个数
    limit: {
      type: Number,
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    httpRequest: Function,
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload: Function,
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
    beforeRemove: Function,
  },
  methods: {
    // 手动提交时调用
    submitUpload() {
      if (!this.disabled) this.$refs[this.refs].submit();
    },
    // 清空已上传的文件列表（该方法不支持在 before-upload 中调用）
    clearFiles() {
      if (!this.disabled) this.$refs[this.refs].clearFiles();
    },
    // 取消上传请求
    abort() {
      if (!this.disabled) this.$refs[this.refs].abort();
    },
    // 禁用时提示内容
    disabledPrompt() {
      this.$emit('disabledPrompt');
    },
    /* ========= 事件处理钩子 ======== */
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.$emit('onPreview', file);
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      // // console.log("handleRemove", file, fileList);
      this.$emit('onRemove', file, fileList);
    },
    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      // // console.log('handleSuccess', response, file, fileList);
      this.$emit('onSuccess', response, file, fileList);
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      // // console.log('handleError', err, file, fileList);
      this.$emit('onError', err, file, fileList);
    },
    // 文件上传时的钩子
    handleProgress(event, file, fileList) {
      // // console.log("handleProgress", event, file, fileList);
      this.$emit('onProgress', event, file, fileList);
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      // // console.log("handleChange", file, fileList);
      this.$emit('change', fileList);
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      // // console.log("handleExceed", files, fileList);
      this.$emit('change', files, fileList);
    },
  },
};
