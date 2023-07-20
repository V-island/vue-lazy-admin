<template>
  <div class="mod-dict-data">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList">
      <el-form-item>
        <el-input
          v-model="dataForm.dictLabel"
          placeholder="字典标签"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="dataForm.dictValue"
          placeholder="字典值"
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
      ref="dictValueTable"
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
        prop="dictLabel"
        header-align="center"
        align="center"
        width="180"
        label="字典标签"
      >
      </el-table-column>
      <el-table-column
        prop="dictValue"
        header-align="center"
        align="center"
        label="字典值"
        width="180"
      >
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
    <data-add-or-update
      :visible.sync="addOrUpdateVisible"
      :dict-id="currDictId"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script>
import DataAddOrUpdate from './dict-data-add-or-update';
import { getDictData, deleteDictData } from 'api/system/dict-manage';

export default {
  name: 'dict-data',
  components: {
    DataAddOrUpdate,
  },
  data() {
    return {
      dataForm: {
        dictLabel: '',
        dictValue: '',
      },

      dataListSelections: [],
      addOrUpdateVisible: false,
      currDictId: null,
    };
  },
  activated() {
    if (!this._isEmpty(this.dictId)) {
      this.getDataList();
    }
  },
  computed: {
    fetch() {
      return {
        fn: getDictData,
        params: {
          dictTypeId: this.$route.query.dictId || '0',
          dictLabel: this.dataForm.dictLabel,
          dictValue: this.dataForm.dictValue,
        },
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
        errorInfo: '获取字典数据列表失败',
      };
    },
  },
  methods: {
    // 获取字典列表
    getDataList() {
      this.$refs.dictValueTable.getTableData(true);
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
          deleteDictData({ data: ids }),
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
  },
};
</script>
<style lang="scss" scoped>
@import '~@/styles/_common.scss';
.mod-dict-data {
  @extend %wh-full;
}
</style>
