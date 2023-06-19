<template>
  <section>
    <VcResult
      v-if="result.show"
      :status="result.status"
      :title="result.title"
      :sub-title="result.subTitle"
    >
      <template v-slot:extra>
        <el-button @click="handleBackLogin">重新登录</el-button>
      </template>
    </VcResult>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { isEmpty, getTicketByLocation, getParamByLocation, clearAppState } from 'utils';
import * as types from 'store/types';
export default {
  name: 'login',
  data() {
    return {
      result: {
        show: false,
        status: '403',
        title: '403',
        subTitle: '该账户访问无权限，请重新登录',
      },
      query: {},
    };
  },
  computed: {
    ...mapState('user', ['menuList']),
    ...mapState('keepAlive', ['isAccessCache']),
  },
  mounted() {
    this.query = getTicketByLocation();
    if (this.query.ticket) {
      // 清除浏览器缓存信息
      clearAppState();
      // 初始化登录
      this.loadData();
    } else {
      const url = window.locationRef.search.substr(1);
      const href = process.env.VUE_APP_ISC_LOGIN_ADDRESS + process.env.VUE_APP_DEPLOYMENT_ADDRESS;
      window.locationRef.href = url ? `${href}?${url}` : href;
    }
  },
  methods: {
    async loadData() {
      const { ticket } = this.query;
      // 登录获取用户信息、角色、菜单等数据
      let [err, data] = await this._awaitWrap(
        this.$store.dispatch('user/userLoginByTicket', ticket),
      );

      if (err || !data.result) {
        console.error('登录获取用户信息、角色、菜单等数据失败：', err || data);
        return this.$message.error(`操作失败：当前账号，没有绑定【报表流程】应用，请联系管理员`);
      }

      return this.getRouterReplace();
    },
    // 重新登录
    handleBackLogin() {
      window.locationRef.href =
        process.env.VUE_APP_ISC_LOGOUT_ADDRESS + process.env.VUE_APP_DEPLOYMENT_ADDRESS;
    },
    // 访问默认第一级权限菜单
    getRouterReplace() {
      const { url } = getParamByLocation();
      // 获取菜单第一个页面访问
      const path = url ? url : this.getPathByMenuList(this.menuList[0]);
      this.$router.replace({ path });
      this.$store.commit(`keepAlive/${types.RESET_MENU_CACHE_VIEW}`);

      if (this.$route.path == path) this.initRouterChange();
    },
    // 获取Path地址
    getPathByMenuList(menu) {
      // 验证是否存在子集
      if (isEmpty(menu.children) || menu.children.length < 1) return menu.path;

      return this.getPathByMenuList(menu.children[0]);
    },
    // 初始化cache tabs
    initRouterChange() {
      // 未开启缓存功能则自动跳出
      if (!this.isAccessCache) return false;
      const { path, name, meta } = this.$route;
      const page = {
        path, // 路由 path
        name, // 页面组件 name
        label: '', // 页面名称
      };
      if (meta.hiddenTab) return false;

      this.handleFindRouter(this.menuList, page);
      if (this._isEmpty(page.label)) return false;

      // 缓存路由
      this.$store.dispatch('keepAlive/addCacheView', page);
      // 设置当前激活的路由
      this.$store.dispatch('keepAlive/setActiveView', page);
    },
    // 查找菜单
    handleFindRouter(list, page) {
      // 验证是否为数组
      if (Array.isArray(list))
        // 循环查找
        list.forEach((item) => {
          const { path, children } = item;

          if (this._isNotEmpty(path) && path == page.path) return (page.label = item.name);
          if (this._isNotEmpty(children) && children.length > 0)
            this.handleFindRouter(children, page);
        });
    },
  },
};
</script>
