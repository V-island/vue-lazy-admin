<template>
  <div>
    <el-form label-position="top">
      <el-form-item v-if="show" :label="`${$t('fm.config.list.attribute')} (字段)`">
        <el-checkbox
          v-model="data.options.isShow"
          v-if="data && data.options && Object.keys(data.options).indexOf('isShow') >= 0"
          >{{ $t('fm.config.list.isShow') }}
        </el-checkbox>
        <el-checkbox
          v-model="data.options.isSort"
          v-if="data && data.options && Object.keys(data.options).indexOf('isSort') >= 0"
          >{{ $t('fm.config.list.isSort') }}
        </el-checkbox>
        <el-checkbox
          v-model="data.options.isSearch"
          v-if="data && data.options && Object.keys(data.options).indexOf('isSearch') >= 0"
          >{{ $t('fm.config.list.isSearch') }}
        </el-checkbox>
      </el-form-item>
      <el-form-item label="跳转配置（全局）">
        <draggable
          tag="ul"
          :list="widgetForm.config.actions"
          v-bind="{
            group: { name: 'options' },
            ghostClass: 'ghost',
            handle: '.drag-item',
          }"
          handle=".drag-item"
        >
          <template #item="{ element, index }">
            <li :key="index">
              <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move"
                ><i class="iconfont icon-icon_bars"></i>
              </i>

              <div style="display: inline-block">
                <div style="display: flex; flex-direction: column; margin: 0 10px 10px 10px">
                  <span>
                    {{ element.name }}
                  </span>
                </div>
              </div>

              <el-button
                @click="edit(index)"
                circle
                plain
                type="primary"
                size="small"
                :icon="ElIconEdit"
                style="margin-left: 5px"
              ></el-button>
              <el-button
                @click="handleOptionsRemove(index)"
                circle
                plain
                type="danger"
                size="small"
                :icon="ElIconMinus"
                style="margin-left: 10px"
              ></el-button>
            </li>
          </template>
        </draggable>
        <div style="margin-left: 22px">
          <el-button type="text" @click="handleAddColumn">添加链接</el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      append-to-body
      v-model="visible"
      draggable
    >
      <el-form :model="inputForm" ref="inputForm" label-width="120px">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-form-item label="按钮名称" prop="name" :rules="[]">
              <el-input v-model="inputForm.name" placeholder="请填写按钮名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="链接" prop="link" :rules="[]">
              <el-input
                v-model="inputForm.link"
                placeholder="请填写链接, 外部URL请用'http://'或者'https://开头，内部路由用'/'开头"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参数名" prop="paramKey" :rules="[]">
              <el-input v-model="inputForm.paramKey" placeholder="请填写参数名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参数值" prop="paramValue" :rules="[]">
              <el-input
                v-model="inputForm.paramValue"
                placeholder="常量可以直接传参，支持通过el表达式（例如:${row.id}) 获取数据行的属性作为动态参数"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="按钮显示位置" prop="position" :rules="[]">
              <el-checkbox-group v-model="inputForm.position">
                <el-checkbox label="1">工具栏</el-checkbox>
                <el-checkbox label="2">操作列</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="权限标志" prop="auth" :rules="[]">
              <el-input
                v-model="inputForm.auth"
                placeholder="如果要控制是否显示按钮，请填写权限标志，并在菜单中配置权限规则，然后在角色中进行授权。"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false" :icon="ElIconCircleClose">关闭</el-button>
          <el-button type="primary" @click="doSubmit()" :icon="ElIconCircleCheck" v-noMoreClick
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  Edit as ElIconEdit,
  Minus as ElIconMinus,
  CircleClose as ElIconCircleClose,
  CircleCheck as ElIconCircleCheck,
} from '@element-plus/icons-vue';
import Draggable from 'vuedraggable';
export default {
  data() {
    return {
      visible: false,
      method: '',
      title: '',
      currentIndex: 0,
      inputForm: {
        name: '',
        link: '',
        paramKey: '',
        paramValue: '',
        position: [],
      },
      ElIconEdit,
      ElIconMinus,
      ElIconCircleClose,
      ElIconCircleCheck,
    };
  },
  components: {
    Draggable,
    // CodeEditor,
  },
  props: {
    data: {
      type: Object,
      // default: () => {},
    },
    widgetForm: {
      type: Object,
      // default: () => {},
    },
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    handleAddColumn() {
      this.method = 'add';
      this.visible = true;
      this.title = '添加按钮';
      this.inputForm = {
        name: '',
        link: '',
        paramKey: '',
        paramValue: '',
        position: [],
      };
    },
    handleOptionsRemove(index) {
      this.widgetForm.config.actions.splice(index, 1);
    },
    doSubmit() {
      if (this.method === 'add') {
        this.widgetForm.config.actions.push(this.inputForm);
      } else {
        this.widgetForm.config.actions.splice(this.currentIndex, 1, this.inputForm);
      }
      this.visible = false;
    },
    edit(index) {
      this.visible = true;
      this.currentIndex = index;
      this.method = 'edit';
      this.title = '修改按钮';
      this.inputForm = this.widgetForm.config.actions[index];
    },
  },
};
</script>
