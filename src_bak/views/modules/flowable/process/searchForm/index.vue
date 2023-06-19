<template>
  <VcForm :model="form" ref="form">
    <el-form-item label="类型" prop="type">
      <el-input v-model="form.type" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <template v-slot:search>
      <el-button type="primary" @click="$emit('search')">查询</el-button>
      <el-button @click="$emit('reset')">重置</el-button>
    </template>
  </VcForm>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      // default: () => {},
    },
  },
  methods: {
    reset() {
      this.$refs.form.resetFields();
    }
  },
};
</script>

<style lang="scss" scoped></style>
