<template>
  <section class="qa">
    <el-row :gutter="20">
      <el-col :span="3">
        <el-menu class="el-menu-vertical-demo" :default-active="active" @select="select">
          <el-submenu v-for="(item, index) in menuData" :key="index" :index="item.label">
            <template slot="title">
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item-group v-for="(item1, index1) in item.children" :key="index1">
              <el-menu-item :index="item1.label">{{ item1.label }}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="18">
        <div class="qa-search">
          <!-- 带下拉框搜索 -->
          <el-popover
            ref="popover"
            placement="bottom-start"
            width="800"
            trigger="focus"
            title="搜索结果"
            v-if="typeNoData"
          >
            <!-- 内容区域 -->
            <div class="popover-content">
              <section v-if="restaurants.result" class="global-search">
                <div v-for="(item, index) in restaurants.searchList" :key="index">
                  <div class="search-item" @click="handleSearchEvent($event, item.questionType)">
                    <div class="body-item">
                      <p class="tag-type">
                        {{ item.questionTypeName }}
                      </p>
                      <el-tooltip effect="dark" :content="item.questionTitle" placement="top">
                        <p class="tag-item">
                          {{ item.questionTitle }}
                        </p>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <!-- 搜索 -->
            <el-input
              slot="reference"
              v-model="query.keyWord"
              placeholder="请输入"
              clearable
              @input="inputSearch"
              @keyup.enter.native="handleSearchEvent($event)"
              @clear="inputClear"
              @focus="inputFocus"
            >
            </el-input>
          </el-popover>
          <el-button
            icon="el-icon-search"
            class="searchBtn"
            @click="handleSearchEvent($event)"
          ></el-button>

          <!-- 不带下拉框搜索 -->
          <el-input
            placeholder="请输入"
            v-model="query.keyWord"
            class="input-with-select"
            clearable
            @keyup.enter.native="handleSearchEvent($event)"
            @clear="inputClear"
            v-if="typeData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleSearchEvent($event)"
            ></el-button>
          </el-input>

          <el-radio-group v-model="query.questionType">
            <el-radio :label="'menu'" @click.native.prevent="radioClick('menu')">菜单</el-radio>
            <el-radio :label="'cz'" @click.native.prevent="radioClick('cz')">问答</el-radio>
            <el-radio :label="'czsc'" @click.native.prevent="radioClick('czsc')">操作手册</el-radio>
          </el-radio-group>
        </div>
        <el-divider></el-divider>
        <!-- 列表区域 -->
        <div class="qa-cont">
          <div class="qa-bg" v-for="(item, index) in dataList" :key="index">
            <div class="title">
              <el-tag size="small" v-if="item.questionType == '2'" type="warning">问答</el-tag>
              <el-tag size="small" v-if="item.questionType == '3'">操作手册'</el-tag>
              <router-link
                :to="{
                  path: '/search/detail',
                  query: { id: item.id, unique_code: item.unique_code },
                }"
                >{{ item.questionTitle }}</router-link
              >
            </div>
            <div class="content" v-html="getHTML(item.preview)"></div>
            <div class="type">{{ item.applicationName }} -- {{ item.menuName }}</div>
          </div>
          <div v-if="dataList.length < 1">暂无数据</div>
          <el-pagination
            class="pagination"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :pageSize="query.pageSize"
            :total="total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { getResult } from 'utils';
import { getQASearch, getMenuList, getInfoByJump } from 'api/system/search-manage';

export default {
  name: 'list',
  data() {
    return {
      query: {
        keyWord: '',
        applicationName: '',
        questionType: '',
        pageNumber: 1,
        pageSize: 10,
      },
      total: 0,
      dataList: [],
      active: '',
      menuData: [],
      restaurants: {
        result: false,
        searchList: [],
      },
      typeData: false,
      typeNoData: false,
      locationHost: '',
    };
  },
  computed: {
    ...mapState('user', ['userInfo', 'token']),
    getHTML() {
      return (val) => {
        return val && val.includes('href')
          ? val.replace(val.slice(25, 50), 'http://' + this.locationHost)
          : val;
      };
    },
  },
  activated() {
    if (this._isEmpty(this.token)) {
      this.$message.error('请先登录！');
      this.$store.commit('sys/REMOVE_MAIN_TAB', this.$route.meta.title);
      this.$router.back();
    }
  },
  mounted() {
    this.initLoadData();
    this.locationHost = window.location.host;
  },
  methods: {
    // 初始化
    async initLoadData() {
      this.$store.commit('sys/CHANGE_MENU_COLLAPSE', true);

      // 获取路由传参
      const { type, title } = this._get(this.$route, 'query', {});
      console.log('路由参数', type, title);

      // 根据是否选择了类型来判断展示对应搜索框
      if (type) this.typeData = true;
      else this.typeNoData = true;

      // 判断是否是路由跳转
      if (title) {
        if (title.includes('/')) {
          this.getInfoByJump(title);
        } else {
          this.query = {
            keyWord: title,
            questionType: type,
            pageNumber: 1,
            pageSize: 10,
          };
          this.getSearchToQA();
        }
      }

      let [err, data] = await this._awaitWrap(this.getAllData());
      if (err || !data.result) return this.$message.error(err || data.message);
    },
    /** =========== 基础事件 ========== */
    // 搜索内容
    async handleSearchEvent(event, type) {
      // const { keyWord } = this._get(this, 'query', {});
      // // 判断是否存在搜索内容
      // if (!keyWord) return false;

      const { username } = this.userInfo;
      if (!username) {
        return this.$message.error('凭证无效');
      }

      // 文本框失去焦点
      event.target.blur();
      // 关闭弹窗
      if (this.$refs.popover != undefined) this.$refs.popover.doClose();
      this.query.questionType = type ? type : this.query.questionType;
      this.query.pageNumber = 1;
      this.getSearchToQA();
    },
    // 左侧菜单选择事件
    select(val) {
      val === this.active ? (this.active = '') : (this.active = val);

      this.query = {
        applicationName: this.active,
        pageNumber: 1,
        pageSize: 10,
      };

      this.getSearchToQA();
    },
    // 类型切换
    radioClick(val) {
      let type =
        val === this.query.questionType
          ? (this.query.questionType = '')
          : (this.query.questionType = val);

      if (type) {
        this.typeData = true;
        this.typeNoData = false;
      } else {
        this.typeData = false;
        this.typeNoData = true;
      }

      this.query.pageNumber = 1;
      this.getSearchToQA();
    },
    // 输入框事件
    inputSearch() {
      if (!this.query.keyWord || this.query.keyWord == '') {
        this.restaurants = {
          result: false,
          searchList: [],
        };
        return false;
      }
      // 清除缓存数据
      this.restaurants = {
        result: false,
        searchList: [],
      };

      this.getQuestion();
    },
    // 输入框查询
    getQuestion() {
      this.restaurants = {
        result: true,
        searchList: [
          { questionType: 'menu', questionTypeName: '菜单', questionTitle: this.query.keyWord },
          { questionType: 'cz', questionTypeName: '问答', questionTitle: this.query.keyWord },
          { questionType: 'czsc', questionTypeName: '操作手册', questionTitle: this.query.keyWord },
        ],
      };
    },
    // 输入框清除事件
    inputClear() {
      this.inputSearch();
    },
    // 输入框获取焦点
    inputFocus() {
      this.inputSearch();
    },
    // 分页
    handleCurrentChange(val) {
      this.query.pageNumber = val;
      this.getSearchToQA();
    },

    /** =========== 接口请求 ========== */
    async getAllData() {
      // 查询应用菜单接口
      const [menuErr, menuList] = await this._awaitWrap(getMenuList());
      if (menuErr || menuList.code != 0) return this.$message.error(menuErr || menuList.msg);

      this.menuData = this._get(menuList, 'data.records', []);

      return Promise.resolve(getResult(true, '初始化完成'));
    },
    // 获取搜索的QA内容
    async getSearchToQA() {
      const params = this._get(this, 'query', {});

      const [error, data] = await this._awaitWrap(getQASearch(params));
      if (error || !data) return this.$message.error(error || data.msg);

      this.dataList = this._get(data.data, 'records', []);
      this.total = this._get(data.data, 'total', 0);
    },

    // 获取路由跳转搜索的QA内容
    async getInfoByJump(keyWord) {
      const search = this._get(this, 'query', {});
      const params = {
        ...search,
        keyWord: keyWord,
      };

      console.log(params);
      const [error, data] = await this._awaitWrap(getInfoByJump(params));
      if (error || !data) return this.$message.error(error || data.msg);

      this.dataList = this._get(data.data, 'records', []);
      this.total = this._get(data.data, 'total', 0);
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

    .el-menu-item {
      background: #fff;
    }

    .el-menu-item.is-active {
      color: #1bb;
      background: #e7f8f8;
    }
  }

  &::v-deep .qa-search {
    width: 70%;
    position: relative;

    .el-select .el-input {
      width: 130px;
    }

    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }

    .el-radio-group {
      margin-top: 20px;
    }

    .el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
      -webkit-box-shadow: none;
    }

    .searchBtn {
      position: absolute;
      right: 0px;
      background: #f5f7fa;

      .el-icon-search {
        color: #909399;
      }
    }

    .el-button:focus,
    .el-button:hover {
      color: unset;
      border-color: #dcdfe6;
    }
  }

  .qa-cont {
    color: #606266;
    line-height: 20px;

    .qa-bg {
      margin-bottom: 20px;
      background: #f5f7fa;
      padding: 10px;
      border-radius: 5px;

      .title {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 700;

        a {
          color: #242425;
          margin-left: 10px;
          text-decoration: none;
        }
      }

      .content {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }

      .type {
        margin-top: 10px;
        color: #999;
      }
    }

    .pagination {
      float: right;
      margin-bottom: 30px;
    }
  }
}

.global-search {
  display: flex;
  flex-direction: column;
  max-height: 600px;
  overflow: auto;

  a {
    text-decoration: none;
  }

  .search-item {
    padding: 5px 10px 5px 0;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: flex-start;
    align-items: center;

    .body-item {
      flex: 1 0 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: center;
      justify-content: flex-start;
      align-items: center;

      > p {
        padding: 3px 10px;
        border-radius: 5px;
        margin: 5px 10px 5px 0;
        color: #fff;
      }
    }

    .el-icon-arrow-right {
      color: #666;
    }

    .icon-item {
      flex: 0 0 15px;
    }

    &:hover {
      background-color: #f5f7fa;
    }
  }

  .tag-type {
    width: 80px;
    text-align: center;
    background: #1393c1;
  }

  .tag-item {
    cursor: pointer;
    background: #13c18e;
    max-width: 280px;
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.block {
      max-width: initial;
    }
  }
}
</style>
