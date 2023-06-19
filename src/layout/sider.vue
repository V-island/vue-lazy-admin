<template>
  <section class="wrapper">
    <el-menu
      v-if="!isCollapse"
      :collapse="isCollapse"
      :default-active="activeView.url"
      :collapse-transition="false"
      unique-opened
      router
    >
      <template v-for="(item, index) in menuAllList">
        <template v-if="item.children && item.children.length > 0 && item.name">
          <VcSubMenu :menu="item" :key="index" />
        </template>
        <el-menu-item v-else class="menu-item" :index="`${item.url}`" :key="`${item.name}`">
          <template #title>
            <div class="images-title">
              <el-image class="icon" :src="item.customIcon" fit="fill"></el-image>
              {{ item.name }}
            </div>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </section>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState('keepAlive', ['isCollapse', 'isAccessCache', 'activeView']),
    ...mapState('user', ['menuList']),
    menuAllList() {
      const list = [...this.menuList];
      // 移除消息、待办、已办
      this._remove(
        list,
        ({ name }) =>
          name == '通知' || // 通知
          name == '待办' || // 待办
          name == '已办', // 已办
      );
      return list;
    },
  },
  created() {
    this.handleRouterChange();
  },
  mounted() {
    //监听路由变化，缓存页面
    this.$watch('$route', () => {
      this.handleRouterChange();
    });
  },
  methods: {
    handleRouterChange() {
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
          const { url, children } = item;

          if (this._isNotEmpty(url) && url == page.path) return (page.label = item.name);
          if (this._isNotEmpty(children) && children.length > 0)
            this.handleFindRouter(children, page);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/_base.scss';
.images-title {
  @include flexbox(flex-start);
  .icon {
    @include wh(18px, 18px);
    font-size: 18px;
    color: $--color-primary;
    margin-right: 12px;
    line-height: 1;
  }
}
::v-deep {
  .el-menu {
    border-width: 0;
  }
  .el-image__inner {
    width: 100%;
  }
}
</style>
