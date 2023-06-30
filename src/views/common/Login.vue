<!--
 * @Author: Allen Li vv15802702853@163.com
 * @Date: 2023-06-21 00:15:10
 * @LastEditors: Allen Li vv15802702853@163.com
 * @LastEditTime: 2023-06-22 01:05:25
 * @FilePath: \lazy-base-template-vue3\src\views\common\Login.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <section class="layout">
    <div class="login-box">
      <div class="title">xxx登录</div>
      <a-form
        name="login"
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        @finish="onFinish"
      >
        <a-form-item
          label="邮箱"
          name="username"
          placeholder="请输入邮箱或手机号"
          :rules="[{ required: true, message: '请输入邮箱或手机号!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item name="remember" :wrapper-col="{ offset: 4, span: 16 }">
          <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 8 }">
          <a-button type="primary" html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { utilFn, awaitWrap } from 'utils';
import { message } from 'ant-design-vue';
import { useAuthStore } from 'store/auth';

const router = useRouter();
const auth = useAuthStore();
const formState = reactive({
  username: '',
  password: '',
  remember: true,
});

/** ============== 基础事件 =============== */
// 登录事件
const onFinish = async (values) => {
  utilFn._showPageLoading();
  // 登录获取用户信息、角色、菜单等数据
  const [err, data] = await awaitWrap(auth.loginByEmailToToken(values));
  utilFn._hidePageLoading();

  if (err || !data.result) return message.error(err || data.message);

  message.success(data.message);
  router.push({
    name: 'home',
  });
};

/** ============== 数据请求 =============== */
</script>

<style lang="scss" scoped>
.layout {
  @include flexbox();
  height: 100vh;
}
.login-box {
  padding: 20px;
  width: 400px;
  height: 300px;
  background-color: $--color-white;
  .title {
    font-size: 24px;
    margin-bottom: 10px;
    text-align: center;
  }
}
</style>
