<template>
    <CommonPage :title="pageInfo.title">
        <template #action>
            <NSpace>
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
                        <NButton type="primary" @click="handleAdd">
                            <TheIcon icon="mdi:upload" :size="18" />
                        </NButton>
                    </template>
                    上传
                </NTooltip>
            </NSpace>
        </template>

        <CrudTable ref="$table" :row-key="pageInfo.rowKey" v-model:query-items="queryItems" :extra-params="extraParams"
            :scroll-x="1200" :columns="pageInfo.columns" :get-data="pageInfo.api.list" @on-checked="onChecked"
            @on-data-change="(data) => (tableData = data)">
            <!-- <template #queryBar>
                <QueryBarItem label="文件名" :label-width="50">
                    <n-input v-model:value="queryItems.name" type="text" placeholder="请输入文件名"
                        @keypress.enter="$table?.handleSearch" />
                </QueryBarItem>
            </template> -->
        </CrudTable>

        <CrudModal v-model:visible="modalVisible" :title="pageInfo.setModaltitle" :loading="modalLoading"
            :show-footer="modalAction !== 'view' && modalAction !== 'add'" @save="handleSave">
            <n-form ref="modalFormRef" label-placement="top" label-align="left" :model="modalForm"
                :disabled="modalAction === 'view'">

                <template v-if="modalAction == 'add'">
                    <div class="w-full min-h-[600px]">
                        <n-space vertical>

                            <n-alert title="上传请注意" type="info">
                                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码<br>
                                每个文件最大不超过{{ pageInfo.maxFileSize }}MB，每次上传数量不超过{{ pageInfo.maxFileCount }}个

                                <n-space>
                                    支持文件格式：
                                    <span v-for="item, index in pageInfo.fileTypes" :key="index">{{ item }}</span>
                                </n-space>

                            </n-alert>

                            <n-upload :custom-request="handleUpload" multiple directory-dnd :max="pageInfo.maxFileCount"
                                @before-upload="onBeforeUpload" :default-file-list="fileList">
                                <n-upload-dragger>
                                    <n-space vertical>
                                        <TheIcon icon="mdi:upload" :size="48" />
                                        <n-text style="font-size: 16px">
                                            点击或者拖动文件到该区域来上传
                                        </n-text>
                                    </n-space>
                                </n-upload-dragger>
                            </n-upload>
                        </n-space>
                    </div>
                </template>
                <template v-else>
                    <n-form-item label="别名" path="name">
                        <n-input v-model:value="modalForm.name" />
                    </n-form-item>
                </template>
            </n-form>
        </CrudModal>


    </CommonPage>
</template>

<script setup>
import { reactive } from 'vue'
import { NForm, NFormItem, NButton, NImage, NSwitch, NAlert, NSpace, NTooltip, NDropdown, NTreeSelect, NUpload, NUploadDragger } from 'naive-ui'
import { formatDateTime, renderIcon, isNullOrUndef,convertImgUrl } from '@/utils'
import { useCRUD } from '@/composables'
import api from './api'

defineOptions({ name: 'Storagelist' })

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

// 批量操作
const batchActions = ref([
    // {
    //     label: '批量发布',
    //     key: 'batchPublic',
    //     disabled: computed(() => selectedCount.value == 0),
    //     onSelect: (pageData) => {
    //         console.log('发布选中项', selectedKeys.value);
    //         //请求
    //     }
    // },
    // {
    //     key: "header-divider",
    //     type: "divider"
    // },
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
    title: '媒体库',
    rowTitle: '',
    setModaltitle: computed(() => pageInfo.rowTitle != '' ? pageInfo.rowTitle : modalTitle.value),
    initForm: {},
    maxFileSize: 10,
    maxFileCount: 20,
    api: {
        list: api.getList,
        add: api.addItem,
        del: api.deleteItem,
        edit: api.updateItem,
        // cags: api.getCags,
    },
    // cags: [],
    fileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'png', 'gif', 'mp4', 'mp3', 'zip', 'rar', '7z', 'txt'],
    rowKey: 'id',
    columns: [
        {
            type: 'selection', fixed: 'left', options: batchActions.value
        },
        {
            title: '预览',
            key: 'preview',
            width: 110,
            render(row) {
                return h(NImage, {
                    width: 100, height: 100, src: convertImgUrl(row.url,{text:'预览',size:'100x1:1'}), lazy: true, fallbackSrc: "//fakeimg.pl/100x100/?retina=1&text=加载错误&font=noto",
                    imgProps: {
                        style: {
                            width: '100%',
                            height: '100%',
                            "object-fit": 'contain',
                        }

                    }
                })
            }
        },
        {
            title: '文件名',
            key: 'fileName',
            ellipsis: true,
        },
        {
            title: '别名',
            key: 'name',
            ellipsis: true,
        },
        {
            title: '上传时间',
            key: 'createDate',
            width: 180,
            render(row) {
                return h('span', formatDateTime(row['createDate']))
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
                            default: () => '编辑',
                            trigger: () =>
                                h(
                                    NButton,
                                    {
                                        size: 'small',
                                        type: 'primary',
                                        onClick: () => handleEdit(row, () => pageInfo.rowTitle = `编辑 ${row.fileName}`),
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
    ]

})
// 文件列表
const fileList = ref([])


onMounted(() => {
    watchEffect(async () => {
        if (modalVisible.value == true) {
            //   const { data } = await pageInfo.api.cags();
            //   pageInfo.cags = data.pageData;
            //   // console.log(modalForm);
            //   if (modalForm.value.cover) {
            //     imgList.value.push({ fileName: 'cover', url: modalForm.value.cover, status: "finished" })
            //   }
        } else {
            fileList.value = [];
            pageInfo.rowTitle = '';
        }
    })
})

onActivated(() => {
    $table.value?.handleSearch()
})





// 选中事件
function onChecked(rowKeys) {
    selectedCount.value = rowKeys.length
    selectedKeys.value = rowKeys;
    // if (rowKeys.length) $message.info(`选中${rowKeys.join(' ')}`)
}

function onBeforeUpload({ file }) {
    // if (!file.file?.type.startsWith('image/')) {
    //     $message.error('只能上传图片')
    //     return false
    // }
    return true
}

async function handleUpload({ file, onFinish }) {
    if (!file || !file.type) {
        $message.error('请选择文件')
    }

    // 模拟上传
    $message.loading(`${file.name} 上传中...`)
    setTimeout(() => {
        $message.success(`${file.name} 上传成功`)
        fileList.value.push({ fileName: file.name, url: URL.createObjectURL(file.file), status: "finished" })
        modalForm.value.cover = URL.createObjectURL(file.file);
        onFinish()
    }, 1500)
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