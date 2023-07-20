<template>
  <div class="page-container">
    <!-- 主体 -->
    <div class="main-container">
      <!-- 部门树 -->
      <block-container class="block-style" padding="0" margin="0 20px 0 0">
        <el-scrollbar :native="false" wrap-style="overflow-x: hidden;">
          <div class="left-block">
            <div class="left-block-btns">
              <el-button type="primary" @click="showDialog = true">新增部门</el-button>
              <el-button plain type="danger" @click="deleteDept">删除</el-button>
            </div>

            <div class="left-block-tree">
              <el-input
                size="large"
                suffix-icon="el-icon-search"
                placeholder="请输入需要查询的部门名称"
                v-model="filterText"
              >
              </el-input>
              <el-tree
                v-loading="loading"
                ref="tree"
                class="filter-tree"
                :data="deptTree"
                node-key="id"
                :props="{ children: 'children', label: 'name' }"
                default-expand-all
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                @node-click="nodeClick"
              >
              </el-tree>
            </div>
          </div>
        </el-scrollbar>
      </block-container>

      <!-- 修改表单 -->
      <block-container class="block-style" padding="0">
        <el-scrollbar :native="false" wrap-style="overflow-x: hidden;">
          <div class="right-block">
            <div class="right-block-title" :style="{ backgroundColor: _getThemeColor() }">
              部门信息
            </div>
            <div class="right-block-form">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="部门名称" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="上级部门" prop="parentName">
                  <el-input
                    disabled
                    :value="ruleForm.parentName"
                    placeholder="请选择部门节点"
                  ></el-input>
                </el-form-item>
                <el-form-item label="部门编码" prop="deptCode">
                  <el-input v-model="ruleForm.deptCode"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                  <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                  <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="ruleForm.remarks"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitUpdate">保存</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-scrollbar>
      </block-container>
    </div>

    <!-- 新增表单 -->
    <base-dialog
      :visible.sync="showDialog"
      width="50%"
      title="新增部门"
      @close="resetForm('addForm')"
    >
      <div class="dialogForm">
        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="auto">
          <el-row>
            <el-col :span="15" :offset="4">
              <el-form-item prop="parentName" label="上级部门：" class="dept-list">
                <el-popover
                  v-model="deptListVisible"
                  ref="deptListPopover"
                  placement="bottom-start"
                  trigger="click"
                >
                  <el-tree
                    :data="deptTree"
                    :props="{ label: 'name', children: 'children' }"
                    node-key="id"
                    ref="deptListTree"
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    accordion
                    @current-change="deptListTreeCurrentChangeHandle"
                  >
                  </el-tree>
                </el-popover>
                <el-input
                  v-model="addForm.parentName"
                  v-popover:deptListPopover
                  :readonly="true"
                  placeholder="上级部门"
                >
                  <i
                    v-if="addForm.pid !== '0'"
                    slot="suffix"
                    @click.stop="deptListTreeSetDefaultHandle"
                    class="el-icon-circle-close el-input__icon"
                  >
                  </i>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="15" :offset="4">
              <el-form-item label="部门名称：" prop="name">
                <el-input
                  v-model="addForm.name"
                  style="width: 100%"
                  placeholder="请输入部门名称"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="15" :offset="4">
              <el-form-item label="部门编码：" prop="deptCode">
                <el-input
                  v-model="addForm.deptCode"
                  style="width: 100%"
                  placeholder="请输入部门编码"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="15" :offset="4">
              <el-form-item label="电话：">
                <el-input
                  v-model="addForm.phone"
                  style="width: 100%"
                  placeholder="请输入电话"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="15" :offset="4">
              <el-form-item label="地址：">
                <el-input
                  v-model="addForm.address"
                  style="width: 100%"
                  placeholder="请输入地址"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="15" :offset="4">
              <el-form-item label="备注：">
                <el-input
                  type="textarea"
                  v-model="addForm.remarks"
                  :rows="3"
                  style="width: 100%"
                  placeholder="请输入备注"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div slot="footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">保存</el-button>
      </div>
    </base-dialog>
  </div>
</template>

<script>
import { getAllDept, addDept, updateDept, deleteDept } from 'api/system/dept-manage';
export default {
  name: 'dept-manage',
  data() {
    return {
      filterText: '',
      showDialog: false,
      deptTree: [],
      loading: false,
      ruleForm: {
        id: '',
        name: '',
        pid: '',
        parentName: '',
        sort: 0,
        deptCode: '',
        phone: '',
        address: '',
        remarks: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: ['blur', 'change'],
          },
        ],
        parentName: [
          {
            required: true,
            message: '请选择一个部门',
            trigger: ['blur', 'change'],
          },
        ],
        /*deptCode: [
          {
            required: true,
            message: '请输入部门编码',
            trigger: ['blur', 'change'],
          },
          {
            min: 3,
            max: 8,
            message: '长度在 3 到 8 个字符',
            trigger: ['blur', 'change'],
          },
        ],*/
      },
      addForm: {
        name: '',
        pid: '0',
        parentName: '一级部门',
        sort: 0,
        deptCode: '',
        phone: '',
        address: '',
        remarks: '',
      },
      deptListVisible: false,
      addRules: {
        name: [
          {
            required: true,
            message: '请输入部门名称',
            trigger: ['blur', 'change'],
          },
        ],
        parentName: [
          {
            required: true,
            message: '请选择一个部门',
            trigger: ['blur', 'change'],
          },
        ],
        /*deptCode: [
          {
            required: true,
            message: '请输入部门编码',
            trigger: ['blur', 'change'],
          },
          {
            min: 3,
            max: 8,
            message: '长度在 3 到 8 个字符',
            trigger: ['blur', 'change'],
          },
        ],*/
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getDeptTree();
  },
  methods: {
    deptChange(deptID) {
      // 部门变更了，重新获取页面数据
      console.log(deptID);
    },
    async getDeptTree() {
      this.loading = true;
      const [err, data] = await this._awaitWrap(getAllDept());
      this.loading = false;
      if (err) {
        this.$message.error('获取部门列表失败。');
        return;
      }
      if (data && data.code === 0) {
        this.deptTree = data.data;
      } else {
        this.$message.error(data.msg);
      }
    },
    // 部门树节点过滤
    filterNode(value, data, node) {
      if (!value) return true;
      let parentNode = node.parent,
        labels = [node.label],
        level = 1;
      while (level < node.level) {
        labels = [...labels, parentNode.label];
        parentNode = parentNode.parent;
        level++;
      }
      return labels.some((label) => label.indexOf(value) !== -1);
    },
    // 节点点击事件
    nodeClick(node) {
      this.ruleForm.id = node.id;
      this.ruleForm.name = node.name;
      this.ruleForm.pid = node.pid || '0';
      this.ruleForm.parentName = node.parentName || '一级部门';
      this.ruleForm.deptCode = node.deptCode;
      this.ruleForm.phone = node.phone;
      this.ruleForm.address = node.address;
      this.ruleForm.remarks = node.remarks;
    },
    // 修改提交
    submitUpdate() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          const [err, data] = await this._awaitWrap(updateDept(this.ruleForm));
          if (err) {
            this.$message.error('修改失败，请稍后重试。');
            return;
          }

          if (data && data.code === 0) {
            this.getDeptTree();
            this.resetForm('ruleForm');
            this.$message.success('修改成功！');
          } else {
            this.$message.error(data.msg);
          }
        } else {
          this.$message.error('表单校验失败，请正确填写。');
          return false;
        }
      });
    },
    // 上级部门树, 选中
    deptListTreeCurrentChangeHandle(data) {
      this.addForm.pid = data.id;
      this.addForm.parentName = data.name;
      this.deptListVisible = false;
    },
    // 上级部门树, 设置默认值
    deptListTreeSetDefaultHandle() {
      this.addForm.pid = '0';
      this.addForm.parentName = '一级部门';
    },
    // 新增提交
    submitAdd() {
      this.$refs['addForm'].validate(async (valid) => {
        if (valid) {
          const [err, data] = await this._awaitWrap(addDept(this.addForm));
          if (err) {
            this.$message.error('保存失败，请稍后重试。');
            return;
          }
          if (data && data.code === 0) {
            this.getDeptTree();
            this.showDialog = false;
            this.$message.success('保存成功！');
          } else {
            this.$message.error(data.msg);
          }
        } else {
          this.$message.error('表单校验失败，请正确填写。');
        }
      });
    },
    // 删除部门
    deleteDept() {
      if (this._isEmpty(this.ruleForm.id)) {
        this.$message.warning('请先选择一个部门节点。');
        return;
      }

      this.$confirm(`确定删除[${this.ruleForm.name}]节点吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const [err, data] = await this._awaitWrap(deleteDept(this.ruleForm.id));
          if (err) {
            this.$message.error('删除失败，请稍后重试。');
            return;
          }

          if (data && data.code === 0) {
            this.getDeptTree();
            this.resetForm('ruleForm');
            this.$message.success('删除成功！');
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(() => {
          console.log('已取消');
        });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;
  height: 100%;
}

.main-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: calc(100% - 70px);
}

.block-style {
  flex: 1;
  height: 100%;
}

.el-scrollbar {
  height: 100%;
}

.left-block {
  display: flex;
  flex-direction: column;
  padding: 20px;

  & > .left-block-btns {
    display: flex;
    flex-direction: row;
  }
}

.left-block-tree {
  margin-top: 10px;

  & > .filter-tree {
    margin-top: 10px;
  }
}

.left-block-tree {
  ::v-deep .el-tree-node__label {
    font-size: 18px;
  }
}

.right-block {
  display: flex;
  flex-direction: column;
  align-items: center;

  & > .right-block-title {
    align-self: flex-start;
    width: 140px;
    height: 43px;
    color: #fff;
    font-size: 20px;
    line-height: 43px;
    text-align: center;
    border-top-left-radius: 10px;
  }

  & > .right-block-form {
    width: 80%;
    height: 100%;
    font-size: 20px;
    padding: 20px;
  }
}
</style>
