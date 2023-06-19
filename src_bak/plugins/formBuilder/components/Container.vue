<template>
  <el-container class="fm2-container fm-form" :class="'fm-' + formKey">
    <el-main class="fm2-main">
      <el-container>
        <el-aside width="250px">
          <div class="components-list">
            <template v-if="basicFields.length">
              <div class="widget-cate">
                {{ $t('fm.components.basic.title') }}
              </div>
              <draggable
                tag="ul"
                :list="basicComponents"
                :group="{ name: 'people', pull: 'clone', put: false }"
                :sort="false"
                ghost-class="ghost"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
                item-key="name"
              >
                <template #item="{ element }">
                  <li
                    @click="handleField(element)"
                    v-if="basicFields.indexOf(element.type) >= 0"
                    class="form-edit-widget-label"
                    :class="{ 'no-put': element.type == 'divider' }"
                  >
                    <a>
                      <i class="icon iconfont" :class="element.icon"></i>
                      <span>{{ element.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>

            <template v-if="advanceFields.length">
              <div class="widget-cate">
                {{ $t('fm.components.advance.title') }}
              </div>
              <draggable
                tag="ul"
                :list="advanceComponents"
                :group="{ name: 'people', pull: 'clone', put: false }"
                :sort="false"
                ghost-class="ghost"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
                item-key="name"
              >
                <template #item="{ element }">
                  <li
                    @click="handleField(element)"
                    v-if="advanceFields.indexOf(element.type) >= 0"
                    class="form-edit-widget-label"
                    :class="{ 'no-put': element.type == 'table' }"
                  >
                    <a>
                      <i class="icon iconfont" :class="element.icon"></i>
                      <span>{{ element.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>

            <template v-if="layoutFields.length">
              <div class="widget-cate">
                {{ $t('fm.components.layout.title') }}
              </div>
              <draggable
                tag="ul"
                :list="layoutComponents"
                :group="{ name: 'people', pull: 'clone', put: false }"
                :sort="false"
                ghost-class="ghost"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
                item-key="name"
              >
                <template #item="{ element }">
                  <li
                    @click="handleField(element)"
                    v-if="layoutFields.indexOf(element.type) >= 0"
                    class="form-edit-widget-label no-put"
                  >
                    <a>
                      <i class="icon iconfont" :class="element.icon"></i>
                      <span>{{ element.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>

            <template v-if="customFields.length">
              <div class="widget-cate">
                {{ $t('fm.components.custom.title') }}
              </div>
              <draggable
                tag="ul"
                :list="customComponents"
                :group="{ name: 'people', pull: 'clone', put: false }"
                :sort="false"
                ghost-class="ghost"
                @end="handleMoveEnd"
                @start="handleMoveStart"
                :move="handleMove"
                item-key="name"
              >
                <template #item="{ element }">
                  <li @click="handleField(element)" class="form-edit-widget-label">
                    <a>
                      <i class="icon iconfont" :class="element.icon"></i>
                      <span>{{ element.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>
          </div>
        </el-aside>
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px">
            <div class="btn-bar-plat">
              <a :class="{ active: platform == 'pc' }" @click="handlePlatform('pc')"
                ><i class="iconfont icon-pc"></i
              ></a>
              <a :class="{ active: platform == 'pad' }" @click="handlePlatform('pad')"
                ><i class="iconfont icon-pad"></i
              ></a>
              <a :class="{ active: platform == 'mobile' }" @click="handlePlatform('mobile')"
                ><i class="iconfont icon-mobile"></i
              ></a>
            </div>
            <div class="btn-diviler"></div>
            <div class="btn-bar-action">
              <el-tooltip :content="$t('fm.actions.undo')" placement="bottom">
                <a @click="handleUndo" :class="{ disabled: !undo }"
                  ><i class="iconfont icon-007caozuo_chexiao"></i
                ></a>
              </el-tooltip>
              <el-tooltip :content="$t('fm.actions.redo')" placement="bottom">
                <a @click="handleRedo" :class="{ disabled: !redo }"
                  ><i class="iconfont icon-8zhongzuo"></i
                ></a>
              </el-tooltip>
            </div>
            <slot name="action"> </slot>

            <el-button v-if="upload" type="text" size="default" @click="handleUpload"
              ><i
                class="iconfont icon-daoru"
                style="font-size: 16px; font-weight: 600; margin: 5px"
              />{{ $t('fm.actions.import') }}</el-button
            >
            <el-button v-if="clearable" type="text" size="default" @click="handleClear"
              ><i
                class="iconfont icon-qingkong"
                style="font-size: 16px; font-weight: 600; margin: 5px"
              />{{ $t('fm.actions.clear') }}</el-button
            >
            <el-button v-if="preview" type="text" size="default" @click="handlePreview"
              ><i
                class="iconfont icon-icon_yulan"
                style="font-size: 16px; font-weight: 600; margin: 5px"
              />{{ $t('fm.actions.preview') }}</el-button
            >
            <el-button v-if="generateJson" type="text" size="default" @click="handleGenerateJson"
              ><i
                class="iconfont icon-json1"
                style="font-size: 16px; font-weight: 600; margin: 5px"
              />{{ $t('fm.actions.json') }}</el-button
            >
            <el-button v-if="generateCode" type="text" size="default" @click="handleGenerateCode"
              ><i
                class="iconfont icon-daimakuai"
                style="font-size: 16px; font-weight: 600; margin: 5px"
              />{{ $t('fm.actions.code') }}</el-button
            >
          </el-header>
          <el-main :class="{ 'widget-empty': widgetForm.list.length == 0 }">
            <!--jeeplus-->
            <widget-form
              v-if="!resetJson"
              ref="widgetForm"
              :bindDataTable="bindDataTable"
              :ds="ds"
              :tableName="tableName"
              :data="widgetForm"
              v-model:select="widgetFormSelect"
              :platform="platform"
              :form-key="formKey"
            ></widget-form>
          </el-main>
        </el-container>

        <el-aside class="widget-config-container">
          <el-container>
            <el-header height="45px">
              <div
                class="config-tab"
                :class="{ active: configTab == 'widget' }"
                @click="handleConfigSelect('widget')"
              >
                {{ $t('fm.config.widget.title') }}
              </div>
              <div
                class="config-tab"
                :class="{ active: configTab == 'form' }"
                @click="handleConfigSelect('form')"
              >
                {{ $t('fm.config.form.title') }}
              </div>
              <!--jeeplus-->
              <div
                class="config-tab"
                v-if="tabList"
                :class="{ active: configTab == 'list' }"
                @click="handleConfigSelect('list')"
              >
                {{ $t('fm.config.list.title') }}
              </div>
            </el-header>
            <el-main class="config-content">
              <widget-config
                v-show="configTab == 'widget'"
                ref="widgetConfig"
                :platform="platform"
                :sheets="styleSheetsArray"
                :datasources="dataSourceArray"
                :eventscripts="eventScriptArray"
                :bindDataTable="bindDataTable"
                :mainTable="tableName"
                :widgetForm="widgetForm"
                :data="widgetFormSelect"
                :key="widgetFormSelect ? widgetFormSelect.key : 0"
                @on-event-add="handleEventAdd"
                @on-event-edit="handleEventEdit"
                @on-event-remove="handleEventRemove"
                :form-key="formKey"
              ></widget-config>
              <form-config
                v-show="configTab == 'form'"
                ref="formConfig"
                :sheets="styleSheetsArray"
                :data="widgetForm.config"
                @on-style-update="onStyleUpdate"
                @on-datasource-update="onDataSourceUpdate"
                @on-eventscript-update="onEventScriptUpdate"
                @on-eventscript-confirm="onEventScriptConfirm"
                :form-key="formKey"
              ></form-config>
              <!--jeeplus-->
              <list-config
                v-show="configTab == 'list'"
                :widgetForm="widgetForm"
                :data="widgetFormSelect"
              ></list-config>
            </el-main>
          </el-container>
        </el-aside>

        <preview-dialog ref="previewDialog" @get-data-success="preivewGetData"></preview-dialog>

        <import-json-dialog ref="importJsonDialog" @load-json="handleLoadJson"></import-json-dialog>

        <cus-dialog
          :visible="jsonVisible"
          @on-close="jsonVisible = false"
          ref="jsonPreview"
          width="800px"
          form
          :title="$t('fm.actions.json')"
        >
          <code-editor height="400px" mode="json" v-model="jsonTemplate"></code-editor>

          <template #action>
            <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">{{
              $t('fm.actions.copyData')
            }}</el-button>
            <el-button type="primary" @click="handleExportJSON">{{
              $t('fm.actions.export')
            }}</el-button>
          </template>
        </cus-dialog>

        <cus-dialog
          :visible="codeVisible"
          @on-close="codeVisible = false"
          ref="codePreview"
          width="800px"
          form
          :title="$t('fm.actions.code')"
        >
          <el-tabs type="border-card" style="box-shadow: none" v-model="codeActiveName">
            <el-tab-pane label="Vue Component" name="vue">
              <code-editor height="450px" mode="html" v-model="vueTemplate"></code-editor>
            </el-tab-pane>
            <el-tab-pane label="HTML" name="html">
              <code-editor height="450px" mode="html" v-model="htmlTemplate"></code-editor>
            </el-tab-pane>
          </el-tabs>

          <template #action>
            <el-button type="primary" class="code-btn" :data-clipboard-text="codeCopyValue">{{
              $t('fm.actions.copyData')
            }}</el-button>
            <el-button type="primary" @click="handleExport">{{
              $t('fm.actions.export')
            }}</el-button>
          </template>
        </cus-dialog>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import Draggable from 'vuedraggable/src/vuedraggable';
import WidgetConfig from './WidgetConfig.vue';
import ListConfig from './ListConfig';
import FormConfig from './FormConfig.vue';
import WidgetForm from './WidgetForm.vue';
import CusDialog from './CusDialog.vue';
import ClipboardJS from 'clipboard';
import CodeEditor from './CodeEditor/index.vue';
import { basicComponents, layoutComponents, advanceComponents } from './componentsConfig.js';
import { updateStyleSheets, splitStyleSheets, splitSheetName } from '../util/index.js';
import { EventBus } from '../util/event-bus.js';
import generateCode from './generateCode.js';
import historyManager from '../util/history-manager.js';
import _ from 'lodash';
import { UpgradeData } from '../util/version-upgrade';
import PreviewDialog from './PreviewDialog.vue';
import ImportJsonDialog from './ImportJson/dialog.vue';

export default {
  name: 'fm-making-form',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    ListConfig, //jeeplus
    WidgetForm,
    CusDialog,
    CodeEditor,
    PreviewDialog,
    ImportJsonDialog,
  },
  props: {
    //jeeplus begin
    ds: {
      type: Object,
      // default: () => {},
    },
    tableName: {
      type: String,
      default: '',
    },
    uploadPath: {
      type: String,
      default: '',
    },
    tabList: {
      type: Boolean,
      default: false,
    },
    bindDataTable: {
      type: Boolean,
      default: false,
    },
    // jeeplus end
    preview: {
      type: Boolean,
      default: false,
    },
    generateCode: {
      type: Boolean,
      default: false,
    },
    generateJson: {
      type: Boolean,
      default: false,
    },
    upload: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    basicFields: {
      type: Array,
      default: () => [
        'input',
        'textarea',
        'number',
        'radio',
        'checkbox',
        'time',
        'date',
        'rate',
        'color',
        'select',
        'switch',
        'slider',
        'text',
        'html',
        'button',
        'link',
        'cascader',
        'treeselect',
        'steps',
        'transfer',
      ],
    },
    advanceFields: {
      type: Array,
      default: () => [
        'blank',
        'component',
        'fileupload',
        'imgupload',
        'editor',
        'table',
        'user',
        'role',
        'office',
        'area',
        'dict',
      ], // jeeplus
    },
    layoutFields: {
      type: Array,
      default: () => ['grid', 'report', 'tabs', 'inline', 'divider', 'alert'],
    },
    customFields: {
      type: Array,
      default: () => [],
    },
    globalConfig: {
      type: Object,
      default: () => ({}),
    },
    fieldConfig: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: '',
    },
    cache: {
      type: Boolean,
      default: false,
    },
    jsonTemplates: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['ready'],
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      customComponents: [],
      resetJson: false,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'default',
          customClass: '',
          ui: 'element',
          layout: 'horizontal',
          actions: [], //jeeplus 定制
          width: '100%',
          hideLabel: false,
          hideErrorMessage: false,
        },
      },
      configTab: 'form',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      blank: '',
      htmlTemplate: '',
      jsonTemplate: '',
      vueTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      codeCopyValue: '',
      codeClipboard: null,
      codeActiveName: 'vue',
      undo: false,
      redo: false,
      formKey: Math.random().toString(36).slice(-8),
      styleSheetsArray: [],
      dataSourceArray: [],
      eventScriptArray: [],
      platform: 'pc',
    };
  },
  created() {
    //jeeplus
    // 从高级组件开始数，第三个和第四个是文件上传和图片上传
    advanceComponents[2].options.action = this.uploadPath;
    advanceComponents[3].options.action = this.uploadPath;
    this._loadComponents();
  },
  provide() {
    return {
      changeConfigTab: this.changeConfigTab,
    };
  },
  mounted() {
    const _this = this;

    historyManager.clear().then(() => {
      // 添加表单默认事件
      this.widgetForm.config.eventScript = [{ key: 'mounted', name: 'mounted', func: '' }];

      // 加载全局配置项
      this.widgetForm.config = {
        ...this.widgetForm.config,
        ...this.globalConfig,
      };

      this.platform = this.widgetForm.config.platform || 'pc';

      this.initConfig();

      this.cache && this.setJSON(localStorage.getItem('fmjson' + this.name) ?? this.widgetForm);

      this.$emit('ready');

      EventBus.$on('on-history-add-' + this.formKey, () => {
        historyManager
          .add(
            this.widgetForm,
            this.widgetFormSelect && this.widgetFormSelect.key ? this.widgetFormSelect.key : '',
          )
          .then(() => {
            _this.undo = true;
            _this.redo = false;
          });

        this.saveJsonCache();
      });

      this.$refs.widgetForm.$el.addEventListener('contextmenu', (e) => {
        // e.preventDefault()
      });

      window.onbeforeunload = (e) => {
        this.saveJsonCache();
      };
    });
  },
  beforeUnmount() {
    EventBus.$off('on-history-add-' + this.formKey);

    this.saveJsonCache();
  },
  methods: {
    saveJsonCache() {
      this.cache && localStorage.setItem('fmjson' + this.name, JSON.stringify(this.widgetForm));
    },
    removeJsonCache() {
      localStorage.setItem('fmjson' + this.name, JSON.stringify(this.widgetForm));
    },
    initConfig() {
      this.platform = this.widgetForm.config.platform || 'pc';

      if (this.widgetForm.config.styleSheets) {
        this.onStyleUpdate(splitStyleSheets(this.widgetForm.config.styleSheets));
      }

      if (this.widgetForm.config.dataSource) {
        this.onDataSourceUpdate(this.widgetForm.config.dataSource);
      }

      if (this.widgetForm.config.eventScript) {
        this.onEventScriptUpdate(this.widgetForm.config.eventScript);
      }
    },
    handleGoGithub() {
      window.location.href = 'https://github.com/GavinZhuLei/vue-form-making';
    },
    handleConfigSelect(value) {
      this.configTab = value;
    },
    handleMoveEnd(evt) {
      console.log("handleMoveEnd");
    },
    handleMoveStart({ oldIndex }) {
      console.log("handleMoveStart");
    },
    handleMove() {
      return true;
    },
    handlePreview() {
      this.$refs.previewDialog.preview(_.cloneDeep(this.widgetForm), this.platform);
    },
    preivewGetData(data) {
      this.jsonVisible = true;
      this.jsonTemplate = data;
      this.$nextTick(() => {
        if (!this.jsonClipboard) {
          this.jsonClipboard = new ClipboardJS(document.getElementsByClassName('json-btn')[0]);
          this.jsonClipboard.on('success', (e) => {
            this.$message.success(this.$t('fm.message.copySuccess'));
          });
        }
        this.jsonCopyValue = JSON.stringify(data);
      });
    },
    handleGenerateJson() {
      this.jsonVisible = true;
      this.jsonTemplate = this.widgetForm;
      this.$nextTick(() => {
        if (!this.jsonClipboard) {
          this.jsonClipboard = new ClipboardJS(document.getElementsByClassName('json-btn')[0]);
          this.jsonClipboard.on('success', (e) => {
            this.$message.success(this.$t('fm.message.copySuccess'));

            e.clearSelection();
          });
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm);
      });
    },
    handleGenerateCode() {
      this.codeVisible = true;
      this.htmlTemplate = generateCode(
        JSON.stringify(this.widgetForm),
        'html',
        this.widgetForm.config.ui,
      );
      this.vueTemplate = generateCode(
        JSON.stringify(this.widgetForm),
        'vue',
        this.widgetForm.config.ui,
      );
      this.$nextTick(() => {
        if (!this.codeClipboard) {
          this.codeClipboard = new ClipboardJS(document.getElementsByClassName('code-btn')[0]);
          this.codeClipboard.on('success', (e) => {
            this.$message.success(this.$t('fm.message.copySuccess'));
          });
        }
        this.codeCopyValue = this.codeActiveName == 'vue' ? this.vueTemplate : this.htmlTemplate;
      });
    },
    handleUpload() {
      this.$refs.importJsonDialog.open(this.jsonTemplates);
    },
    handleLoadJson(json) {
      try {
        this.setJSON(json);
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    handleClear() {
      this.widgetForm = {
        ...this.widgetForm,
        list: [],
      };

      this.widgetFormSelect = {};

      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey);
      });
    },
    clear() {
      this.handleClear();
    },
    getJSON() {
      return this.widgetForm;
    },
    getHtml(type = 'html', ui = 'element') {
      return generateCode(JSON.stringify(this.widgetForm), type, ui);
    },
    setJSON(json) {
      if (typeof json === 'string') {
        json = JSON.parse(json);
      }

      this.widgetForm = {
        ...json,
        list: json.list.map((item) => UpgradeData(item)),
      };

      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0];
      } else {
        this.widgetFormSelect = {};
      }

      this.initConfig();

      this.$nextTick(() => {
        EventBus.$emit('on-history-add-' + this.formKey);
      });
    },
    handleInput(val) {
      this.blank = val;
    },
    handleField(item) {
      EventBus.$emit('on-field-add-' + this.formKey, item);
    },
    handleUndo() {
      if (this.undo) {
        historyManager
          .updateLatest(
            this.widgetForm,
            this.widgetFormSelect && this.widgetFormSelect.key ? this.widgetFormSelect.key : '',
          )
          .then(() => {
            historyManager.undo().then((data) => {
              this.widgetForm = { ...data.data };
              this.widgetFormSelect = this._findWidgetItem(this.widgetForm.list, data.key);
              this.undo = data.undo;
              this.redo = data.redo;
            });
          });
      }
    },
    handleRedo() {
      if (this.redo) {
        historyManager.redo().then((data) => {
          this.widgetForm = { ...data.data };
          this.widgetFormSelect = this._findWidgetItem(this.widgetForm.list, data.key);

          this.undo = data.undo;
          this.redo = data.redo;
        });
      }
    },
    _findWidgetItem(list, key, type = 'key') {
      const index = list.findIndex((item) => item[type] == key);

      if (index >= 0) {
        return list[index];
      } else {
        for (let m = 0; m < list.length; m++) {
          const item = list[m];

          if (item.type === 'grid') {
            for (let i = 0; i < item.columns.length; i++) {
              return this._findWidgetItem(item.columns[i].list, key, type);
            }
          }
          if (item.type === 'table') {
            return this._findWidgetItem(item.tableColumns, key, type);
          }
          if (item.type === 'tabs') {
            for (let i = 0; i < item.tabs.length; i++) {
              return this._findWidgetItem(item.tabs[i].list, key, type);
            }
          }
          if (item.type === 'report') {
            for (let r = 0; r < item.rows.length; r++) {
              for (let c = 0; c < item.rows[r].columns.length; c++) {
                return this._findWidgetItem(item.rows[r].columns[c].list, key, type);
              }
            }
          }
          if (item.type === 'inline') {
            return this._findWidgetItem(item.list, key, type);
          }
        }

        return {};
      }
    },
    _loadComponents() {
      this.basicComponents = this.basicComponents.map((item) => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`),
          options: (() => {
            let newField = this.fieldConfig.find((o) => o.type == item.type);

            if (newField) {
              return { ...item.options, ...newField.options };
            } else {
              return { ...item.options };
            }
          })(),
        };
      });
      this.advanceComponents = this.advanceComponents.map((item) => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`),
          options: (() => {
            let newField = this.fieldConfig.find((o) => o.type == item.type);

            if (newField) {
              return { ...item.options, ...newField.options };
            } else {
              return { ...item.options };
            }
          })(),
        };
      });
      this.layoutComponents = this.layoutComponents.map((item) => {
        return {
          ...item,
          name: this.$t(`fm.components.fields.${item.type}`),
          options: (() => {
            let newField = this.fieldConfig.find((o) => o.type == item.type);

            if (newField) {
              return { ...item.options, ...newField.options };
            } else {
              return { ...item.options };
            }
          })(),
        };
      });

      this.customComponents = this.customFields.map((item) => {
        return {
          ...item,
          type: 'custom',
          icon: 'icon-extend',
          options: (() => {
            let newField = this.fieldConfig.find((o) => o.type == item.type);

            if (newField) {
              return { ...item.options, ...newField.options };
            } else {
              return { ...item.options };
            }
          })(),
        };
      });
    },
    onStyleUpdate(sheets) {
      let head = '.fm-' + this.formKey + ' ';

      updateStyleSheets(sheets, head);

      this.styleSheetsArray = splitSheetName(sheets);
    },
    onDataSourceUpdate(dataSource) {
      this.dataSourceArray = dataSource.map((item) => ({
        value: item.key,
        label: item.name,
        args: item.args ? Object.fromEntries(item.args.map((o) => [o, ''])) : {},
      }));
    },
    onEventScriptUpdate(eventScript) {
      this.eventScriptArray = eventScript.map((item) => ({
        value: item.key,
        label: item.name,
      }));
    },
    onEventScriptConfirm(eventObj) {
      this.$refs.widgetConfig.setEvent(eventObj);
    },
    handlePlatform(platform) {
      this.widgetForm.config.platform = this.platform = platform;
    },
    handleExport() {
      const fileName = new Date().getTime() + '.' + this.codeActiveName;

      const fileData = this.codeActiveName == 'vue' ? this.vueTemplate : this.htmlTemplate;

      this._exportFile(fileData, fileName);
    },
    handleExportJSON() {
      this._exportFile(JSON.stringify(this.jsonTemplate), new Date().getTime() + '.json');
    },
    handleEventAdd(name) {
      this.$refs.formConfig.editScript(name);
    },
    handleEventEdit({ eventName, functionKey }) {
      this.$refs.formConfig.editScript(eventName, functionKey);
    },
    handleEventRemove(eventName) {
      this.widgetFormSelect.events[eventName] = '';
    },
    _exportFile(data, fileName) {
      let blob = new Blob([data], {
        type: 'application/octet-stream',
      });

      if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        // Create download link element
        let downloadLink = document.createElement('a');
        // Create a link to the file
        downloadLink.href = window.URL.createObjectURL(blob);
        // Setting the file name
        downloadLink.download = fileName;

        downloadLink.style.display = 'none';

        document.body.appendChild(downloadLink);

        //triggering the function
        downloadLink.click();

        document.body.removeChild(downloadLink);
      }
    },
    setSelect(field) {
      let selectWidget = this._findWidgetItem(this.widgetForm.list, field, 'model');

      if (selectWidget) {
        this.widgetFormSelect = selectWidget;
      }
    },
    changeConfigTab(tab) {
      this.configTab = tab;
    },
  },
  watch: {
    '$i18n.locale': function (val) {
      this._loadComponents();
    },
    codeActiveName(val) {
      this.codeCopyValue = this.codeActiveName == 'vue' ? this.vueTemplate : this.htmlTemplate;
    },
  },
};
</script>

<style lang="scss" scoped>
.widget-empty {
  background-position: 50%;
}

.custom1 .el-col {
  border: 1px solid #ccc;
  overflow: hidden;
  padding: 5px;
  // margin-right:-1px;
  // margin-bottom:-1px;
  margin-right: -1px;
  margin-bottom: -1px;
}
.custom .el-col {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
</style>
