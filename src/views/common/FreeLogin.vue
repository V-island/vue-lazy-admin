<template>
  <section class="container">
    <div class="login-box">
      <h2 class="title">登录</h2>
      <el-form class="login-form" ref="login" :model="form">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" type="text" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button class="login-button" type="primary" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'freeLogin',
  data() {
    return {
      form: {
        username: 'admin',
        password: 'admin',
      },
    };
  },
  methods: {
    async loadData() {
      const { username } = this.form;
      // 登录获取用户信息、角色、菜单等数据
      let [err, data] = await this._awaitWrap(
        this.$store.dispatch('user/userLocalLoginByUserName', username),
      );

      if (err || !data.result) {
        console.error('登录获取用户信息、角色、菜单等数据失败：', err || data);
      } else {
        this.$router.push('/flowable/process/ModelList');
      }
    },
    submitForm() {
      this.$refs['login'].validate((valid) => {
        if (valid) this.loadData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
}
.login-box {
  width: 350px;
  margin: auto;

  .title {
    text-align: center;
    margin-bottom: 20px;
    font-weight: 400;
    font-size: 2rem;
  }
}
.login-form {
  background-color: #fff;
  padding: 30px 30px 20px;
  border-radius: 5px;
}
.login-button {
  width: 100%;
  margin-top: 20px;
}
</style>
