<template>
  <div class="mod-dict-type">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
      <el-form-item>
        <el-input
          v-model="dataForm.dictName"
          placeholder="字典名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.dictType"
          placeholder="字典类型"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList">查询</el-button>
        <el-button
          v-permission="'sys:dict:save'"
          type="primary"
          @click="addOrUpdateHandle()"
          >新增
        </el-button>
        <el-button
          v-permission="'sys:dict:delete'"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          >批量删除
        </el-button>
      </el-form-item>
    </el-form>

    <base-table
      ref="dictTypeTable"
      :fetch="fetch"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="dictName"
        header-align="center"
        align="center"
        width="180"
        label="字典名称"
      >
      </el-table-column>
      <el-table-column
        prop="dictType"
        header-align="center"
        align="center"
        label="字典类型"
        width="180"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="toDictDataPage(scope.row.id)">{{
            scope.row.dictType
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="180"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="'sys:dict:update'"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
            >修改
          </el-button>
          <el-button
            v-permission="'sys:dict:delete'"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </base-table>

    <!-- 新增/修改 弹窗 -->
    <type-add-or-update
      :visible.sync="addOrUpdateVisible"
      :dict-id="currDictId"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script>
import TypeAddOrUpdate from './dict-type-add-or-update';
import { getDictType, deleteDictType } from 'api/system/dict-manage';

export default {
  name: 'dict-type',
  components: {
    TypeAddOrUpdate,
  },
  data() {
    return {
      dataForm: {
        dictName: '',
        dictType: '',
      },

      dataListSelections: [],
      addOrUpdateVisible: false,
      currDictId: null,
    };
  },
  computed: {
    fetch() {
      return {
        fn: getDictType,
        params: {
          dictName: this.dataForm.dictName,
          dictType: this.dataForm.dictType,
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        errorInfo: '获取字典类型列表失败',
      };
    },
  },
  methods: {
    // 获取字典列表
    getDataList() {
      this.$refs.dictTypeTable.getTableData(true);
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(dictId) {
      this.currDictId = dictId;
      this.addOrUpdateVisible = true;
    },
    // 删除
    deleteHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const [err, data] = await this._awaitWrap(
          deleteDictType({ data: ids }),
        );
        if (err) {
          this.$message.error('删除失败，请稍后再试！');
          return;
        }

        if (data && data.code === 0) {
          this.getDataList();
          this.$message.success('操作成功');
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    toDictDataPage(dictId) {
      this.$router.push(`/dict-data?dictId=${dictId}`);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~@/styles/_common.scss';
.mod-dict-type {
  @extend %wh-full;
}
</style>
