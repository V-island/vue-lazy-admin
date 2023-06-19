<template>
  <section class="wrapper">
    <div class="header-logo">
      <div class="login-images"></div>
      <p class="title">{{ documentTitle }}</p>
    </div>
    <div class="main">
      <el-dropdown class="user-info" @command="onCommand">
        <span class="dropdown-link">
          <div class="user-images"></div>
          <span>{{ _get(userInfo, `realName`, '') }}</span>
          <el-icon class="el-icon--right"><el-icon-caret-bottom /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </section>
</template>

<script>
import { CaretBottom as ElIconCaretBottom } from '@element-plus/icons-vue';
import { mapState } from 'vuex';
import { toLoginPage } from 'utils';

export default {
  data() {
    return {
      documentTitle: process.env.VUE_APP_DOCUMENT_TITLE,
    }
  },
  components: {
    ElIconCaretBottom,
  },
  computed: {
    ...mapState('keepAlive', ['isCollapse']),
    ...mapState('user', ['userInfo']),
  },
  methods: {
    onCommand(command) {
      switch (command) {
        case 'logout':
          this.handleLogout();
          break;
      }
    },
    // 退出
    handleLogout() {
      this.$confirm('您将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //退出登录
          // this.$api.user.getLogout().then(() => {
          //   const { VUE_APP_ISC_LOGOUT_ADDRESS, VUE_APP_LOGOUT_ADDRESS } = process.env;
          //   toLoginPage(`${VUE_APP_ISC_LOGOUT_ADDRESS}${VUE_APP_LOGOUT_ADDRESS}`);
          // });
          const { VUE_APP_ISC_LOGOUT_ADDRESS, VUE_APP_LOGOUT_ADDRESS } = process.env;
          toLoginPage(`${VUE_APP_ISC_LOGOUT_ADDRESS}${VUE_APP_LOGOUT_ADDRESS}`);
        })
        // .catch((e) => {
        //   console.error(e);
        // });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/_base.scss';
.wrapper {
  @include flexbox(space-between);
  width: 100%;

  .main {
    @include flexbox();
  }
}
.header-logo {
  @include flexbox();
  color: $--color-white;

  > .login-images {
    @include wh(230px, 40px);
    @include bgImage('../assets/images/new-logo.png');
    margin: 0 20px 0 -20px;
  }
  > .title {
    font-size: 20px;
  }
}
.header-menu {
  @include flexbox();
  padding: 0 10px;

  > li {
    min-width: 80px;
    margin: 0 5px;
  }
  .item {
    ::v-deep {
      .el-badge__content {
        top: 50%;
        border-color: $--color-danger;
      }
    }
  }
  .item-button {
    color: $--color-white;
    font-size: 14px;

    &:hover,
    &:active,
    &:focus {
      background-color: mix($--color-primary, $--color-white, 90%) !important;
    }
  }
  .iconfont {
    color: $--color-white;
  }
}
.user-info {
  color: $--color-white;
  font-size: 14px;

  .dropdown-link {
    @include flexbox(flex-start);
  }
  .user-images {
    @include wh(16px, 16px);
    @include bgImage('../assets/images/user-icon.png');
    margin-right: 5px;
  }
}
</style>
