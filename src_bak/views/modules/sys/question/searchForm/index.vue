<template>
  <VcForm :model="form" ref="form">
    <el-form-item label="问题类型" prop="questionType">
      <el-select v-model="form.questionType" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in getQuestionType"
          :key="item.code"
          :label="item.message"
          :value="item.code"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="问题编码" prop="uniqueCode">
      <el-input v-model="form.uniqueCode" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item label="应用名称" prop="applicationName">
      <el-input v-model="form.applicationName" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item label="菜单名称" prop="menuName">
      <el-input v-model="form.menuName" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item label="菜单地址" prop="menuUrl">
      <el-input v-model="form.menuUrl" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item label="问题标题" prop="questionTitle">
      <el-input v-model="form.questionTitle" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <template v-slot:search>
      <el-button type="primary" @click="$emit('search')">查询</el-button>
      <el-button @click="$emit('reset')">重置</el-button>
    </template>
  </VcForm>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    form: {
      type: Object,
      // default: () => {},
    },
  },
  computed: {
    ...mapGetters('cache', ['getQuestionType']),
  },
  methods: {
    resetFields() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped></style>
