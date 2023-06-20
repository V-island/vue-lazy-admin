<template>
  <el-container class="layout" v-loading="pageLoading">
    <router-view v-if="show"></router-view>
  </el-container>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { createWatermark } from 'utils';
export default {
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapState('common', ['pageLoading']),
  },
  data() {
    return {
      show: false,
    };
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
      const username = import.meta.env.VUE_APP_LOGIN_USERNAME;
      // 登录获取用户信息、角色、菜单等数据
      let [error, login] = await this._awaitWrap(
        this.$store.dispatch('user/userLoginByUserName', username),
      );

      if (error || !login.result) {
        this._hidePageLoading();
        console.error('登录获取用户信息、角色、菜单等数据失败：', error || login);
        return this.$message.error(`操作失败：当前账号，没有绑定【报表流程】应用，请联系管理员`);
      }
      this.show = true;
      this._hidePageLoading();
    },
  },
};
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  min-height: 100%;
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
