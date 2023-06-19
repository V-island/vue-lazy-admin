<template>
  <el-container class="event-script-container">
    <el-aside width="300px" class="event-script-aside">
      <el-container>
        <el-header height="42px">
          <el-button type="text" size="default" @click="handleAdd"
            ><i
              class="iconfont icon-plus"
              style="font-size: 12px; margin: 5px"
            ></i
            >{{ $t('fm.eventscript.config.add') }}</el-button
          >
        </el-header>
        <el-main>
          <el-menu
            class="event-script-aside-menu"
            :default-active="selectKey"
            @select="handleSelect"
          >
            <el-menu-item
              :index="item.key"
              v-for="(item, index) in list"
              :key="item.key"
              :disabled="!saved"
              @click="handleSelect(item.key)"
            >
              <template #title>
                <div>
                  <span class="event-script-menu-i">Function</span>
                  <div class="event-script-menu-label">{{ item.name }}</div>
                  <div class="event-script-menu-action" v-if="index > 0">
                    <i
                      class="iconfont icon-icon_clone"
                      @click.stop="handleClone(index)"
                      :title="$t('fm.tooltip.clone')"
                    ></i>
                    <i
                      class="iconfont icon-trash"
                      @click.stop="handleRemove(index)"
                      :title="$t('fm.tooltip.trash')"
                    ></i>
                  </div>
                </div>
              </template>
            </el-menu-item>
          </el-menu>
        </el-main>
      </el-container>
    </el-aside>
    <el-main class="event-script-main">
      <el-container v-if="selectIndex >= 0">
        <el-header height="42px">
          <div class="event-script-action">
            <el-button
              type="primary"
              size="default"
              @click="handleSave(true)"
              v-if="this.eventType"
              >{{ $t('fm.eventscript.config.confirm') }}</el-button
            >
            <el-button
              type="primary"
              size="default"
              @click="handleSave(false)"
              >{{ $t('fm.eventscript.config.save') }}</el-button
            >
            <el-button size="default" @click="handleCancal">{{
              $t('fm.eventscript.config.cancel')
            }}</el-button>
          </div>
        </el-header>
        <el-main>
          <el-form
            ref="dataForm"
            :model="formData"
            :rules="formRules"
            :label-width="'125px'"
            size="default"
            label-position="left"
            :key="selectKey"
          >
            <el-form-item label="Function Name" prop="name">
              <el-input
                v-model="formData.name"
                :disabled="formData.key == 'mounted'"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="0" prop="func">
              <div class="code-line">Function () {</div>

              <code-editor
                v-model="formData.func"
                mode="javascript"
                height="380px"
              ></code-editor>
              <div class="code-line">}</div>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import CodeEditor from '../CodeEditor/index.vue'

export default {
  components: {
    CodeEditor,
  },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'on-confirm-event'],
  data() {
    return {
      formData: {
        key: '',
        name: '',
        func: '',
      },
      formRules: {
        name: [
          { required: true, message: ' ' },
          {
            validator: (rule, value, callback) => {
              let currentItem = this.historyList.find(
                (item) => item.name == value
              )

              if (currentItem && currentItem.key != this.selectKey) {
                callback(new Error(this.$t('fm.eventscript.message.repeat')))
              } else {
                callback()
              }
            },
          },
        ],
      },
      list: [...this.modelValue],
      selectIndex: -1,
      selectKey: '',
      historyList: [...this.modelValue],
      saved: true,
      eventType: '',
    }
  },
  methods: {
    handleSave(confirm) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.list[
            this.list.findIndex((item) => item.key === this.selectKey)
          ] = this.formData

          this.historyList = [...this.list]

          this.saved = true

          this.$emit('update:modelValue', this.historyList)

          if (confirm) {
            this.$emit('on-confirm-event', {
              ...this.formData,
              type: this.eventType,
            })
          } else {
            this.$message.success(this.$t('fm.eventscript.message.saveSuccess'))
          }
        }
      })
    },

    handleAdd() {
      if (!this.saved) {
        this.$message.warning(this.$t('fm.eventscript.message.saveError'))
        return
      }

      let key = Math.random().toString(36).slice(-8)

      this.list.push({
        key: key,
        name: 'func_' + key,
        func: '',
      })
      this.selectKey = key

      this.saved = false
    },

    loadNewFunction(name) {
      let key = Math.random().toString(36).slice(-8)

      this.list.push({
        key: key,
        name: name + '_' + key,
        func: '',
      })

      this.selectKey = key

      this.saved = false

      this.eventType = name
    },

    loadForm() {
      let currentData = this.list[this.selectIndex]

      this.formData = {
        ...currentData,
      }
    },

    handleSelect(key) {
      if (key === this.selectKey) {
        return
      }
      if (!this.saved) {
        this.$message.warning(this.$t('fm.eventscript.message.saveError'))
        return
      }

      this.selectKey = key
    },

    loadFunction(key, name) {
      this.selectKey = key

      if (name) {
        this.eventType = name
      }
    },

    handleCancal() {
      this.selectKey = ''

      this.list = [...this.historyList]

      this.saved = true
    },

    handleClone(index) {
      if (!this.saved) {
        this.$message.warning(this.$t('fm.eventscript.message.saveError'))
        return
      }
      let currentData = this.list[index]

      let key = Math.random().toString(36).slice(-8)

      let cloneData = {
        ...currentData,
        key,
        name: currentData.name + '_copy',
      }

      this.list.push(cloneData)

      this.selectKey = key

      this.saved = false
    },

    handleRemove(index) {
      let currentData = this.list[index]

      this.$confirm(
        `${this.$t('fm.eventscript.message.confirmRemove')} [${
          currentData.name
        }] ?`,
        '',
        {
          type: 'warning',
        }
      )
        .then(() => {
          if (currentData.key === this.selectKey) {
            this.selectKey = ''
            this.saved = true
          }
          this.list.splice(index, 1)
          if (index < this.historyList.length) {
            this.historyList.splice(index, 1)
          }

          this.$emit('update:modelValue', this.historyList)
        })
        .catch(() => {
          console.log("catch");
        })
    },
  },
  watch: {
    selectKey(val) {
      if (val) {
        this.selectIndex = this.list.findIndex((item) => item.key === val)

        this.loadForm()
      } else {
        this.selectIndex = -1
      }
    },
    modelValue(val) {
      this.historyList = [...val]
      this.list = [...val]
    },
  },
}
</script>

<style lang="scss" scoped>
.event-script-container {
  .event-script-main {
    padding: 0;

    > .el-container {
      display: flex;
      height: 100%;

      > .el-header {
        padding: 5px;
        border-bottom: 1px solid #eee;
        background: #f2f6fc;
      }
    }

    .event-script-action {
      text-align: right;
    }

    .code-line {
      font-size: 14px;
      color: blue;
      font-weight: 500;
    }

    .code-desc {
      margin-left: 2px;
      font-size: 12px;
      color: #999;
    }

    .el-collapse-item {
      border: 1px solid #ebeef5;
    }

    .el-collapse-item__header {
      background: #ebeef5;
      // border: 0;
      height: 36px;
      line-height: 36px;
      padding: 5px;
    }

    .el-collapse-item__wrap {
      border: 0;

      .el-collapse-item__content {
        padding: 5px;
      }
    }
  }

  .event-script-aside {
    border-right: 1px solid #eee;

    > .el-container {
      display: flex;
      height: 100%;

      > .el-main {
        margin: 0;
        padding: 0;
      }

      > .el-header {
        padding: 5px;
        border-bottom: 1px solid #eee;
        background: #f2f6fc;
      }
    }

    .event-script-aside-menu {
      margin: 10px;
      border-right: 0;

      .el-menu-item {
        border: 1px solid #dcdfe6;
        background: #fff;
        border-radius: 3px;
        padding: 10px !important;
        height: auto;
        line-height: 1;
        cursor: default;
        position: relative;

        &.is-disabled {
          opacity: 1;
          cursor: default;
          background: #fff;
        }

        &.is-active {
          background: #e4e7ed;
          color: #303133;
        }

        &.is-active.is-disabled {
          background: #e4e7ed !important;
          color: #303133;
        }

        + .el-menu-item {
          margin-top: 6px;
        }
      }

      .event-script-menu-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        width: 170px;
        margin-left: 50px;
      }

      .event-script-menu-i {
        position: absolute;
        font-size: 12px;
        left: 5px;
        top: 13px;
        width: 45px;
        text-align: center;
        color: #67c23a;
      }

      .event-script-menu-action {
        display: inline-block;
        padding-right: 10px;
        color: #666;
        font-weight: 600;

        > i {
          cursor: pointer;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
