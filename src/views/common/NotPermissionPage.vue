<template>
  <VcResult status="403" title="403" sub-title="该账户访问无权限，请重新登录">
    <template v-slot:extra>
      <el-button @click="handleBackLogin">重新登录</el-button>
    </template>
  </VcResult>
</template>

<script>
export default {
  methods: {
    // 重新登录
    handleBackLogin() {
      window.locationRef.href =
        process.env.VUE_APP_ISC_LOGOUT_ADDRESS + process.env.VUE_APP_DEPLOYMENT_ADDRESS;
    },
  },
};
</script>
