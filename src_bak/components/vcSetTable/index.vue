<template>
  <section>
    <i class="iconfont" @click="formClick">&#xe616;</i>
    <VcDialog
      :title="'设置表头'"
      :visible="formShow"
      width="70%"
      @update:visible="formShow = $event"
    >
      <div class="content">
        <section v-for="(item, index) in items" :key="index">
          <el-checkbox-button
            @change="handleCheckedChange(item, index)"
            v-model="item.isChecked"
            :style="{ marginLeft: index % 5 == 0 ? '0' : '12px' }"
            >{{ item.label }}</el-checkbox-button
          >
        </section>
      </div>
      <template v-slot:footer>
        <el-button type="primary" plain @click="checkReset">重置</el-button>
        <el-button type="primary" @click="checkSave">确定</el-button>
      </template>
    </VcDialog>
  </section>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'VcSetTable',
  props: {
    // 显示列头总数
    listItems: {
      type: Array,
      default: () => [],
    },
    //默认选择的列数
    checkItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      items: [], // 所有可勾选项，用作列表展示
      tempItems: [], // 储存用作恢复功能
      realItems: [], // 勾选数据
      formShow: false,
      mark: 0,
    };
  },
  watch: {
    listItems: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.items = this?.listItems; // 用作列表展示
          console.log('this?.listItems :>> ', this?.listItems);
          if (!this?.realItems[0]) {
            // 第一次进行表格设置
            const checkedList = [];
            this.items.forEach((p) => {
              if (this.checkItems.includes(p.prop)) {
                p.isChecked = true;
                checkedList.push(p);
              } else {
                p.isChecked = false;
              }
            });
            this.tempItems = _.cloneDeep(checkedList); // 储存用作恢复功能
            this.realItems = _.cloneDeep(checkedList); // 真实选择项， 用作保存
          }
        }
      },
    },
  },
  created() {
    this.mark = 0;
  },
  methods: {
    formClick() {
      this.formShow = true;
    },
    //勾选事件
    handleCheckedChange(item) {
      console.log('handleCheckedChange :>> ', item);
      this.items.forEach((e) => {
        if (e.label == item.label) {
          e.isChecked = item.isChecked;
        }
      });
      this.realItems = this?.listItems.filter((p) => p.isChecked);
      this.mark = 1;
    },
    //保存事件
    checkSave() {
      this.formShow = false;
      this.$emit('saveList', this?.realItems, this.mark);
      // this.$refs.dropdownSet.hide()
    },
    //重置事件
    checkReset() {
      this.items = this?.listItems;
      this.tempItems = _.cloneDeep(this.tempItems);
      this.items.forEach((m) => {
        m.isChecked = this.tempItems.findIndex((p) => p.label == m.label) == -1;
      });
      this.realItems = this.items;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.iconfont {
  color: #11bbbb;
  font-size: 18px;
  cursor: pointer;
}
::v-deep {
  .el-checkbox-button {
    font-size: 14px;
    margin-bottom: 12px;
    width: calc(100% / 5 - 12px);

    &.is-checked {
      .el-checkbox-button__inner {
        color: #11bbbb !important;
        border: 1px solid #11bbbb !important;
        background-color: transparent;
        box-shadow: none;
      }
    }
    &.is-focus,
    &.is-focus:hover {
      .el-checkbox-button__inner {
        color: #333;
        border: 1px solid #ccc;
      }
    }
    &:hover {
      .el-checkbox-button__inner {
        // border: 1px solid #11bbbb;
        color: #11bbbb;
      }
    }
  }
  .el-checkbox-button__inner {
    color: #333;
    border: 1px solid #ccc;
    height: 40px;
    line-height: 40px;
    padding: 0 15px !important;
    border-radius: 5px !important;
    width: 100%;
    font-size: 14px !important;

    /*强制文字在一行文本框内*/
    white-space: nowrap;
    /*溢出部分文字隐藏*/
    overflow: hidden;
    /*溢出部分省略号处理*/
    text-overflow: ellipsis;
  }
}
</style>
