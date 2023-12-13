<template>
  <CommonPage show-footer :title="pageInfo.title">
    <template #action>
      <n-space>
        <NTooltip>
          <template #trigger>
            <n-button type="default" secondary @click="$table?.handleSearch">
              <TheIcon icon="majesticons:reload" :size="18" />
            </n-button>
          </template>
          刷新
        </NTooltip>
        <NTooltip>
          <template #trigger>
            <n-button type="primary" secondary @click="$table?.handleExport()">
              <TheIcon icon="mdi:download" :size="18" />
            </n-button>
          </template>
          导出
        </NTooltip>
        <NTooltip>
          <template #trigger>
            <n-button type="primary" @click="handleAdd">
              <TheIcon icon="material-symbols:add" :size="18" />
            </n-button>
          </template>
          新建
        </NTooltip>
      </n-space>
    </template>

    <CrudTable ref="$table" :row-key="pageInfo.rowKey" v-model:query-items="queryItems" :extra-params="extraParams"
      :scroll-x="1200" :columns="pageInfo.columns" :get-data="pageInfo.api.list" @on-checked="onChecked"
      @on-data-change="(data) => (tableData = data)">
      <template #queryBar>
        <QueryBarItem label="标题" :label-width="50">
          <n-input v-model:value="queryItems.title" type="text" placeholder="请输入标题"
            @keypress.enter="$table?.handleSearch" />
        </QueryBarItem>
      </template>
    </CrudTable>

    <!-- 新增/编辑/查看 -->
    <CrudModal v-model:visible="modalVisible" :title="modalTitle" :loading="modalLoading"
      :show-footer="modalAction !== 'view'" width="1200px" @save="handleSave">
      <n-form ref="modalFormRef" label-placement="top" label-align="left" :model="modalForm"
        :disabled="modalAction === 'view'">

        <div class="grid grid-cols-[320px_1fr] gap-8">

          <div>
            <n-form-item label="文章标题" path="title" :rule="{
              required: true,
              message: '请输入文章标题',
              trigger: ['input', 'blur'],
            }">
              <n-input v-model:value="modalForm.title" placeholder="请输入文章标题" />
            </n-form-item>

            <n-form-item label="分类" path="category" :rule="{
              required: true,
              message: '请选择分类',
              trigger: ['change', 'blur'],
            }">
              <n-tree-select :options="pageInfo.cags" label-field="title" key-field="name"
                v-model:value="modalForm.category" filterable />
            </n-form-item>

            <n-form-item label="简介" path="description" :rule="{}">
              <n-input v-model:value="modalForm.description" placeholder="请输入简介" type="textarea" :autosize="{
                minRows: 3,
                maxRows: 5,
              }" />
            </n-form-item>

            <n-form-item label="状态">
              <n-space>
                <n-switch v-model:value="modalForm.isPublish">
                  <template #checked>
                    发布
                  </template>
                  <template #unchecked>
                    不发布
                  </template>
                </n-switch>

                <n-switch v-model:value="modalForm.isRecommend">
                  <template #checked>
                    推荐
                  </template>
                  <template #unchecked>
                    不推荐
                  </template>
                </n-switch>
              </n-space>
            </n-form-item>


            <n-form-item label="封面" path="cover">
              <n-upload class="gird_1 _16x9" :custom-request="handleUpload" :max="1" accept=".png,.jpg,.jpeg,.gif"
                @before-upload="onBeforeUpload" :default-file-list="imgList" list-type="image-card">
                <n-upload-dragger class="p-0 !border-0">
                  <div class="f-c-c flex-col gap-12">
                    <TheIcon icon="mdi:upload" :size="48" />
                    <n-text class="text-14 c-gray">点击或者拖动文件到该区域来上传，图片格式（png jpg jpeg gif）</n-text>
                  </div>
                </n-upload-dragger>
              </n-upload>
              <n-input v-model:value="modalForm.cover" class="hidden" />
            </n-form-item>


            <n-form-item label="作者" path="author">
              <n-input v-model:value="modalForm.author" disabled />
            </n-form-item>
          </div>


          <n-form-item label="文章内容" path="content" :rule="{
            required: true,
            message: '请输入文章内容',
            trigger: ['input', 'blur'],
          }">
            <div
              class="border-1 border-solid border-black/10 min-h-500 h-full flex-col rounded-[var(--n-border-radius)] overflow-hidden">
              <WangToolbar :editor="editorRef" :default-config="toolbarConfig" mode="default" />
              <WangEditor v-model="modalForm.content" style="flex: 1; overflow-y: hidden" :default-config="editorConfig"
                mode="default" @on-created="($event) => handleCreated($event, modalAction)" />
            </div>
          </n-form-item>


        </div>



      </n-form>
    </CrudModal>
  </CommonPage>
</template>
  
<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor as WangEditor, Toolbar as WangToolbar } from '@wangeditor/editor-for-vue'

import {NSwitch, NSpace, NTooltip, NDropdown, NEllipsis, NImage } from 'naive-ui'
import { formatDateTime, renderIcon, isNullOrUndef, lStorage } from '@/utils'
import { useCRUD } from '@/composables'
import api from './api'
import { computed } from 'vue'

defineOptions({ name: 'Postlist' })


const $table = ref(null)
/** 表格数据，触发搜索的时候会更新这个值 */
const tableData = ref([])
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/** 补充参数（可选） */
const extraParams = ref({})
// 选中数量
const selectedCount = ref(0)
const selectedKeys = ref([])

// 封面
const imgList = ref([])

// 批量操作
const batchActions = ref([
  {
    label: '批量发布',
    key: 'batchPublic',
    disabled: computed(() => selectedCount.value == 0),
    onSelect: (pageData) => {
      console.log('发布选中项', selectedKeys.value);
      //请求
    }
  },
  {
    key: "header-divider",
    type: "divider"
  },
  {
    label: '批量删除',
    key: 'batchDel',
    disabled: computed(() => selectedCount.value == 0),
    onSelect: (pageData) => {
      console.log('删除选中项', selectedKeys.value);
      //请求
    }
  }
])

// 页面数据
const pageInfo = reactive({
  title: '文章',
  initForm: { author: lStorage.get('LOGININFO').username, },
  api: {
    list: api.getPosts,
    add: api.addPost,
    del: api.deletePost,
    edit: api.updatePost,
    cags: api.getCags,
  },
  rowKey: 'title',
  columns: [
    {
      type: 'selection', fixed: 'left', options: batchActions.value
    },
    {
      title: '发布',
      key: 'isPublish',
      width: 60,
      align: 'center',
      fixed: 'left',
      render(row) {
        return h(NSwitch, {
          size: 'small',
          rubberBand: false,
          value: row['isPublish'],
          loading: !!row.publishing,
          onUpdateValue: () => handlePublish(row),
        })
      },
    },
    {
      title: '封面',
      key: 'cover',
      width: 110,
      render(row) {
        return h(NImage, {
          width: 100, height: 100, src: convertImgUrl(row.cover, { text: '封面', size: '100x1:1' }), objectFit: "contain", lazy: true,
          fallbackSrc: "//fakeimg.pl/100x100/?retina=1&text=加载错误&font=noto",
          class: 'block',
          imgProps: {
            style: {
              display: 'block',
              width: '100%',
              height: '100%',
              "object-fit": 'contain',
            }

          }
        })
      }
    },
    {
      title: '内容', key: 'post', ellipsis: { tooltip: true },
      render(row) {
        return h(NSpace, { vertical: true, size: 'small' }, {
          default: () => [h(NEllipsis, {}, { default: () => h('strong', row.title) }), h(NEllipsis, {}, { default: () => row.description })]
        })
      }
    },
    { title: '分类', key: 'category', width: 100, ellipsis: { tooltip: true } },
    { title: '创建人', key: 'author', width: 80 },
    {
      title: '创建时间',
      key: 'createDate',
      width: 180,
      render(row) {
        return h('span', formatDateTime(row['createDate']))
      },
    },
    {
      title: '最后更新时间',
      key: 'updateDate',
      width: 180,
      render(row) {
        return h('span', formatDateTime(row['updateDate']))
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 220,
      align: 'center',
      fixed: 'right',
      hideInExcel: true,
      render(row) {
        return h(NSpace, null, {
          default: () => [
            h(NTooltip, { showArrow: false }, {
              default: () => '查看',
              trigger: () => h(
                NButton,
                {
                  size: 'small',
                  type: 'primary',
                  secondary: true,
                  onClick: () => handleView(row),
                },
                { icon: renderIcon('majesticons:eye-line', { size: 14 }) }
              ),
            }),
            h(NTooltip, { showArrow: false }, {
              default: () => '编辑',
              trigger: () =>
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'primary',
                    onClick: () => handleEdit(row),
                  },
                  { icon: renderIcon('material-symbols:edit-outline', { size: 14 }) }
                ),
            }),
            h(NTooltip, { showArrow: false }, {
              default: () => '删除',
              trigger: () =>
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'error',
                    onClick: () => handleDelete(row.id),
                  },
                  {
                    icon: renderIcon('material-symbols:delete-outline', { size: 14 }),
                  }
                ),
            }),
            h(NDropdown, {
              placement: 'bottom-end',
              options: [
                {
                  label: "更多菜单",
                  key: "more",
                },
                {
                  label: '布朗酒店，伦敦',
                  key: "brown's hotel, london"
                },
              ],
              renderLabel: (option) => h('div', {
                onClick: () => {
                  $message.info(option.label);
                }
              }, {
                default: () => option.label
              })
            }, {
              default: () => h(
                NButton, {
                tertiary: true,
                size: 'small',
              }, {
                icon: renderIcon('pepicons-pop:dots-y', { size: 14 }),
              }
              )

            }),

          ]
        })
      },
    },
  ],
  cags: [],

})



// 编辑器
const editorRef = shallowRef()
const toolbarConfig = { excludeKeys: 'fullScreen' }
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} }
// const valueHtml = ref('')
const handleCreated = (editor, view) => {
  editorRef.value = editor
  if (view == 'view') {
    editor.disable()
  }
}

onMounted(() => {
  watchEffect(async () => {
    if (modalVisible.value == true) {
      const { data } = await pageInfo.api.cags();
      pageInfo.cags = data.pageData;
      // console.log(modalForm);
      if (modalForm.value.cover) {
        imgList.value.push({ fileName: 'cover', url: modalForm.value.cover, status: "finished" })
      }
    } else {
      imgList.value = [];
    }
  })
})

onActivated(() => {
  $table.value?.handleSearch()
})



function onBeforeUpload({ file }) {
  if (!file.file?.type.startsWith('image/')) {
    $message.error('只能上传图片')
    return false
  }
  return true
}

async function handleUpload({ file, onFinish }) {
  if (!file || !file.type) {
    $message.error('请选择文件')
  }

  // 模拟上传
  $message.loading('上传中...')
  setTimeout(() => {
    $message.success('上传成功')
    imgList.value.push({ fileName: file.name, url: URL.createObjectURL(file.file), status: "finished" })
    modalForm.value.cover = URL.createObjectURL(file.file);
    onFinish()
  }, 1500)
}






// 选中事件
function onChecked(rowKeys) {
  selectedCount.value = rowKeys.length
  selectedKeys.value = rowKeys;
  // if (rowKeys.length) $message.info(`选中${rowKeys.join(' ')}`)
}

// 发布
function handlePublish(row) {
  if (isNullOrUndef(row.id)) return

  row.publishing = true
  setTimeout(() => {
    row.isPublish = !row.isPublish
    row.publishing = false
    $message?.success(row.isPublish ? '已发布' : '已取消发布')
  }, 1000)
}

const {
  modalVisible,
  modalAction,
  modalTitle,
  modalLoading,
  handleAdd,
  handleDelete,
  handleEdit,
  handleView,
  handleSave,
  modalForm,
  modalFormRef,
} = useCRUD({
  name: pageInfo.title,
  initForm: pageInfo.initForm,
  doCreate: pageInfo.api.add,
  doDelete: pageInfo.api.del,
  doUpdate: pageInfo.api.edit,
  refresh: () => $table.value?.handleSearch(),
})



</script>
  

<style scoped></style>