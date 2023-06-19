<template>
  <section>
    <i class="iconfont" @click="handleData">&#xe63a;</i>
    <VcDialog :title="title" :visible="isShow" width="350px" @update:visible="isShow = $event">
      <div class="content" v-if="isShow">
        <div class="item" v-for="(item, index) in lists" :key="index">
          <span>{{ index + 1 }}</span>
          <el-input
            v-model="item.id"
            :maxlength="length"
            placeholder="请输入内容"
            @input="inputOnInput($event)"
          ></el-input>
          <i class="iconfont plus" v-if="lists.length == index + 1" @click="handlePlus">&#xe612;</i>
          <i class="iconfont" v-else @click="handleCancel(index)">&#xe613;</i>
        </div>
      </div>
      <template v-slot:footer>
        <el-button type="primary" plain @click="checkReset">重置</el-button>
        <el-button type="primary" @click="checkSave">确定</el-button>
      </template>
    </VcDialog>
  </section>
</template>

<script>
export default {
  name: 'VcBatchSearch',
  props: {
    value: {},
    title: {
      type: String,
      default: '批量查询',
    },
    length: {
      type: Number,
      default: 10,
    },
    letter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShow: false,
      lists: [],
    };
  },
  methods: {
    inputOnInput() {
      this.$forceUpdate();
    },
    handleData() {
      const rules = this.letter ? /[^a-zA-Z0-9]/gi : /[^0-9]/gi;
      const ids = this.value?.replace(rules, '');
      const array = parseInt(ids?.length / this.length) || 0;
      if (array === 0) return this.$message.warning('请正确输入');
      this.lists = this.interceptF(ids, this.length);
      this.isShow = true;
    },
    //截取方法
    interceptF(str, num) {
      let strArr = [];
      let serArrL = parseInt(str.length / num) || 0;
      if (serArrL === 0) return this.$message.warning('请正确输入');
      for (let i = 0, l = str.length; i < l / num; i++) {
        if (strArr.length < serArrL) {
          let a = str.slice(num * i, num * (i + 1));
          strArr.push({ id: a });
          this.size = strArr.length;
        }
      }
      return strArr;
    },
    // 添加
    handlePlus() {
      this.lists.push({ id: '' });
    },
    // 删除
    handleCancel(index) {
      const newData = [...this.lists];
      newData.splice(index, 1);
      this.lists = newData;
    },
    //保存事件
    checkSave() {
      const rules = this.letter ? /[^a-zA-Z0-9]/gi : /[^0-9]/gi;
      const ids = this.lists.map((item) => item.id?.replace(rules, ''));
      this.$emit('input', ids.join(','));
      this.isShow = false;
    },
    //重置事件
    checkReset() {
      this.lists = [{ id: '' }];
    },
  },
};
</script>

<style lang="scss" scoped>
.section {
  width: 50px;
  height: 50px;
  background: #000;
}
.iconfont {
  font-size: 20px;
  color: #11bbbb;
}
.item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  > span {
    flex: 0 0 15px;
    margin-right: 12px;
  }
  > i {
    flex: 0 0 20px;
    margin-left: 12px;
    cursor: pointer;

    &.plus {
      color: #f56c6c;
    }
  }
}
::v-deep {
  .el-button + .el-button {
    margin-left: 10px !important;
  }
  .el-button--primary {
    color: #fff !important;
    background-color: #11bbbb !important;
    border-color: #11bbbb !important;
    margin: 0 !important;

    &.is-plain {
      color: #11bbbb !important;
      background: #e7f8f8 !important;
      border: 1px solid #a0e4e4 !important;
      display: inline-block;

      &:hover {
        color: #fff !important;
        background-color: #11bbbb !important;
        border-color: #11bbbb !important;
      }
    }
  }
}
</style>
