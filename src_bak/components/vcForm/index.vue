<template>
  <el-form
    ref="form"
    :model="model"
    :rules="rules"
    :inline="inline"
    :size="size"
    :label-position="labelPosition"
    :label-width="labelWidth"
  >
    <div class="content" :class="inline || 'search'">
      <slot></slot>
      <slot name="hide" v-if="isShow"></slot>
      <div class="search-group" v-if="$slots.search">
        <slot name="search"></slot>
      </div>
    </div>
    <el-row :gutter="20" v-if="$slots.button">
      <el-col :span="24">
        <div class="button-group">
          <slot name="button"></slot>
          <el-button type="primary" v-if="$slots.hide" @click="isShow = !isShow" plain>
            {{ isShow ? '收起' : '展开' }}更多
            <el-icon v-if="isShow"><ElIconArrowUp /></el-icon>
            <el-icon v-else><ElIconArrowDown /></el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { ArrowUp as ElIconArrowUp, ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue';
export default {
  name: 'VcForm',
  props: {
    // 表单数据对象
    model: {
      type: Object,
      // default: () => {},
    },
    rules: {
      type: Object,
      // default: () => {},
    },
    // 表单域标签的宽度
    labelWidth: {
      type: String,
      default: '100px',
    },
    // 表单域标签的位置
    labelPosition: {
      type: String,
      default: 'right',
    },
    // 横向格式化
    inline: {
      type: Boolean,
      default: false,
    },
    size: { type: String, default: 'default' },
  },
  components: {
    ElIconArrowUp,
    ElIconArrowDown,
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    validate(cb) {
      return this.$refs.form.validate(cb);
    },
    resetFields() {
      return this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.search-group {
  text-align-last: left;
  margin-left: 15px;
  margin-bottom: 18px;

  ::v-deep .el-button {
    padding: 8px 20px;
  }
}

.button-group {
  text-align: center;
  margin-bottom: 18px;
}

::v-deep {
  .search {
    .el-form-item {
      width: 350px;
      flex: 0 0 350px;
      margin-bottom: 22px !important;
    }
  }
  // .el-form-item {
  //   margin-bottom: 10px !important;
  // }
  .el-input-group__prepend {
    border-bottom-left-radius: 0;
    padding: 3px 8px;
    border: none;
  }
  .el-input-group__append {
    border-bottom-left-radius: 0;
    padding: 3px 8px;
    border: none;
  }
  .el-date-editor,
  .el-date-editor,
  .el-range-editor,
  .el-radio-group,
  .el-select,
  .el-cascader,
  .el-input {
    width: 100% !important;
  }
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 9px 15px;
  }
  .form-inline {
    .el-form-item {
      width: 350px;
      margin-bottom: 20px !important;
      &.block {
        width: 100%;
      }
    }
    .el-form-item__content {
      width: calc(100% - 110px);
    }
    .el-radio.is-bordered {
      margin-right: 0;
    }
  }
}
</style>
