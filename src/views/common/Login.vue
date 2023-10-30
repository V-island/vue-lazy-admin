<template>
  <section class="layout">
    <div class="logo">
      <img class="logo-img" alt="logo" src="~@/assets/images/logo.svg" />
      <div class="logo-text">
        <span>{{ common.documentTitle }}</span>
      </div>
    </div>
    <div class="content">
      <div class="content-inner">
        <div class="login-form-wrapper">
          <div class="login-form-images">
            <img src="~@/assets/images/logo.svg" :alt="common.documentTitle" />
          </div>
          <div class="login-form-title">登录</div>
          <div class="login-form-sub-title">欢迎登录{{ common.documentTitle }}</div>
          <a-form name="login" :model="formState" autocomplete="off" @finish="onFinish">
            <a-form-item name="userId" :rules="[{ required: true, message: '请输入您的用户名!' }]">
              <a-input v-model:value="formState.userId" placeholder="请输入您的用户名">
                <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input>
            </a-form-item>

            <a-form-item name="passWord" :rules="[{ required: true, message: '请输入您的密码!' }]">
              <a-input-password
                v-model:value="formState.passWord"
                placeholder="请输入您的密码"
                autocomplete="off"
              >
                <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input-password>
            </a-form-item>

            <a-form-item>
              <a-button class="login-submit" type="primary" html-type="submit">登录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
    <div class="footer">
      <a-row :gutter="[16, 16]">
        <a-col :span="24">
          <div class="icp">
            <a href="https://beian.miit.gov.cn" target="_blank">粤ICP备2022114741号-1</a>
            LazyMeta 懒人星球 © 2020~2021版权所有
          </div>
        </a-col>
      </a-row>
    </div>
  </section>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { utilFn, awaitWrap } from 'utils';
import { message } from 'ant-design-vue';
import { useAuthStore } from 'store/auth';
import { commonStore } from 'store/common';

const router = useRouter();
const auth = useAuthStore();
const common = commonStore();
const formState = reactive({
  userId: '',
  passWord: '',
});

// 初始化
const initLoadData = () => {};
/** ============== 基础事件 =============== */
// 登录事件
const onFinish = async (values) => {
  utilFn._showPageLoading();
  // 登录获取用户信息、角色、菜单等数据
  const [err, data] = await awaitWrap(auth.loginByUserNameToToken(values));
  utilFn._hidePageLoading();

  if (err || !data.result) return message.error(err || data.message);

  message.success(data.message);
  router.push({
    name: 'topology',
  });
};

/** ============== 数据请求 =============== */
onMounted(() => {
  initLoadData();
});
</script>

<style lang="scss" scoped>
.layout {
  @include flexbox(center, center, center, column);
  @include bgImage('assets/images/login/login_bg.webp', cover);
  background-color: #fff;
  height: 100vh;
}
.content-inner {
  @include flexbox(center, center, center, column);
  padding: 70px 29px 58px;
  width: 428px;
  min-height: 300px;
  background-color: $--color-white;
  position: relative;
  box-shadow: 0 0 20px -5px rgba(60, 112, 204, 0.12), 0 0 20px -5px rgba(60, 112, 204, 0.12);
}
.footer {
  position: fixed;
  bottom: 32px;
  left: 0;
  z-index: 1;
  width: 100%;
  display: inline-flex;
  align-items: center;
  flex-direction: column;
}
.logo {
  position: fixed;
  top: 32px;
  left: 40px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  &-text {
    margin-right: 4px;
    margin-left: 4px;
    color: #f7f8fa;
    font-size: 20px;
    font-size: 32px;
    color: $--color-primary;
    font-weight: 700;
    transition: all 0.5s;
    font-family: 'PangMenZhengDao';
    font-style: normal;
    font-weight: 400;
    font-size: 38.016px;
    line-height: 43px;
    color: #282828;
  }
  &-img {
    width: 38px;
    height: 38px;
  }
}
.login-form {
  &-wrapper {
    width: 320px;
    padding-top: 36px;
  }

  &-images {
    @include wh(32px, 36px);
    position: absolute;
    top: 24px;
    right: 24px;
    > img {
      @include wh(100%, 100%);
    }
  }

  &-title {
    font-family: 'Alibaba PuHuiTi';
    font-style: normal;
    font-size: 24px;
    line-height: 44px;
    color: #000;
    font-weight: 500;
    text-align: left;
    margin-bottom: 20px;
    position: relative;

    &::after {
      content: '';
      width: 16px;
      height: 4px;
      background: linear-gradient(to right, $--color-primary, $--color-primary-hover);
      position: absolute;
      left: 5px;
      bottom: -8px;
    }
  }

  &-sub-title {
    font-size: 14px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 20px;
  }
}
:deep(.ant-form) {
  .login-submit {
    width: 100%;
    background: linear-gradient(to right, $--color-primary, $--color-primary-hover);
    margin-top: 17px;
    height: 40px;
    border: none;
    &:hover {
      background: linear-gradient(to right, $--color-primary, $--color-primary-hover);
    }
  }
}
</style>
