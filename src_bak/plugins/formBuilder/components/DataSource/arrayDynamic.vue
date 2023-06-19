<template>
  <div class="array-dynamic-container">
    <div v-for="(item, index) in array" :key="index" class="array-dynamic-item">
      <el-input
        v-model="item.key"
        size="small"
        type="textarea"
        :rows="1"
        autosize
        placeholder="KEY"
      ></el-input>
      <el-input
        v-model="item.value"
        size="small"
        type="textarea"
        :rows="1"
        autosize
        placeholder="VALUE"
      ></el-input>
      <i
        @click="handleRemove(index)"
        style="font-size: 16px; margin: 0 10px; cursor: pointer; color: #f56c6c"
        ><i class="iconfont icon-delete"></i
      ></i>
    </div>
    <el-button type="text" @click="handleAdd"
      ><i class="iconfont icon-plus" style="font-size: 12px; margin: 5px"></i
      >{{ $t('fm.datasource.edit.add') }}</el-button
    >
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      array: this.modelValue,
    }
  },
  methods: {
    handleAdd() {
      this.array.push({ key: '', value: '' })
    },

    handleRemove(index) {
      this.array.splice(index, 1)
    },
  },
  watch: {
    modelValue(val) {
      this.array = val
    },
    array: {
      deep: true,
      handler(val) {
        this.$emit('update:modelValue', val)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.array-dynamic-container {
  .array-dynamic-item {
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 1px dashed #eee;

    .el-textarea:first-child {
      width: 30%;
      margin-right: 6px;
      vertical-align: top;
    }

    .el-textarea:nth-child(2) {
      width: 60%;
      vertical-align: top;
    }

    .el-button {
      vertical-align: top;
      margin-left: 10px;
    }
  }
}
</style>
