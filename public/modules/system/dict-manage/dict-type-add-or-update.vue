<template>
  <base-dialog
    :title="_isEmpty(dataForm.id) ? '新增' : '修改'"
    :visible.sync="showDialog"
    @close="dialogClose"
  >
    <el-form
      ref="dataForm"
      label-width="80px"
      :model="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit"
    >
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="dataForm.dictName" placeholder="字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="dataForm.dictType" placeholder="字典类型"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number
          v-model="dataForm.sort"
          controls-position="right"
          :min="0"
          label="排序"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </base-dialog>
</template>

<script>
import {
  getDictTypeDetail,
  saveDictType,
  updateDictType,
} from 'api/system/dict-manage';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dictId: {
      type: [String, Number],
    },
  },
  watch: {
    visible: {
      handler: function (val) {
        if (val) {
          this.initData();
        }
      },
      immediate: true,
    },
  },
  computed: {
    showDialog: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  data() {
    return {
      dataForm: {
        id: '',
        dictName: '',
        dictType: '',
        sort: 0,
        remark: '',
      },
      dataRule: {
        dictName: [
          {
            required: true,
            message: '请输入字典名称',
            trigger: 'blur',
          },
        ],
        dictType: [
          {
            required: true,
            message: '请输入字典类型',
            trigger: 'blur',
          },
        ],
        sort: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    async initData() {
      this.dataForm.id = this.dictId;

      // 如果是修改，查询字典信息
      if (!this._isEmpty(this.dataForm.id)) {
        const [roleErr, roleData] = await this._awaitWrap(
          getDictTypeDetail(this.dataForm.id),
        );
        if (roleErr) {
          this.$message.error('获取字典信息失败');
          return;
        }

        if (roleData && roleData.code === 0) {
          this.dataForm = {
            ...this.dataForm,
            ...roleData.data,
          };
        }
      }
    },
    // 关闭弹窗
    dialogClose() {
      this.$refs['dataForm'].resetFields();
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const requestFn = this._isEmpty(this.dataForm.id)
            ? saveDictType
            : updateDictType;

          const [err, data] = await this._awaitWrap(requestFn(this.dataForm));
          if (err) {
            this.$message.error('保存字典信息失败');
            return;
          }
          if (data && data.code === 0) {
            this.showDialog = false;
            this.$message.success('操作成功');
            this.$emit('refreshDataList');
          } else {
            this.$message.error(data.msg);
          }
        }
      });
    },
  },
};
</script>
