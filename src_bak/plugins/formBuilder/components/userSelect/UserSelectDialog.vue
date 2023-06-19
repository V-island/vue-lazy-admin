<template>
  <el-dialog
    v-model="dialogVisible"
    title="人员选择"
    :width="type == 1 ? 680 : 460"
    destroy-on-close
    append-to-body
    @closed="$emit('closed')"
    draggable
  >
    <template v-if="type == 1">
      <div class="user-select">
        <div class="user-select__left">
          <div class="user-select__search">
            <el-input v-model="searchForm.name" :prefix-icon="ElIconSearch" placeholder="搜索成员">
              <template #append>
                <el-button :icon="ElIconSearch" @click="search"></el-button>
              </template>
            </el-input>
          </div>
          <div class="user-select__select">
            <div class="user-select__tree" v-loading="showGrouploading">
              <el-scrollbar>
                <el-tree
                  class="menu"
                  ref="groupTree"
                  :data="group"
                  node-key="id"
                  :props="{
                    label: 'name',
                    children: 'children',
                  }"
                  highlight-current
                  :expand-on-click-node="false"
                  :current-node-key="groupId"
                  @node-click="groupClick"
                >
                  <template #default="{ node, data }">
                    <span class="custom-tree-node el-tree-node__label">
                      <span class="label">
                        <el-icon :size="16" class="m-r-5">
                          <qiye
                            v-if="data.type === '1'"
                            :style="{
                              color:
                                $TOOL.data.get('IS_PRIMARY_TENANT') &&
                                data.tenantDTO &&
                                $utils.getTenantColorById(data.tenantDTO.id),
                            }"
                          ></qiye>
                          <bumen
                            v-else
                            :style="{
                              color:
                                $TOOL.data.get('IS_PRIMARY_TENANT') &&
                                data.tenantDTO &&
                                $utils.getTenantColorById(data.tenantDTO.id),
                            }"
                          ></bumen>
                        </el-icon>
                        {{ node.label }}
                      </span>
                    </span>
                  </template>
                </el-tree>
              </el-scrollbar>
            </div>
            <div class="user-select__user" v-loading="showUserloading">
              <div class="user-select__user__list">
                <el-scrollbar ref="userScrollbar">
                  <el-tree
                    class="menu"
                    ref="userTree"
                    :data="user"
                    node-key="id"
                    highlight-current
                    :props="{
                      key: 'id',
                      label: 'name',
                      children: 'children',
                    }"
                    :default-checked-keys="selectedIds"
                    :show-checkbox="limit > 1"
                    check-on-click-node
                    @check-change="userClick"
                  ></el-tree>
                </el-scrollbar>
              </div>
              <footer>
                <el-pagination
                  background
                  layout="prev,next"
                  small
                  :total="total"
                  :page-size="pageSize"
                  v-model:currentPage="currentPage"
                  @current-change="paginationChange"
                ></el-pagination>
              </footer>
            </div>
          </div>
        </div>
        <div class="user-select__toicon">
          <el-icon><arrow-right /></el-icon>
        </div>
        <div class="user-select__selected">
          <header>已选 ({{ selected.length }})</header>
          <ul>
            <el-scrollbar>
              <li v-for="(item, index) in selected" :key="item.id">
                <span class="name">
                  <el-avatar
                    v-if="$TOOL.data.get('IS_PRIMARY_TENANT')"
                    :size="30"
                    :style="{
                      background: $utils.getTenantColorById(item.tenantId) + '!important',
                    }"
                    >{{ item.name.substring(0, 1) }}</el-avatar
                  >
                  <el-avatar v-else>{{ item.name.substring(0, 1) }}</el-avatar>
                  <label>{{ item.name }}</label>
                </span>
                <span class="delete">
                  <el-button
                    text
                    type="primary"
                    :icon="ElIconDeleteFilled"
                    circle
                    size="small"
                    @click="deleteSelected(index)"
                  ></el-button>
                </span>
              </li>
            </el-scrollbar>
          </ul>
        </div>
      </div>
    </template>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Search as ElIconSearch, DeleteFilled as ElIconDeleteFilled } from '@element-plus/icons-vue';
import userService from '@/api/sys/userService';
import officeService from '@/api/sys/officeService';
export default {
  data() {
    return {
      searchForm: {
        loginName: '',
        companyDTO: {
          id: '',
        },
        officeDTO: {
          id: '',
        },
        name: '',
      },
      dialogVisible: false,
      showGrouploading: false,
      showUserloading: false,
      groupId: '',
      pageSize: 10,
      total: 0,
      currentPage: 1,
      group: [],
      user: [],
      role: [],
      type: 1,
      selected: [],
      value: [],
      ElIconSearch,
      ElIconDeleteFilled,
    };
  },
  props: {
    tenantId: { type: String, default: null },
    limit: {
      type: Number,
      default: 999999,
    },
  },
  computed: {
    selectedIds() {
      return this.selected.map((t) => t.id);
    },
  },
  methods: {
    //打开赋值
    open(data) {
      this.value = data || [];
      this.selected = JSON.parse(JSON.stringify(data || []));
      this.dialogVisible = true;
      this.getGroup();
      this.getUser();
    },
    //获取组织
    async getGroup() {
      this.showGrouploading = true;
      // officeService.treeData().then((data) => {
      // 	this.officeTreeData = data
      // 	this.showGrouploading = false;
      // })
      var res = await officeService.treeData({ tenantId: this.tenantId });
      this.showGrouploading = false;
      var allNode = { id: '', type: '1', name: '所有' };
      res.unshift(allNode);
      this.group = res;
    },
    //获取用户
    async getUser() {
      this.showUserloading = true;
      userService
        .list({
          current: this.currentPage,
          size: this.pageSize,
          ...this.searchForm,
          'tenantDTO.id': this.tenantId,
        })
        .then((data) => {
          this.user = data.records;
          this.total = data.total;
          // this.pageNo = data.current
          this.showUserloading = false;
          this.$refs.userScrollbar.setScrollTop(0);
        });
    },
    //组织点击
    groupClick(data) {
      if (data.type === '1') {
        this.searchForm.companyDTO.id = data.id;
        this.searchForm.officeDTO.id = '';
      } else {
        this.searchForm.companyDTO.id = '';
        this.searchForm.officeDTO.id = data.id;
      }
      this.currentPage = 1;
      this.groupId = data.id;
      this.getUser();
    },
    //用户点击
    userClick(data, checked) {
      if (checked) {
        if (this.limit === 1) {
          this.selected = [
            {
              id: data.id,
              name: data.name,
              tenantId: data.tenantDTO?.id,
            },
          ];
        } else {
          this.selected.push({
            id: data.id,
            name: data.name,
            tenantId: data.tenantDTO?.id,
          });
        }
      } else {
        this.selected = this.selected.filter((item) => item.id != data.id);
      }
    },
    //用户分页点击
    paginationChange() {
      this.getUser();
    },
    //用户搜索
    search() {
      // this.groupId = ''
      // this.$refs.groupTree.setCurrentKey(this.groupId)
      this.currentPage = 1;
      this.getUser();
    },
    //删除已选
    deleteSelected(index) {
      this.selected.splice(index, 1);
      console.log(this.selected);
      if (this.type == 1) {
        this.$refs.userTree.setCheckedKeys(this.selectedIds);
      } else if (this.type == 2) {
        this.$refs.groupTree.setCheckedKeys(this.selectedIds);
      }
    },
    //提交保存
    save() {
      this.value.splice(0, this.value.length);
      this.selected.map((item) => {
        this.value.push(item);
      });
      if (this.limit < this.value.length) {
        this.$message.error(`你最多只能选择${this.limit}个用户`);
        return;
      }
      this.$emit('doSubmit', this.value);
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
.user-select {
  display: flex;
}
.user-select__left {
  width: 400px;
}
.user-select__right {
  flex: 1;
}
.user-select__selected li .name .el-avatar {
  margin-right: 2px;
  height: 10;
  width: 25px;
  height: 25px;
}
.user-select__search {
  padding-bottom: 10px;
}

.user-select__select {
  display: flex;
  border: 1px solid var(--el-border-color-light);
  background: var(--el-color-white);
}
.user-select__tree {
  width: 200px;
  height: 300px;
  border-right: 1px solid var(--el-border-color-light);
}
.user-select__user {
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
}
.user-select__user__list {
  flex: 1;
  overflow: auto;
}
.user-select__user footer {
  height: 36px;
  padding-top: 5px;
  border-top: 1px solid var(--el-border-color-light);
}

.user-select__toicon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
}
.user-select__toicon i {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ccc;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
  color: #fff;
}

.user-select__selected {
  height: 345px;
  width: 200px;
  border: 1px solid var(--el-border-color-light);
  background: var(--el-color-white);
}
.user-select__selected header {
  height: 43px;
  line-height: 43px;
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 15px;
  font-size: 16px;
}
.user-select__selected ul {
  height: 300px;
  overflow: auto;
}
.user-select__selected li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 5px 5px 15px;
  height: 38px;
}
.user-select__selected li .name {
  display: flex;
  align-items: center;
}
.user-select__selected li .name .el-avatar {
  margin-right: 10px;
}
.user-select__selected li .delete {
  display: none;
}
.user-select__selected li:hover {
  background: var(--el-color-primary-light-9);
}
.user-select__selected li:hover .delete {
  display: inline-block;
}
.user-select-role .user-select__left {
  width: 200px;
}
.user-select-role .user-select__tree {
  border: none;
  height: 343px;
}
</style>
