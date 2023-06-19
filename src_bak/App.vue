<template>
  <el-config-provider :locale="locale">
    <router-view v-if="isRouterAlive" />
  </el-config-provider>
</template>

<script>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
export default {
  name: 'app',
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  computed: {
    locale() {
      return zhCn;
    },
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
}
</style>
