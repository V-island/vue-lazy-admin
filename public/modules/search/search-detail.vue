<template>
  <section class="qa">
    <el-page-header @back="goBack" content="详情页面"> </el-page-header>
    <el-row :gutter="20">
      <!-- <el-col :span="3">
        <el-menu class="el-menu-vertical-demo" :default-active="active">
          <el-submenu v-for="(item, index) in menuData" :key="index" :index="item.label">
            <template slot="title">
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item-group v-for="(item1, index1) in item.children" :key="index1">
              <el-menu-item :index="item1.label">{{ item1.label }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col> -->
      <el-col :span="24">
        <h2>{{ detailData.questionTitle }}</h2>
        <div class="des">
          <span>应用：{{ detailData.applicationName }}</span>
          <span v-if="menuHidden == '1'">菜单：{{ detailData.menuName }}</span>
          <span v-else
            >菜单：<a
              :href="http + detailData.menuUrl"
              target="_blank"
              rel="noopenner noreferrer"
              >{{ detailData.menuName }}</a
            ></span
          >
          <span>问题编码：{{ detailData.uniqueCode }}</span>
          <span>浏览次数：{{ detailData.readNumber }}</span>
        </div>
        <div v-html="detailData.solution"></div>
        <div class="date">
          <span>创建于 {{ detailData.createTime }} {{ detailData.createById }}</span>
          <span>更新于 {{ detailData.updateTime }} {{ detailData.updateById }}</span>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import {
  getQuestionDetail,
  getIncreaseFrequency,
  getHiddenCondition,
} from 'api/system/search-manage';
import { getResult } from 'utils';

export default {
  name: 'detail',
  data() {
    return {
      // active: '',
      query: {
        id: '',
        unique_code: '',
      },
      detailData: {},
      // menuData: [],
      menuHidden: '',
      http: '',
    };
  },
  watch: {
    $route: {
      handler: function (val) {
        if (val.fullPath.indexOf('search/detail') > 0) {
          console.log('route', val);
          this.initLoadData();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.$store.commit('sys/CHANGE_MENU_COLLAPSE', true);

      // 获取路由传参
      const { id, unique_code } = this._get(this.$route, 'query', {});
      this.query = { id, unique_code };
      this.http = 'http://' + window.location.host;

      let [err, data] = await this._awaitWrap(this.getAllData());
      this.loading = false;
      if (err || !data.result) return this.$message.error(err || data.message);
    },

    /** =========== 接口请求 ========== */
    async getAllData() {
      // 查询应用菜单接口
      // const [menuErr, menuList] = await this._awaitWrap(getMenuList());
      // if (menuErr || menuList.code != 0)
      //   return this.$message.error(menuErr || menuList.msg);
      // this.menuData = this._get(menuList, 'data.records', []);

      // 查询问题详情
      const params = this._get(this, 'query', {});
      const [detailErr, detailList] = await this._awaitWrap(getQuestionDetail(params));
      if (detailErr || detailList.code != 0)
        return this.$message.error(detailErr || detailList.msg);
      this.detailData = this._get(detailList, 'data', {});

      // 查询增加查看次数
      const [increaseErr, increaseList] = await this._awaitWrap(getIncreaseFrequency(params));
      if (increaseErr || increaseList.code != 0)
        return this.$message.error(increaseErr || increaseList.msg);

      // 查询增加查看次数
      const [hiddenErr, hidden] = await this._awaitWrap(getHiddenCondition());
      if (hiddenErr || hidden.code != 0) return this.$message.error(hiddenErr || hidden.msg);
      this.menuHidden = this._get(hidden, 'data[0].code', '');
      console.log('menuHidden', this.menuHidden);

      return Promise.resolve(getResult(true, '初始化完成'));
    },

    // 返回上一页
    goBack() {
      window.history.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.qa {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;
  &::v-deep .el-col-3 {
    margin-right: 30px;
  }
  &::v-deep .el-menu {
    border-right: none;
  }
  .el-page-header {
    margin-bottom: 20px;
  }
  h2 {
    text-align: center;
  }
  .des {
    color: #666666;
    margin-bottom: 15px;
    text-align: center;
    span {
      margin-right: 20px;
    }
    a {
      color: #10b3b3;
    }
  }
  .date {
    width: 100%;
    font-size: 12px;
    color: #999;
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
}
</style>
