<template>
  <base-dialog
    :title="_isEmpty(dataForm.id) ? '新增' : '修改'"
    :visible.sync="showDialog"
    @close="menuDialogClose"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit"
      label-width="80px"
    >
      <el-form-item prop="type" label="类型">
        <el-radio-group v-model="dataForm.type" :disabled="!!dataForm.id">
          <el-radio :label="0">菜单</el-radio>
          <el-radio :label="1">按钮</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="名称"></el-input>
      </el-form-item>

      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
          v-model="menuListVisible"
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click"
        >
          <el-scrollbar :native="false" wrap-style="overflow-x: hidden;">
            <el-tree
              :data="menuList"
              :props="{ label: 'name', children: 'children' }"
              ref="menuListTree"
              node-key="id"
              accordion
              :default-expand-all="false"
              :highlight-current="true"
              :expand-on-click-node="false"
              @current-change="menuListTreeCurrentChangeHandle"
            >
            </el-tree>
          </el-scrollbar>
        </el-popover>
        <el-input
          v-model="dataForm.parentName"
          v-popover:menuListPopover
          :readonly="true"
          placeholder="点击选择上级菜单"
          class="menu-list__input"
        >
          <i
            v-if="dataForm.pid !== '0'"
            slot="suffix"
            @click.stop="deptListTreeSetDefault"
            class="el-icon-circle-close el-input__icon"
          ></i>
        </el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.type === 0" label="菜单路由" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
      </el-form-item>

      <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="sort">
        <el-input-number
          v-model="dataForm.sort"
          controls-position="right"
          :min="0"
          label="排序号"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="授权标识" prop="permissions">
        <el-input
          v-model="dataForm.permissions"
          placeholder="多个用逗号分隔, 如: user:list,user:create"
        ></el-input>
      </el-form-item>

      <el-form-item prop="icon" label="系统图标" class="icon-list">
        <el-popover
          v-model="iconListVisible"
          ref="iconListPopover"
          placement="top-start"
          trigger="click"
          popper-class="mod-sys__menu-icon-popover"
        >
          <div class="mod-sys__menu-icon-inner">
            <div class="mod-sys__menu-icon-list">
              <el-button
                v-for="(item, index) in iconList"
                :key="index"
                @click="iconChange(item)"
                :class="{ 'is-active': dataForm.icon === item }"
              >
                <i :class="`fa fa-fw ${item}`" aria-hidden="true"></i>
              </el-button>
            </div>
          </div>
        </el-popover>
        <el-input
          v-model="dataForm.icon"
          v-popover:iconListPopover
          clearable
          placeholder="选择图标"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </base-dialog>
</template>

<script>
import {
  getAllMenu,
  getMenuInfoById,
  saveMenuInfo,
  updateMenuInfo,
} from 'api/system/menu-manage';
import { resetRouterMenu } from 'utils';
import { menuIcons } from 'config';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    menuId: {
      type: [String, Number],
    },
  },
  data() {
    let validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'));
      } else {
        callback();
      }
    };
    return {
      iconList: Object.freeze(menuIcons),
      menuListVisible: false,
      iconListVisible: false,
      dataForm: {
        id: null,
        type: 0,
        name: '',
        pid: '0',
        parentName: '一级菜单',
        url: '',
        permissions: '',
        sort: 0,
        icon: '',
      },
      dataRule: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' },
        ],
        url: [{ validator: validateUrl, trigger: 'blur' }],
      },
      menuList: [],
    };
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
    'dataForm.type'() {
      this.$refs['dataForm'].clearValidate();
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
  methods: {
    iconChange(iconName) {
      this.dataForm.icon = iconName;
      this.iconListVisible = false;
    },
    async initData() {
      this.dataForm.id = this.menuId;
      const [err, data] = await this._awaitWrap(getAllMenu({ type: 0 }));
      if (err) {
        this.$message.error('获取菜单列表失败');
        return;
      }
      this.menuList = data.data;

      // 修改
      if (!this._isEmpty(this.dataForm.id)) {
        const [infoErr, infoData] = await this._awaitWrap(
          getMenuInfoById(this.dataForm.id),
        );
        if (infoErr) {
          this.$message.error('获取菜单信息失败');
          return;
        }

        const menuInfo = infoData.data || {};
        this.dataForm = {
          ...this.dataForm,
          ...menuInfo,
        };

        if (this.dataForm.pid === '0') {
          this.deptListTreeSetDefault();
          return;
        }

        this.$refs.menuListTree.setCurrentKey(this.dataForm.pid);
      }
    },
    // 清除上级菜单, 设置默认值
    deptListTreeSetDefault() {
      this.dataForm.pid = '0';
      this.dataForm.parentName = '一级菜单';
      this.menuListVisible = false;
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data) {
      this.dataForm.pid = data.id;
      this.dataForm.parentName = data.name;
      this.menuListVisible = false;
    },
    // 关闭弹窗
    menuDialogClose() {
      this.$refs['dataForm'].resetFields();
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const requestFn = this._isEmpty(this.dataForm.id)
            ? saveMenuInfo
            : updateMenuInfo;
          const [err, data] = await this._awaitWrap(requestFn(this.dataForm));

          if (err) {
            this.$message.error('菜单保存失败');
            return;
          }

          if (data && data.code === 0) {
            this.$emit('refreshDataList');
            this.showDialog = false;
            this.$message.success('菜单保存成功!');
            // 新增或修改菜单后需要清空异步路由，重新获取新菜单后生成异步路由
            resetRouterMenu();
          } else {
            this.$message.error(data.msg);
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.el-scrollbar {
  height: 40vh;
}
</style>
<style lang="scss">
.mod-sys__menu {
  .menu-list,
  .icon-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  &-icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &-icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &-icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
}
</style>
