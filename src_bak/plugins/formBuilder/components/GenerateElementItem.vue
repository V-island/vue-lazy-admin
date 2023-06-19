<template>
  <div :class="{ 'print-read-label': printRead }" style="width: 100%">
    <template v-if="widget.type == 'blank'">
      <div :style="{ width: isTable ? '100%' : widget.options.width }">
        <slot :name="widget.model" :model="dataModels"></slot>
      </div>
    </template>

    <template v-if="widget.type == 'component'">
      <div :style="{ width: isTable ? '100%' : widget.options.width }">
        <component
          :is="`component-${widget.key}-${key}`"
          :key="key"
          v-model="dataModel"
          :ref="'fm-' + widget.model"
        ></component>
      </div>
    </template>

    <template v-if="widget.type == 'custom'">
      <div :style="{ width: isTable ? '100%' : widget.options.width }">
        <component
          :is="widget.el"
          v-model="dataModel"
          :width="widget.options.width"
          :height="widget.options.height"
          :placeholder="widget.options.placeholder"
          :readonly="widget.options.readonly"
          :disabled="!edit || widget.options.disabled"
          :editable="widget.options.editable"
          :clearable="widget.options.clearable"
          :ref="'fm-' + widget.model"
          :print-read="printRead"
          v-bind="widget.options.extendProps"
        ></component>
      </div>
    </template>

    <template v-if="widget.type == 'input'">
      <template v-if="printRead">
        <span>{{ dataModel }}</span>
      </template>
      <template v-else>
        <el-input
          v-if="
            widget.options.dataTypeCheck &&
            (widget.options.dataType == 'number' ||
              widget.options.dataType == 'integer' ||
              widget.options.dataType == 'float')
          "
          type="number"
          v-model.number="dataModel"
          :disabled="!edit || widget.options.disabled"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :show-password="widget.options.showPassword"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :ref="'fm-' + widget.model"
          size="default"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></el-input>
        <el-input
          v-else
          :type="
            widget.options.dataTypeCheck ? widget.options.dataType : 'text'
          "
          v-model="dataModel"
          :disabled="!edit || widget.options.disabled"
          :placeholder="widget.options.placeholder"
          :show-password="widget.options.showPassword"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :clearable="widget.options.clearable"
          :ref="'fm-' + widget.model"
          size="default"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></el-input>
      </template>
    </template>

    <template v-if="widget.type == 'textarea'">
      <template v-if="printRead">
        <pre>{{ dataModel }}</pre>
      </template>
      <template v-else>
        <el-input
          type="textarea"
          :rows="5"
          v-model="dataModel"
          :disabled="!edit || widget.options.disabled"
          :placeholder="widget.options.placeholder"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :clearable="widget.options.clearable"
          :ref="'fm-' + widget.model"
          size="default"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></el-input>
      </template>
    </template>

    <template v-if="widget.type == 'number'">
      <template v-if="printRead">
        <span>{{
          typeof dataModel == 'number'
            ? dataModel.toFixed(widget.options.precision)
            : dataModel
        }}</span>
      </template>
      <template v-else>
        <el-input-number
          v-model="dataModel"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :step="widget.options.step"
          :disabled="!edit || widget.options.disabled"
          :min="widget.options.min"
          :max="widget.options.max"
          :controls-position="widget.options.controlsPosition"
          :precision="widget.options.precision"
          :controls="widget.options.controls"
          :ref="'fm-' + widget.model"
          size="default"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></el-input-number>
      </template>
    </template>

    <template v-if="widget.type == 'radio'">
      <template v-if="printRead">
        <template v-if="widget.options.remote === 2">
          {{
            remoteOptions.find((item) => item.value == dataModel) &&
            remoteOptions.find((item) => item.value == dataModel).label
          }}
        </template>
        <template v-else-if="widget.options.remote === 3">
          {{
            $dictUtils
              .getDictList(widget.options.dictType)
              .find((item) => item.value == dataModel) &&
            $dictUtils
              .getDictList(widget.options.dictType)
              .find((item) => item.value == dataModel).label
          }}
        </template>
        <template v-else>
          {{
            widget.options.showLabel
              ? widget.options.options.find(
                  (item) => item.value == dataModel
                ) &&
                widget.options.options.find((item) => item.value == dataModel)
                  .label
              : dataModel
          }}
        </template>
      </template>
      <template v-else>
        <el-radio-group
          v-model="dataModel"
          :style="{
            width: isTable ? '100%' : widget.options.width,
            display: 'block',
          }"
          :disabled="!edit || widget.options.disabled"
          :ref="'fm-' + widget.model"
          size="default"
        >
        <template v-if="widget.options.remote === 2">
          <el-radio
            :style="{
              display: widget.options.inline ? 'inline-block' : 'block',
            }"
            :label="item.value"
            v-for="(item, index) in remoteOptions"
            :key="index"
          >
            {{ item.label }}
          </el-radio>
        </template>
        <template v-else-if="widget.options.remote === 3">
          <el-radio
            :style="{
              display: widget.options.inline ? 'inline-block' : 'block',
            }"
            :label="item.value"
            v-for="(item, index) in $dictUtils.getDictList(
              widget.options.dictType
            )"
            :key="index + 1"
          >
            {{ item.label }}
          </el-radio>
        </template>
        <template v-else>
          <el-radio
            :style="{
              display: widget.options.inline ? 'inline-block' : 'block',
            }"
            :label="item.value"
            v-for="(item, index) in widget.options.options"
            :key="index + 2"
          >
            {{ widget.options.showLabel ? item.label : item.value }}
          </el-radio>
        </template>
        </el-radio-group>
      </template>
    </template>

    <template v-if="widget.type == 'checkbox'">
      <template v-if="printRead">
        <template v-if="widget.options.remote === 2">
          {{
            dataModel
              .map(
                (dm) =>
                  remoteOptions.find((item) => item.value == dm) &&
                  remoteOptions.find((item) => item.value == dm).label
              )
              .join('、')
          }}
        </template>

        <template v-else-if="widget.options.remote === 3">
          {{
            dataModel
              .map(
                (dm) =>
                  $dictUtils
                    .getDictList(widget.options.dictType)
                    .find((item) => item.value == dm) &&
                  $dictUtils
                    .getDictList(widget.options.dictType)
                    .find((item) => item.value == dm).label
              )
              .join('、')
          }}
        </template>
        <template v-else>
          {{
            widget.options.showLabel
              ? dataModel
                  .map(
                    (dm) =>
                      widget.options.options.find((item) => item.value == dm) &&
                      widget.options.options.find((item) => item.value == dm)
                        .label
                  )
                  .join('、')
              : dataModel.join('、')
          }}
        </template>
      </template>
      <template v-else>
        <el-checkbox-group
          v-model="dataModel"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :disabled="!edit || widget.options.disabled"
          :ref="'fm-' + widget.model"
          size="default"
        >
          <template v-if="widget.options.remote === 2">
            <el-checkbox
              :style="{
                display: widget.options.inline ? 'inline-block' : 'block',
              }"
              :label="item.value"
              v-for="(item, index) in remoteOptions"
              :key="index"
            >
              {{ item.label }}
            </el-checkbox>
          </template>
          <template v-else-if="widget.options.remote === 3">
            <el-checkbox
              :style="{
                display: widget.options.inline ? 'inline-block' : 'block',
              }"
              :label="item.value"
              v-for="(item, index) in $dictUtils.getDictList(
                widget.options.dictType
              )"
              :key="index + 1"
            >
              {{ item.label }}
            </el-checkbox>
          </template>
          <template v-else>
            <el-checkbox
              :style="{
                display: widget.options.inline ? 'inline-block' : 'block',
              }"
              :label="item.value"
              v-for="(item, index) in widget.options.options"
              :key="index + 2"
            >
              {{ widget.options.showLabel ? item.label : item.value }}
            </el-checkbox>
          </template>
        </el-checkbox-group>
      </template>
    </template>

    <template v-if="widget.type == 'time'">
      <template v-if="printRead">
        {{ dataModel }}
      </template>
      <template v-else>
        <el-time-picker
          v-model="dataModel"
          :is-range="widget.options.isRange"
          :placeholder="widget.options.placeholder"
          :start-placeholder="widget.options.startPlaceholder"
          :end-placeholder="widget.options.endPlaceholder"
          :readonly="widget.options.readonly"
          :disabled="!edit || widget.options.disabled"
          :editable="widget.options.editable"
          :clearable="widget.options.clearable"
          :arrowControl="widget.options.arrowControl"
          :value-format="widget.options.format"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :ref="'fm-' + widget.model"
          size="default"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        >
        </el-time-picker>
      </template>
    </template>

    <template v-if="widget.type == 'date'">
      <template v-if="printRead">
        {{ typeof dataModel == 'object' ? dataModel.join('、') : dataModel }}
      </template>
      <template v-else>
        <el-date-picker
          v-model="dataModel"
          :type="widget.options.type"
          :placeholder="widget.options.placeholder"
          :start-placeholder="widget.options.startPlaceholder"
          :end-placeholder="widget.options.endPlaceholder"
          :readonly="widget.options.readonly"
          :disabled="!edit || widget.options.disabled"
          :editable="widget.options.editable"
          :clearable="widget.options.clearable"
          :value-format="
            widget.options.timestamp ? 'timestamp' : widget.options.format
          "
          :format="widget.options.format"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :ref="'fm-' + widget.model"
          size="default"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        >
        </el-date-picker>
      </template>
    </template>

    <template v-if="widget.type == 'rate'">
      <template v-if="printRead">
        {{ dataModel }}
      </template>
      <template v-else>
        <el-rate
          v-model="dataModel"
          :max="widget.options.max"
          :disabled="!edit || widget.options.disabled"
          :allow-half="widget.options.allowHalf"
          :show-score="widget.options.showScore"
          :ref="'fm-' + widget.model"
          size="default"
        ></el-rate>
      </template>
    </template>

    <template v-if="widget.type == 'color'">
      <template v-if="printRead">
        {{ dataModel }}
      </template>
      <template v-else>
        <el-color-picker
          v-model="dataModel"
          :disabled="!edit || widget.options.disabled"
          :show-alpha="widget.options.showAlpha"
          :ref="'fm-' + widget.model"
          size="default"
        ></el-color-picker>
      </template>
    </template>

    <template v-if="widget.type == 'select'">
      <template v-if="printRead">
        <template v-if="widget.options.remote === 2">
          {{
            typeof dataModel == 'object'
              ? dataModel
                  .map(
                    (dm) =>
                      remoteOptions.find((item) => item.value == dm) &&
                      remoteOptions.find((item) => item.value == dm).label
                  )
                  .join('、')
              : remoteOptions.find((item) => item.value == dataModel) &&
                remoteOptions.find((item) => item.value == dataModel).label
          }}
        </template>
        <template v-else-if="widget.options.remote === 3">
          {{
            typeof dataModel == 'object'
              ? dataModel
                  .map(
                    (dm) =>
                      $dictUtils
                        .getDictList(widget.options.dictType)
                        .find((item) => item.value == dm) &&
                      $dictUtils
                        .getDictList(widget.options.dictType)
                        .find((item) => item.value == dm).label
                  )
                  .join('、')
              : $dictUtils
                  .getDictList(widget.options.dictType)
                  .find((item) => item.value == dataModel) &&
                $dictUtils
                  .getDictList(widget.options.dictType)
                  .find((item) => item.value == dataModel).label
          }}
        </template>
        <template v-else>
          {{
            widget.options.showLabel
              ? typeof dataModel == 'object'
                ? dataModel
                    .map(
                      (dm) =>
                        widget.options.options.find(
                          (item) => item.value == dm
                        ) &&
                        widget.options.options.find((item) => item.value == dm)
                          .label
                    )
                    .join('、')
                : widget.options.options.find(
                    (item) => item.value == dataModel
                  ) &&
                  widget.options.options.find((item) => item.value == dataModel)
                    .label
              : typeof dataModel == 'object'
              ? dataModel.join('、')
              : dataModel
          }}
        </template>
      </template>
      <template v-else>
        <el-select
          v-model="dataModel"
          :disabled="!edit || widget.options.disabled"
          :multiple="widget.options.multiple"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :filterable="widget.options.filterable"
          :ref="'fm-' + widget.model"
          size="default"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        >
        <template v-if="widget.options.remote === 2">
          <el-option
            v-for="item in remoteOptions"
            :key="item.value"
            :value="item.value"
            :label="widget.options.showLabel || item.label"
          ></el-option>
        </template>
        <template v-else-if="widget.options.remote === 3">
          <el-option
            v-for="item in $dictUtils.getDictList(widget.options.dictType)"
            :key="item.value"
            :value="item.value"
            :label="widget.options.showLabel || item.label"
          ></el-option>
        </template>
        <template v-else>
          <el-option
            v-for="item in widget.options.options"
            :key="item.value"
            :value="item.value"
            :label="widget.options.showLabel || item.value"
          ></el-option>
        </template>
        </el-select>
      </template>
    </template>

    <template v-if="widget.type == 'switch'">
      <template v-if="printRead">
        {{ dataModel }}
      </template>
      <template v-else>
        <el-switch
          v-model="dataModel"
          :disabled="!edit || widget.options.disabled"
          :ref="'fm-' + widget.model"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          size="default"
        >
        </el-switch>
      </template>
    </template>

    <template v-if="widget.type == 'slider'">
      <template v-if="printRead">
        {{ dataModel }}
      </template>
      <template v-else>
        <el-slider
          v-model="dataModel"
          :min="widget.options.min"
          :max="widget.options.max"
          :disabled="!edit || widget.options.disabled"
          :step="widget.options.step"
          :show-input="widget.options.showInput"
          :range="widget.options.range"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :ref="'fm-' + widget.model"
          size="default"
        ></el-slider>
      </template>
    </template>

    <template v-if="widget.type == 'imgupload'">
      <fm-upload
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :readonly="widget.options.readonly || printRead"
        :style="{ width: isTable ? '100%' : widget.options.width }"
        :width="widget.options.size.width"
        :height="widget.options.size.height"
        :token="widget.options.token"
        :domain="widget.options.domain"
        :multiple="widget.options.multiple"
        :limit="widget.options.limit"
        :is-qiniu="widget.options.isQiniu"
        :is-delete="widget.options.isDelete"
        :min="widget.options.min"
        :is-edit="widget.options.isEdit"
        :action="widget.options.action"
        :headers="widget.options.headers || []"
        :ref="'fm-' + widget.model"
        :withCredentials="widget.options.withCredentials"
        :print-read="printRead"
        size="default"
        @on-upload-success="handleOnUploadSuccess"
        @on-upload-error="handleOnUploadError"
        @on-upload-remove="handleOnUploadRemove"
        @on-upload-progress="handleOnUploadProgress"
        :on-select="handleOnUploadSelect"
      >
      </fm-upload>
    </template>

    <template v-if="widget.type == 'editor'">
      <template v-if="printRead">
        <div v-html="dataModel" class="ql-editor"></div>
      </template>
      <template v-else>
        <Editor
          v-model="dataModel"
          :custom-style="{
            width: isTable ? '100%' : widget.options.width,
            cursor: !edit || widget.options.disabled ? 'no-drop' : '',
            backgroundColor: !edit || widget.options.disabled ? '#F5F7FA' : '',
          }"
          :toolbar="widget.options.customToolbar"
          :disabled="!edit || widget.options.disabled"
          :ref="'fm-' + widget.model"
          size="default"
        ></Editor>
      </template>
    </template>

    <template v-if="widget.type == 'cascader'">
      <template v-if="printRead">
        <template v-if="widget.options.remote">
          {{
            widget.options.multiple
              ? dataModel
                  .map((dm) =>
                    getCascaderText([...dm], remoteOptions).join(' / ')
                  )
                  .join('、')
              : getCascaderText([...dataModel], remoteOptions).join(' / ')
          }}
        </template>
        <template v-else>
          {{
            widget.options.multiple
              ? dataModel
                  .map((dm) =>
                    getCascaderText([...dm], widget.options.options).join(' / ')
                  )
                  .join('、')
              : getCascaderText([...dataModel], widget.options.options).join(
                  ' / '
                )
          }}
        </template>
      </template>
      <template v-else>
        <el-cascader
          v-model="dataModel"
          :disabled="!edit || widget.options.disabled"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :options="
            widget.options.remote ? remoteOptions : widget.options.options
          "
          @change="onCascaderChange"
          :ref="'fm-' + widget.model"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          :props="propsModel"
          collapse-tags
          :filterable="widget.options.filterable"
          size="default"
        >
        </el-cascader>
      </template>
    </template>

    <template v-if="widget.type == 'treeselect'">
      <template v-if="printRead">
        <template v-if="widget.options.remote">
          {{
            typeof dataModel == 'object'
              ? dataModel.map((dm) => getTreeText(dm, remoteOptions)).join('、')
              : getTreeText(dataModel, remoteOptions)
          }}
        </template>
        <template v-else>
          {{
            typeof dataModel == 'object'
              ? dataModel
                  .map((dm) => getTreeText(dm, widget.options.options))
                  .join('、')
              : getTreeText(dataModel, widget.options.options)
          }}
        </template>
      </template>
      <template v-else>
        <el-tree-select
          v-model="dataModel"
          :disabled="!edit || widget.options.disabled"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :data="widget.options.remote ? remoteOptions : widget.options.options"
          :ref="'fm-' + widget.model"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          :multiple="widget.options.multiple"
          :check-strictly="widget.options.checkStrictly"
          :filterable="widget.options.filterable"
          size="default"
        >
        </el-tree-select>
      </template>
    </template>

    <template v-if="widget.type == 'text'">
      <span :ref="'fm-' + widget.model">{{ dataModel }}</span>
    </template>

    <template v-if="widget.type == 'html'">
      <span v-html="dataModel" :ref="'fm-' + widget.model"></span>
    </template>

    <template v-if="widget.type == 'table'">
      <fm-form-table
        :value="dataModel"
        :columns="widget.tableColumns"
        :models="dataModels"
        :remote="remote"
        :blanks="blanks"
        :disableddata="!edit || widget.options.disabled || printRead"
        :rules="rules"
        :name="widget.model"
        :remote-option="remoteOption"
        :ref="'fm-' + widget.model"
        :preview="preview"
        :platform="platform"
        :data-source-value="dataSourceValue"
        :event-function="eventFunction"
        :widget="widget"
        :print-read="printRead"
        :form-component="formComponent"
        :paging="widget.options.paging"
        :page-size="widget.options.pageSize"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks" :key="blank.name">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </fm-form-table>
    </template>

    <template v-if="widget.type == 'fileupload'">
      <fm-file-upload
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :style="{ width: isTable ? '100%' : widget.options.width }"
        :token="widget.options.token"
        :domain="widget.options.domain"
        :multiple="widget.options.multiple"
        :limit="widget.options.limit"
        :is-qiniu="widget.options.isQiniu"
        :min="widget.options.min"
        :action="widget.options.action"
        :tip="widget.options.tip"
        :headers="widget.options.headers || []"
        :ref="'fm-' + widget.model"
        :withCredentials="widget.options.withCredentials"
        :print-read="printRead"
        @on-upload-success="handleOnUploadSuccess"
        @on-upload-error="handleOnUploadError"
        @on-upload-remove="handleOnUploadRemove"
        @on-upload-progress="handleOnUploadProgress"
        :on-select="handleOnUploadSelect"
      >
      </fm-file-upload>
    </template>

    <template v-if="widget.type == 'button'">
      <el-button
        :disabled="!edit || widget.options.disabled"
        :size="widget.options.buttonSize"
        :type="widget.options.buttonType"
        :plain="widget.options.buttonPlain"
        :round="widget.options.buttonRound"
        :circle="widget.options.buttonCircle"
        :style="{ width: widget.options.width, 'vertical-align': 'top' }"
        :ref="'fm-' + widget.model"
        @click="handleOnClick"
        >{{ widget.options.buttonName }}
      </el-button>
    </template>

    <template v-if="widget.type == 'link'">
      <el-link
        :disabled="!edit || widget.options.disabled"
        :type="widget.options.linkType"
        :underline="widget.options.underline"
        :href="widget.options.href"
        :target="widget.options.blank ? '_blank' : '_self'"
        :ref="'fm-' + widget.model"
        @click="handleOnClick"
      >
        {{ widget.options.linkName }}
      </el-link>
    </template>

    <template v-if="widget.type == 'steps'">
      <el-steps
        :active="dataModel"
        :ref="'fm-' + widget.model"
        :space="widget.options.space"
        :direction="widget.options.direction"
        :process-status="widget.options.processStatus"
        :finish-status="widget.options.finishStatus"
        :align-center="widget.options.alignCenter"
        :simple="widget.options.simple"
        :style="{ 'line-height': 'normal' }"
        v-if="
          widget.options.remote
            ? remoteOptions && remoteOptions.length > 0
            : true
        "
      >
        <el-step
          :title="widget.options.remote ? item.value : item.title"
          :description="widget.options.remote ? item.label : item.description"
          v-for="(item, index) in widget.options.remote
            ? remoteOptions
            : widget.options.steps"
          :key="index"
        ></el-step>
      </el-steps>
    </template>

    <template v-if="widget.type == 'transfer'">
      <template v-if="printRead">
        <template v-if="widget.options.remote">
          {{
            dataModel
              .map(
                (dm) =>
                  remoteOptions.find(
                    (item) => item[widget.options.props.key] == dm
                  )?.[widget.options.props.label]
              )
              .join('、')
          }}
        </template>
        <template v-else>
          {{
            dataModel
              .map(
                (dm) =>
                  widget.options.data.find(
                    (item) => item[propsTransfer.key] == dm
                  )?.[propsTransfer.label]
              )
              .join('、')
          }}
        </template>
      </template>
      <template v-else>
        <el-transfer
          :model-value="dataModel"
          :disabled="!edit || widget.options.disabled"
          :data="widget.options.remote ? remoteOptions : widget.options.data"
          :filterable="widget.options.filterable"
          :props="widget.options.remote ? widget.options.props : propsTransfer"
          :titles="widget.options.titles"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :ref="'fm-' + widget.model"
          @change="handleTransferChange"
        ></el-transfer>
      </template>
    </template>

    <!--jeeplus定制修改-->
    <template v-if="widget.type == 'user'">
      <user-select
        :printRead="printRead"
        :limit="widget.options.limit"
        v-model="dataModel"
        :disabled="!edit || widget.options.disabled"
        :clearable="widget.options.clearable"
        :placeholder="widget.options.placeholder"
        :style="{ width: isTable ? '100%' : widget.options.width }"
      ></user-select>
    </template>
    <template v-if="widget.type == 'office'">
      <OfficeSelect
        :printRead="printRead"
        :disabled="!edit || widget.options.disabled"
        :clearable="widget.options.clearable"
        :style="{ width: isTable ? '100%' : widget.options.width }"
        :placeholder="widget.options.placeholder"
        v-model="dataModel"
      />
    </template>
    <template v-if="widget.type == 'area'">
      <Area
        :printRead="printRead"
        :disabled="!edit || widget.options.disabled"
        :clearable="widget.options.clearable"
        :style="{ width: isTable ? '100%' : widget.options.width }"
        :placeholder="widget.options.placeholder"
        v-model="dataModel"
      />
    </template>

    <template v-if="widget.type == 'dict'">
      <template v-if="printRead">
        {{
          typeof dataModel == 'object'
            ? dataModel
                .map(
                  (dm) =>
                    $dictUtils
                      .getDictList(widget.options.dictType)
                      .find((item) => item.value == dm) &&
                    $dictUtils
                      .getDictList(widget.options.dictType)
                      .find((item) => item.value == dm).label
                )
                .join('、')
            : $dictUtils
                .getDictList(widget.options.dictType)
                .find((item) => item.value == dataModel) &&
              $dictUtils
                .getDictList(widget.options.dictType)
                .find((item) => item.value == dataModel).label
        }}
      </template>
      <template v-else>
        <el-select
          v-model="dataModel"
          :disabled="!edit || widget.options.disabled"
          :multiple="widget.options.multiple"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{ width: isTable ? '100%' : widget.options.width }"
          :filterable="widget.options.filterable"
        >
          <el-option
            v-for="item in $dictUtils.getDictList(widget.options.dictType)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
          <!-- <el-option v-for="item in (widget.options.remote ? remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></el-option> -->
        </el-select>
      </template>
    </template>
  </div>
</template>

<script>
import FmUpload from './Upload/index.vue'
import FmFormTable from './FormTable/index.vue'
import FmFileUpload from './Upload/file.vue'
import { EventBus } from '../util/event-bus'
import Editor from './Editor/index.vue'
import UserSelect from './userSelect' //jeeplus
import Area from './areaSelect' //jeeplus
import OfficeSelect from './officeSelect'

export default {
  name: 'generate-element-item',
  components: {
    FmUpload,
    FmFormTable,
    UserSelect, // jeeplus
    Area, // jeeplus
    OfficeSelect,
    FmFileUpload,
    Editor,
  },
  props: [
    'widget',
    'modelValue',
    'models',
    'remote',
    'isTable',
    'blanks',
    'disabled',
    'edit',
    'remoteOption',
    'rules',
    'platform',
    'preview',
    'dataSourceValue',
    'eventFunction',
    'rowIndex',
    'tableName',
    'printRead',
    'formComponent',
    'isMobile',
  ],
  emits: ['update:modelValue', 'on-table-change'],
  data() {
    return {
      dataModel: this.modelValue,
      dataModels: this.models,
      key: new Date().getTime(),
      modelName: this.widget.model,
      propsModel: {
        multiple: this.widget.options.multiple || false,
        checkStrictly: this.widget.options.checkStrictly || false,
      },
      propsTransfer: { key: 'key', label: 'label' },
      remoteOptions: [],
    }
  },
  inject: ['generateComponentInstance'],
  created() {
    if (
      this.widget.options.remote &&
      (Object.keys(this.widget.options).indexOf('remoteType') >= 0
        ? this.widget.options.remoteType == 'func'
        : true) &&
      this.remote[this.widget.options.remoteFunc]
    ) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        this.loadOptions(data)
      })
    }

    if (
      this.widget.options.remote &&
      this.widget.options.remoteType == 'option' &&
      this.remoteOption[this.widget.options.remoteOption]
    ) {
      this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
    }

    if (
      this.widget.options.remote &&
      this.widget.options.remoteType == 'datasource' &&
      this.dataSourceValue
    ) {
      let options = this.dataSourceValue.find(
        (item) =>
          item.key ===
          (this.isTable
            ? this.tableName + '.' + this.widget.model
            : this.widget.model) +
            '.' +
            this.widget.options.remoteDataSource
      )

      options && options.value && this.loadOptions(options.value)
    }

    if (
      (this.widget.type === 'imgupload' || this.widget.type === 'fileupload') &&
      this.widget.options.isQiniu
    ) {
      this.loadUploadConfig()
    }

    if (this.widget.type == 'component') {
      this.$options.components[`component-${this.widget.key}-${this.key}`] = {
        template: `${this.widget.options.template}`,
        props: ['modelValue'],
        emits: ['update:modelValue'],
        data: () => ({
          dataModel: this.modelValue,
        }),
        watch: {
          dataModel(val) {
            if (this.ui == 'antd') {
              EventBus.$emit('on-field-change', this.$attrs.id, val)
            } else {
              this.$emit('update:modelValue', val)
            }
          },
          modelValue(val) {
            this.dataModel = val
          },
        },
      }
    }
  },
  mounted() {
    this.generateComponentInstance &&
      this.generateComponentInstance(
        this.isTable
          ? `${this.isMobile ? 'm' : ''}${this.tableName}.${this.rowIndex}.${
              this.widget.model
            }`
          : this.widget.model,
        this.$refs['fm-' + this.widget.model]
      )
  },
  methods: {
    loadOptions(data) {
      if (!Array.isArray(data)) return
      this.remoteOptions = data.map((item) => {
        if (
          this.widget.options.props.children &&
          this.widget.options.props.children.length &&
          Object.keys(item).includes(this.widget.options.props.children)
        ) {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: this.processRemoteProps(
              item[this.widget.options.props.children],
              this.widget.options.props
            ),
          }
        } else {
          if (this.widget.type == 'steps') {
            return {
              value: item[this.widget.options.props.title] + '',
              label: item[this.widget.options.props.description],
            }
          } else if (this.widget.type == 'transfer') {
            return item
          } else {
            return {
              value: item[this.widget.options.props.value],
              label: item[this.widget.options.props.label],
            }
          }
        }
      })
    },
    processRemoteProps(children, props) {
      if (children && children.length) {
        return children.map((item) => {
          if (this.processRemoteProps(item[props.children], props).length) {
            return {
              value: item[props.value],
              label: item[props.label],
              children: this.processRemoteProps(item[props.children], props),
            }
          } else {
            return {
              value: item[props.value],
              label: item[props.label],
            }
          }
        })
      } else {
        return []
      }
    },
    onCascaderChange(value) {
      if (value) {
        this.$nextTick(() => {
          this.$parent && this.$parent.clearValidate()
          this.$parent &&
            this.$parent.$parent &&
            this.$parent.$parent.$refs.generateFormItem &&
            this.$parent.$parent.$refs.generateFormItem.clearValidate()
        })
      }
    },
    handleTransferChange(value) {
      this.dataModel = value
    },
    getCascaderText(value, options, texts = []) {
      if (value.length >= 1) {
        let currentOpt = options.find((opt) => opt.value == value[0])
        if (currentOpt) {
          texts.push(currentOpt.label)
        }
        value.splice(0, 1)
        return this.getCascaderText(value, currentOpt.children, texts)
      } else if (value.length == 0) {
        return texts
      }
    },
    getTreeText(value, options) {
      for (let i = 0; i < options.length; i++) {
        let currentOpt = options[i]

        if (currentOpt.value == value) {
          return currentOpt.label
        }

        if (currentOpt.children && currentOpt.children.length > 0) {
          let res = this.getTreeText(value, currentOpt.children)

          if (res == '-') {
            continue
          } else {
            return res
          }
        }
      }

      return '-'
    },
    loadUploadConfig() {
      if (this.widget.options.tokenType === 'func') {
        !this.widget.options.token &&
          this.remote[this.widget.options.tokenFunc]((data) => {
            this.widget.options.token = data
          })
      } else {
        if (this.dataSourceValue) {
          let token = this.dataSourceValue.find(
            (item) => item.key === this.widget.options.tokenDataSource
          )

          token && token.value && (this.widget.options.token = token.value)
        }
      }
    },
    handleOnClick() {
      if (this.widget.events && this.widget.events.onClick) {
        let funcKey = this.widget.events.onClick

        if (this.isTable && this.tableName) {
          this.eventFunction[funcKey]({
            field: this.widget.model,
            table: this.tableName,
            rowIndex: this.rowIndex,
          })
        } else {
          this.eventFunction[funcKey]({ field: this.widget.model })
        }
      }
    },
    handleOnFocus() {
      if (this.widget.events && this.widget.events.onFocus) {
        let funcKey = this.widget.events.onFocus

        if (this.isTable && this.tableName) {
          this.eventFunction[funcKey]({
            field: this.widget.model,
            table: this.tableName,
            rowIndex: this.rowIndex,
          })
        } else {
          this.eventFunction[funcKey]({ field: this.widget.model })
        }
      }
    },
    handleOnBlur() {
      if (this.widget.events && this.widget.events.onBlur) {
        let funcKey = this.widget.events.onBlur

        if (this.isTable && this.tableName) {
          this.eventFunction[funcKey]({
            field: this.widget.model,
            table: this.tableName,
            rowIndex: this.rowIndex,
          })
        } else {
          this.eventFunction[funcKey]({ field: this.widget.model })
        }
      }
    },
    handleOnUploadSelect(file) {
      if (this.widget.events && this.widget.events.onSelect) {
        let funcKey = this.widget.events.onSelect

        if (this.isTable && this.tableName) {
          return this.eventFunction[funcKey]({
            field: this.widget.model,
            table: this.tableName,
            rowIndex: this.rowIndex,
            file: file,
          })
        } else {
          return this.eventFunction[funcKey]({
            field: this.widget.model,
            file: file,
          })
        }
      }
    },
    handleOnUploadSuccess(file) {
      if (this.widget.events && this.widget.events.onUploadSuccess) {
        let funcKey = this.widget.events.onUploadSuccess

        if (this.isTable && this.tableName) {
          this.eventFunction[funcKey]({
            field: this.widget.model,
            table: this.tableName,
            rowIndex: this.rowIndex,
            file: file,
          })
        } else {
          this.eventFunction[funcKey]({ field: this.widget.model, file: file })
        }
      }
    },
    handleOnUploadError(file) {
      if (this.widget.events && this.widget.events.onUploadError) {
        let funcKey = this.widget.events.onUploadError

        if (this.isTable && this.tableName) {
          this.eventFunction[funcKey]({
            field: this.widget.model,
            table: this.tableName,
            rowIndex: this.rowIndex,
            file: file,
          })
        } else {
          this.eventFunction[funcKey]({ field: this.widget.model, file: file })
        }
      }
    },
    handleOnUploadProgress(file) {
      if (this.widget.events && this.widget.events.onUploadProgress) {
        let funcKey = this.widget.events.onUploadProgress

        if (this.isTable && this.tableName) {
          this.eventFunction[funcKey]({
            field: this.widget.model,
            table: this.tableName,
            rowIndex: this.rowIndex,
            file: file,
          })
        } else {
          this.eventFunction[funcKey]({ field: this.widget.model, file: file })
        }
      }
    },
    handleOnUploadRemove(file) {
      if (this.widget.events && this.widget.events.onRemove) {
        let funcKey = this.widget.events.onRemove

        if (this.isTable && this.tableName) {
          this.eventFunction[funcKey]({
            field: this.widget.model,
            table: this.tableName,
            rowIndex: this.rowIndex,
            file: file,
          })
        } else {
          this.eventFunction[funcKey]({ field: this.widget.model, file: file })
        }
      }
    },
  },
  watch: {
    modelValue(val) {
      this.dataModel = val
    },

    dataModel(val, oldValue) {
      this.$emit('update:modelValue', val)

      if (this.isTable && this.tableName) {
        this.$emit('on-table-change', {
          value: val,
          field: this.widget.model,
          table: this.tableName,
          rowIndex: this.rowIndex,
          haveEvent: this.widget.events && this.widget.events.onChange,
        })
      }
    },
    remoteOption: {
      deep: true,
      handler: function (val) {
        if (
          Object.keys(this.remoteOption).indexOf(
            this.widget.options.remoteOption
          ) >= 0 &&
          this.widget.options.remote &&
          this.widget.options.remoteType == 'option'
        ) {
          this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
        }
      },
    },
    dataSourceValue: {
      deep: true,
      handler: function (val) {
        if (this.dataSourceValue) {
          let options = this.dataSourceValue.find(
            (item) =>
              item.key ===
              (this.isTable
                ? this.tableName + '.' + this.widget.model
                : this.widget.model) +
                '.' +
                this.widget.options.remoteDataSource
          )

          options && options.value && this.loadOptions(options.value)
        }

        if (
          (this.widget.type === 'imgupload' ||
            this.widget.type === 'fileupload') &&
          this.widget.options.isQiniu
        ) {
          this.loadUploadConfig()
        }
      },
    },
  },
}
</script>
