<template>
  <el-container class="layout" v-loading="pageLoading">
    <el-header>
      <MainHead />
    </el-header>
    <el-container>
      <el-aside class="layout-aside" :width="isCollapse ? '0' : '230px'">
        <MainSider />
        <MainCollapse />
      </el-aside>
      <!-- 开启缓存 -->

      <el-container v-if="isAccessCache">
        <el-main class="layout-main">
          <MainTabs />
          <router-view v-slot="{ Component }">
            <transition>
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
          <div class="watermark"></div>
        </el-main>
      </el-container>

      <!-- 不开启缓存 -->
      <el-main class="layout-main" v-else>
        <router-view></router-view>
        <div class="watermark"></div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import { createWatermark } from 'utils';
import MainHead from './header';
import MainSider from './sider';
import MainTabs from './tabs';
import MainCollapse from './collapse';
import { disableCacheComponents } from 'config';
export default {
  components: {
    MainHead,
    MainSider,
    MainTabs,
    MainCollapse,
  },
  data() {
    return {
      disableCache: Object.freeze(disableCacheComponents),
    };
  },
  computed: {
    ...mapGetters('keepAlive', ['getCacheViews']),
    ...mapState('keepAlive', ['isCollapse', 'isAccessCache', 'activeView']),
    ...mapState('user', ['userInfo']),
    ...mapState('common', ['pageLoading']),
  },
  mounted() {
    const UserInfo = this.userInfo;
    const time = moment().format('YYYY-MM-DD');

    createWatermark(`${this._get(UserInfo, 'orgName', '')} ${this._get(UserInfo, 'userName', '')} ${time}`, '.watermark', -20, 'rgba(144,147,153,0.1)');

    this.loadData();
  },
  methods: {
    // 登录
    async loadData() {
      this._showPageLoading();
      // 登录获取用户信息、角色、菜单等数据
      let [err, data] = await this._awaitWrap(
        this.$store.dispatch('user/getIscUserInfo', this._get(this.userInfo, 'username', '')),
      );
      if (err || !data.result) {
        console.error('登录获取用户信息、角色、菜单等数据失败：', err || data);
        this.$message.error('该用户没有权限');
        this.$router.replace({ path: '/403' });
      }
      // 加载缓存请求
      this.$store.dispatch('cache/initLocalCache');
      this._hidePageLoading();
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100%;
}
.layout-aside {
  position: relative;
  overflow: initial;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
  background-color: #fff;
}
.layout-main {
  position: relative;
  overflow: auto;
  height: calc(100vh - 60px);

  .pages {
    background-color: $--color-white;
    padding: 15px 20px;
  }
}
.watermark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}
</style>
