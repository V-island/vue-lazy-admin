<template>
  <div class="mod-dict-data">
    <div style="margin-bottom: 10px">
      <el-button v-permission="'title:comtitle:save'" type="primary" @click="addOrEdit()"
        >新增
      </el-button>
      <el-button
        v-permission="'title:comtitle:delete'"
        type="danger"
        @click="deleteHandle()"
        :disabled="dataListSelections.length <= 0"
        >批量删除
      </el-button>
    </div>

    <base-table ref="articleTable" :fetch="fetch" @selection-change="selectionChangeHandle">
      <el-table-column align="center" type="selection" width="50"> </el-table-column>
      <el-table-column
        prop="title"
        align="center"
        width="180"
        label="文章标题"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <!--      <el-table-column prop="content" align="center" label="文章内容" width="180" :show-overflow-tooltip="true">
      </el-table-column>-->
      <el-table-column prop="titleStatus" align="center" label="文章状态">
        <template #default="scope">
          <span>{{ scope.row.titleStatus === 1 ? '启用' : '冻结' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" align="center" label="创建时间"> </el-table-column>
      <el-table-column prop="updateDate" align="center" label="修改时间"> </el-table-column>
      <el-table-column header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="'title:comtitle:update'"
            type="text"
            size="small"
            @click="addOrEdit(scope.row.id)"
            >修改
          </el-button>
          <el-button
            v-permission="'title:comtitle:delete'"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script>
import { getArticleList, deleteArticle } from 'api/article-manage';

export default {
  name: 'article-manage',
  data() {
    return {
      dataForm: {
        dictLabel: '',
        dictValue: '',
      },

      dataListSelections: [],
    };
  },
  activated() {
    this.getDataList();
  },
  computed: {
    fetch() {
      return {
        fn: getArticleList,
        listKey: {
          list: 'data.list',
          total: 'data.total',
        },
      };
    },
  },
  methods: {
    // 获取字典列表
    getDataList() {
      this.$refs.articleTable.getTableData(true);
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrEdit(articleId) {
      this.$router.push({ path: '/edit-article', query: { articleId } });
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
        const [err, data] = await this._awaitWrap(deleteArticle(ids));
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
