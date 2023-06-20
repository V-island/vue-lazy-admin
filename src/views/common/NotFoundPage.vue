<template>
  <VcResult status="404" title="404" sub-title="未找到访问页面">
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
        import.meta.env.VUE_APP_ISC_LOGOUT_ADDRESS + import.meta.env.VUE_APP_DEPLOYMENT_ADDRESS;
    },
  },
};
</script>
