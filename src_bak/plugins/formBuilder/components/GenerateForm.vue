<template>
  <div
    :style="{ width: data.config && data.config.width }"
    class="fm-form"
    :class="'fm-' + formStyleKey"
  >
    <el-form
      :ref="formRef"
      :key="formKey"
      v-if="formShow"
      :class="{
        [data.config && data.config.customClass]:
          data.config && data.config.customClass ? true : false,
        'no-label-form': data.config && data.config.labelWidth == 0,
      }"
      :size="data.config && data.config.size"
      :model="models"
      :rules="rules"
      :label-position="data.config && data.config.labelPosition"
      :disabled="!edit"
      :label-width="data.config && data.config.labelWidth + 'px'"
      :validate-on-rule-change="false"
    >
      <template v-for="item in data.list">
        <generate-col-item
          v-if="item.type == 'grid'"
          :key="item.key"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="$refs[formRef]"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-col-item>

        <generate-tab-item
          v-else-if="item.type == 'tabs'"
          :key="item.key"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="$refs[formRef]"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-tab-item>

        <generate-report
          v-else-if="item.type == 'report'"
          :key="item.key"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="$refs[formRef]"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-report>

        <generate-inline
          v-else-if="item.type == 'inline'"
          :key="item.key"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="$refs[formRef]"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-inline>

        <generate-form-item
          v-else
          :key="item.key"
          :models="models"
          :rules="rules"
          :widget="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :form-component="$refs[formRef]"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateColItem from './GenerateColItem.vue'
import GenerateTabItem from './GenerateTabItem.vue'
import GenerateReport from './GenerateReport.vue'
import GenerateInline from './GenerateInline.vue'
import {
  loadJs,
  updateStyleSheets,
  splitStyleSheets,
  clearStyleSheets,
} from '../util/index.js'
import { EventBus } from '../util/event-bus.js'
import moment from 'moment'
import _ from 'lodash'
import axios from 'axios'

export default {
  name: 'fm-generate-form',
  components: {
    GenerateFormItem,
    GenerateColItem,
    GenerateTabItem,
    GenerateReport,
    GenerateInline,
    moment,
  },
  props: {
    data: {
      type: Object,
      default: () => ({
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'small',
          customClass: '',
          ui: 'element',
          layout: 'horizontal',
        },
      }),
    },
    remote: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    edit: {
      type: Boolean,
      default: true,
    },
    printRead: {
      type: Boolean,
      default: false,
    },
    remoteOption: {
      type: Object,
      default: () => ({}),
    },
    preview: {
      type: Boolean,
      default: false,
    },
    platform: {
      type: String,
      default: 'pc',
    },
  },
  emits: ['on-change'],
  data() {
    return {
      models: {},
      rules: {},
      blanks: [],
      displayFields: {},
      dataBindFields: [],
      generateShow: false,
      resetModels: {},
      formKey: Math.random().toString(36).slice(-8),
      formStyleKey: Math.random().toString(36).slice(-8),
      formValue: this.value,
      formShow: false,
      formRef: Math.random().toString(36).slice(-8) + 'Form',
      containerKey: Math.random().toString(36).slice(-8),
      dataSourceValue: [],
      eventFunction: {},
      instanceObject: {},
      dataSourceInterface: [],
    }
  },
  created() {
    this._initForm()
  },
  mounted() {
    const _this = this

    EventBus.$on(
      'on-change-' + this.containerKey,
      (value, field, containerKey) => {
        if (this.containerKey == containerKey) {
          _this.setData({
            [field]: value,
          })
        }

        _this.$emit('on-change', field, value, _this.models)

        this.$refs[this.formRef].validateField([field])
      }
    )

    this.$nextTick(() => {
      this.eventFunction['mounted'] && this.eventFunction['mounted']()
    })
  },
  beforeUnmount() {
    let head = '.fm-' + this.formStyleKey + ' '
    clearStyleSheets(head)
    EventBus.$off('on-change-' + this.containerKey)
  },
  provide() {
    return {
      generateComponentInstance: this.generateComponentInstance,
    }
  },
  methods: {
    _initForm() {
      this.formShow = false

      if (Object.keys(this.data).length) {
        this.generateModel(this.data.list)
      } else {
        this.generateModel([])
      }

      this.resetModels = _.cloneDeep(this.models)

      this.models = { ...this.models }

      this.formShow = true

      if (this.data.config && this.data.config.styleSheets) {
        let head = '.fm-' + this.formStyleKey + ' '

        updateStyleSheets(splitStyleSheets(this.data.config.styleSheets), head)
      }

      this.loadDataSource()

      this.loadEvents()
    },
    loadEvents() {
      if (this.data.config && this.data.config.eventScript) {
        for (let i = 0; i < this.data.config.eventScript.length; i++) {
          let currentScript = this.data.config.eventScript[i]

          this.eventFunction[currentScript.key] = Function(
            currentScript.func
          ).bind(this)
        }
      }
    },
    triggerEvent(eventName, args) {
      if (this.data.config && this.data.config.eventScript) {
        let eventScript = this.data.config.eventScript.find(
          (item) => item.name == eventName
        )

        if (eventScript) {
          return this.eventFunction[eventScript.key](args)
        }
      }
    },
    loadDataSource() {
      for (let i = 0; i < this.dataSourceInterface.length; i++) {
        let curRequest = this.dataSourceInterface[i]
        let requestObj = this.data.config.dataSource.find(
          (item) => item.key == curRequest.key
        )
        if (requestObj && requestObj.auto)
          requestObj.name &&
            this.sendRequest(requestObj.name, curRequest.args).then((data) => {
              curRequest.fields.forEach((field) => {
                let curKey = field + '.' + curRequest.key
                let sourceValue = this.dataSourceValue.find(
                  (item) => item.key === curKey
                )

                if (sourceValue) {
                  sourceValue.value = data
                } else {
                  this.dataSourceValue.push({
                    key: curKey,
                    value: data,
                  })
                }
              })
            })
      }
    },

    refreshFieldDataSource(field, args) {
      let curRequest = this.dataSourceInterface.find((item) =>
        item.fields.includes(field)
      )

      if (curRequest) {
        let requestName = this.data.config.dataSource.find(
          (item) => item.key == curRequest.key
        )?.name
        requestName &&
          this.sendRequest(requestName, { ...curRequest.args, ...args }).then(
            (data) => {
              let curKey = field + '.' + curRequest.key
              let sourceValue = this.dataSourceValue.find(
                (item) => item.key === curKey
              )

              if (sourceValue) {
                sourceValue.value = data
              } else {
                this.dataSourceValue.push({
                  key: curKey,
                  value: data,
                })
              }
            }
          )
      }
    },

    sendRequest(name, args = {}) {
      return new Promise((resolve, reject) => {
        let currentDataSource = this.data.config.dataSource.find(
          (item) => item.name === name
        )

        if (currentDataSource) {
          let options = {
            method: currentDataSource.method,
            url: currentDataSource.url,
            headers: currentDataSource.headers,
            params: currentDataSource.params,
          }

          //请求发送前处理函数
          if (currentDataSource.requestFunc) {
            const requestDynamicFunc = Function(
              'config, args',
              currentDataSource.requestFunc
            ).bind(this)

            options = requestDynamicFunc(options, args)
          }

          axios(options)
            .then((res) => {
              let data = res

              if (currentDataSource.responseFunc) {
                const dynamicFunc = Function(
                  'res, args',
                  currentDataSource.responseFunc
                ).bind(this)

                data = dynamicFunc(res.data, args)

                resolve(data)
              } else {
                resolve(res.data)
              }
            })
            .catch((error) => {
              //请求错误处理函数
              if (currentDataSource.errorFunc) {
                const errorDynamicFunc = Function(
                  'error',
                  currentDataSource.errorFunc
                ).bind(this)

                errorDynamicFunc(error)
              }

              reject(error)
            })
        }
      })
    },
    generateModel(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          this.displayFields[genList[i].model] = !genList[i].options.hidden

          genList[i].columns.forEach((item) => {
            this.generateModel(item.list)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach((item) => {
            this.generateModel(item.list)
          })

          this.displayFields[genList[i].model] = !genList[i].options.hidden
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach((row) => {
            row.columns.forEach((column) => {
              this.generateModel(column.list)
            })
          })

          this.displayFields[genList[i].model] = !genList[i].options.hidden
        } else if (genList[i].type === 'inline') {
          this.generateModel(genList[i].list)

          this.displayFields[genList[i].model] = !genList[i].options.hidden
        } else {
          if (Object.keys(this.formValue).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.formValue[genList[i].model]
            // 处理老版本没有dataBind值的情况，默认绑定数据
            if (
              (Object.keys(genList[i].options).indexOf('dataBind') < 0 ||
                genList[i].options.dataBind) &&
              genList[i].key &&
              genList[i].model
            ) {
              this.dataBindFields.push(genList[i].model)
            }

            this.displayFields[genList[i].model] = !genList[i].options.hidden

            if (genList[i].type === 'blank') {
              this.blanks.push({
                name: genList[i].model,
              })
            }
          } else {
            if (genList[i].type === 'blank') {
              // bound the default value
              this.models[genList[i].model] =
                genList[i].options.defaultType === 'String'
                  ? ''
                  : genList[i].options.defaultType === 'Object'
                  ? {}
                  : []
              if (
                (Object.keys(genList[i].options).indexOf('dataBind') < 0 ||
                  genList[i].options.dataBind) &&
                genList[i].key &&
                genList[i].model
              ) {
                this.dataBindFields.push(genList[i].model)
              }
              this.displayFields[genList[i].model] = !genList[i].options.hidden

              this.blanks.push({
                name: genList[i].model,
              })
            } else {
              if (
                Object.keys(genList[i].options).indexOf('dataBind') < 0 ||
                genList[i].options.dataBind
              ) {
                if (/^[$][{].*[}]$/.test(genList[i].options.defaultValue)) {
                  let params = genList[i].options.defaultValue.substring(
                    2,
                    genList[i].options.defaultValue.length - 1
                  )
                  if (params === 'new Date()') {
                    genList[i].options.defaultValue = moment(new Date()).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )
                  } else {
                    let value = this.$store.state
                    params.split('.').forEach((param) => {
                      value = value?.[param]
                    })
                    genList[i].options.defaultValue = value
                  }
                }
                this.models[genList[i].model] = genList[i].options.defaultValue
                if (
                  (Object.keys(genList[i].options).indexOf('dataBind') < 0 ||
                    genList[i].options.dataBind) &&
                  genList[i].key &&
                  genList[i].model
                ) {
                  this.dataBindFields.push(genList[i].model)
                }
              }
              this.displayFields[genList[i].model] = !genList[i].options.hidden
            }
          }

          genList[i].tableColumns &&
            genList[i].tableColumns.length &&
            genList[i].tableColumns.forEach((item) => {
              if (item.type === 'blank') {
                this.blanks.push({
                  name: item.model,
                })
              }

              // 处理 rules
              if (this.rules[`${genList[i].model}.${item.model}`]) {
                this.rules[`${genList[i].model}.${item.model}`] = [
                  ...this.rules[`${genList[i].model}.${item.model}`],
                  ...(item.rules
                    ? item.rules.map((im) => {
                        if (im.pattern) {
                          return { ...im, pattern: eval(im.pattern) }
                        } else if (im.func) {
                          const validatorFunc = Function(
                            'rule',
                            'value',
                            'callback',
                            im.func
                          ).bind(this)

                          return { ...im, validator: validatorFunc }
                        } else {
                          return { ...im }
                        }
                      })
                    : []),
                ]
              } else {
                this.rules[`${genList[i].model}.${item.model}`] = [
                  ...(item.rules
                    ? item.rules.map((im) => {
                        if (im.pattern) {
                          return { ...im, pattern: eval(im.pattern) }
                        } else if (im.func) {
                          const validatorFunc = Function(
                            'rule',
                            'value',
                            'callback',
                            im.func
                          ).bind(this)

                          return { ...im, validator: validatorFunc }
                        } else {
                          return { ...im }
                        }
                      })
                    : []),
                ]
              }

              // 处理子表单中的DataSource
              if (
                item.options.remoteType === 'datasource' &&
                item.options.remoteDataSource
              ) {
                this._setDataSourceInterface(
                  `${genList[i].model}.${item.model}`,
                  item.options.remoteArgs,
                  item.options.remoteDataSource
                )
              }
            })

          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [
              ...this.rules[genList[i].model],
              ...(genList[i].rules
                ? genList[i].rules.map((item) => {
                    if (item.pattern) {
                      return { ...item, pattern: eval(item.pattern) }
                    } else if (item.func) {
                      const validatorFunc = Function(
                        'rule',
                        'value',
                        'callback',
                        item.func
                      ).bind(this)

                      return { ...item, validator: validatorFunc }
                    } else {
                      return { ...item }
                    }
                  })
                : []),
            ]
          } else {
            this.rules[genList[i].model] = [
              ...(genList[i].rules
                ? genList[i].rules.map((item) => {
                    if (item.pattern) {
                      return { ...item, pattern: eval(item.pattern) }
                    } else if (item.func) {
                      const validatorFunc = Function(
                        'rule',
                        'value',
                        'callback',
                        item.func
                      ).bind(this)

                      return { ...item, validator: validatorFunc }
                    } else {
                      return { ...item }
                    }
                  })
                : []),
            ]
          }

          // 处理DataSource
          if (
            genList[i].options.remoteType === 'datasource' &&
            genList[i].options.remoteDataSource
          ) {
            this._setDataSourceInterface(
              genList[i].model,
              genList[i].options.remoteArgs,
              genList[i].options.remoteDataSource
            )
          }
        }
      }
    },
    _setDataSourceInterface(field, args, key) {
      let argsObj
      if (typeof args == 'string') {
        argsObj = new Function('"use strict";return (' + args + ')').bind(
          this
        )()
      } else {
        argsObj = args
      }

      let findCurInterfaceIndex = this.dataSourceInterface.findIndex(
        (item) => item.key == key && _.isEqual(item.args, argsObj)
      )

      if (findCurInterfaceIndex >= 0) {
        this.dataSourceInterface[findCurInterfaceIndex].fields.push(field)
      } else {
        this.dataSourceInterface.push({
          key: key,
          args: argsObj,
          fields: [field],
        })
      }
    },
    _setDisabled(genList, fields, disabled) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach((item) => {
            this._setDisabled(item.list, fields, disabled)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach((item) => {
            this._setDisabled(item.list, fields, disabled)
          })
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach((row) => {
            row.columns.forEach((column) => {
              this._setDisabled(column.list, fields, disabled)
            })
          })
        } else if (genList[i].type === 'inline') {
          this._setDisabled(genList[i].list, fields, disabled)
        } else {
          if (fields.indexOf(genList[i].model) >= 0) {
            genList[i].options.disabled = disabled
          }
        }
      }
    },
    _updateClassName(genList, fields, className, updateType) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach((item) => {
            this._updateClassName(item.list, fields, className, updateType)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach((item) => {
            this._updateClassName(item.list, fields, className, updateType)
          })
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach((row) => {
            row.columns.forEach((column) => {
              this._updateClassName(column.list, fields, className, updateType)
            })
          })
        } else if (genList[i].type === 'inline') {
          this._updateClassName(genList[i].list, fields, className, updateType)
        } else {
          if (fields.indexOf(genList[i].model) >= 0) {
            if (
              updateType == 'add' &&
              !genList[i].options.customClass.split(' ').includes(className)
            ) {
              genList[i].options.customClass = [
                ...genList[i].options.customClass.split(' '),
                className,
              ].join(' ')
            }

            if (
              updateType == 'remove' &&
              genList[i].options.customClass.split(' ').includes(className)
            ) {
              let originArray = genList[i].options.customClass.split(' ')
              originArray.splice(
                originArray.findIndex((item) => item == className),
                1
              )
              genList[i].options.customClass = originArray.join(' ')
            }
          }
        }
      }
    },
    _setOptions(genList, fields, opts) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach((item) => {
            this._setOptions(item.list, fields, opts)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach((item) => {
            this._setOptions(item.list, fields, opts)
          })
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach((row) => {
            row.columns.forEach((column) => {
              this._setOptions(column.list, fields, opts)
            })
          })
        } else if (genList[i].type === 'inline') {
          this._setOptions(genList[i].list, fields, opts)
        } else {
          if (fields.indexOf(genList[i].model) >= 0) {
            Object.keys(opts).forEach((key) => {
              genList[i].options[key] = opts[key]
            })
          }
        }
      }
    },
    validate(fields) {
      return new Promise((resolve, reject) => {
        if (fields) {
          this.$refs[this.formRef].validateField(fields, (valid, error) => {
            if (valid) {
              resolve()
            } else {
              reject(error)
            }
          })
        } else {
          this.$refs[this.formRef].validate((valid, error) => {
            if (valid) {
              resolve()
            } else {
              reject(error)
            }
          })
        }
      })
    },
    getData(isValidate = true) {
      return new Promise((resolve, reject) => {
        if (isValidate) {
          this.$refs[this.formRef].validate((valid) => {
            if (valid) {
              const resData = {}
              Object.keys(this.models).forEach((key) => {
                if (this.dataBindFields.indexOf(key) >= 0) {
                  resData[key] = this.models[key]
                }
              })
              resolve(JSON.parse(JSON.stringify(resData)))
            } else {
              reject(new Error(this.$t('fm.message.validError')).message)
            }
          })
        } else {
          const resData = {}
          Object.keys(this.models).forEach((key) => {
            if (this.dataBindFields.indexOf(key) >= 0) {
              resData[key] = this.models[key]
            }
          })
          resolve(JSON.parse(JSON.stringify(resData)))
        }
      })
    },
    // jeeplus定制修改
    getDataBindFields() {
      return this.dataBindFields
    },
    reset() {
      this.setData(_.cloneDeep(this.resetModels))

      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs[this.formRef].clearValidate()
        })
      })
    },
    onInputChange(value, field) {
      this.$emit('on-change', field, value, this.models)
      this.$emit(`on-${field}-change`, value)
    },
    display(fields) {
      Object.keys(this.displayFields).forEach((key) => {
        if (fields.indexOf(key) >= 0) {
          this.displayFields[key] = true
        }
      })

      this.displayFields = { ...this.displayFields }
    },
    hide(fields) {
      Object.keys(this.displayFields).forEach((key) => {
        if (fields.indexOf(key) >= 0) {
          this.displayFields[key] = false
        }
      })

      this.displayFields = { ...this.displayFields }
    },
    disabled(fields, disabled) {
      this._setDisabled(this.data.list, fields, disabled)
    },
    addClassName(fields, className) {
      this._updateClassName(this.data.list, fields, className, 'add')
    },
    removeClassName(fields, className) {
      this._updateClassName(this.data.list, fields, className, 'remove')
    },
    refresh() {
      this._initForm()
    },
    setData(value) {
      Object.keys(value).forEach((item) => {
        this.models[item] = value[item]
      })
    },
    getComponent(name) {
      return this.instanceObject[name]
    },
    getValues() {
      return this.models
    },
    getValue(fieldName) {
      return this.models[fieldName]
    },
    setRules(field, rules) {
      this.rules[field] = [...rules]

      if (field?.split('.').length > 1) {
        const tableRowLength = this.getValue(field.split('.')[0])?.length
        for (let i = 0; i < tableRowLength; i++) {
          this.$refs[this.formRef].validateField([
            `${field.split('.')[0]}.${i}.${field.split('.')[1]}`,
          ])
        }
      } else {
        this.$refs[this.formRef].validateField([field])
      }
    },
    setOptions(fields, options) {
      this._setOptions(this.data.list, fields, options)
    },
    generateComponentInstance(key, instance) {
      if (this.instanceObject[key]) {
        if (Array.isArray(this.instanceObject[key])) {
          this.instanceObject[key] = [...this.instanceObject[key], instance]
        } else {
          this.instanceObject[key] = [this.instanceObject[key], instance]
        }
      } else {
        this.instanceObject[key] = instance
      }
    },
    setOptionData(fields, data) {
      fields.forEach((field) => {
        const curRef = this.instanceObject[field]
        curRef?.$parent?.loadOptions(data)

        const mCurRef = this.instanceObject['m' + field]
        mCurRef?.$parent?.loadOptions(data)
      })
    },
  },
}
</script>


