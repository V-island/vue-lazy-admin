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

        <CrudTable ref="$table" row-key="title" v-model:query-items="queryItems" :extra-params="extraParams"
            :scroll-x="1200" :columns="pageInfo.columns" :get-data="pageInfo.api.list" @on-checked="onChecked"
            @on-data-change="(data) => (tableData = data)">
            <template #queryBar>
                <QueryBarItem label="名称" :label-width="50">
                    <n-input v-model:value="queryItems.title" type="text" placeholder="请输入名称"
                        @keypress.enter="$table?.handleSearch" />
                </QueryBarItem>
            </template>
        </CrudTable>

        <!-- 新增/编辑/查看 -->
        <CrudModal v-model:visible="modalVisible" :title="modalTitle" :loading="modalLoading"
            :show-footer="modalAction !== 'view'" @save="handleSave">
            <n-form ref="modalFormRef" label-placement="top" label-align="left" :model="modalForm"
                :disabled="modalAction === 'view'">

                <n-form-item label="父级" path="parent" :rule="{
                    required: true,
                    message: '请选择父级',
                    trigger: ['change', 'blur'],
                }">
                    <n-tree-select :options="pageInfo.cags" label-field="title" key-field="name" default-value="root"
                        v-model:value="modalForm.parent" filterable />
                </n-form-item>

                <n-form-item label="分类名称" path="title" :rule="{
                    required: true,
                    message: '请输入分类名称',
                    trigger: ['input', 'blur'],
                }">
                    <n-input v-model:value="modalForm.title" placeholder="请输入分类名称" />
                </n-form-item>

                <n-form-item label="别名" path="name" :rule="{
                    required: true,
                    message: '请输入别名',
                    trigger: ['input', 'blur'],
                }">
                    <n-input v-model:value="modalForm.name" placeholder="请输入别名" />
                </n-form-item>

                <n-form-item label="描述" path="description" :rule="{}">
                    <n-input v-model:value="modalForm.description" placeholder="请输入描述" type="textarea" :autosize="{
                        minRows: 3,
                        maxRows: 5,
                    }" />
                </n-form-item>

            </n-form>
        </CrudModal>
    </CommonPage>
</template>
    
<script setup>

import { NButton, NSwitch, NSpace, NTooltip, NDropdown, NTreeSelect } from 'naive-ui'
import { formatDateTime, renderIcon, isNullOrUndef } from '@/utils'
import { useCRUD } from '@/composables'
import api from './api'

defineOptions({ name: 'Postcag' })

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
    title: '分类',
    initForm: {},
    api: {
        list: api.getCags,
        add: api.addCag,
        del: api.deleteCag,
        edit: api.updateCag,
        cags: api.getCags,
    },
    columns: [
        { type: 'selection', fixed: 'left', options: batchActions.value },
        { title: '名称', key: 'title', ellipsis: { tooltip: true } },
        { title: '别名', key: 'name', ellipsis: { tooltip: true } },
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
                        h(NDropdown,
                            {
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
                            },
                            {
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
    cags: []
})




onMounted(() => {
    watchEffect(async () => {
        if (modalVisible.value == true) {
            const { data } = await pageInfo.api.cags();
            pageInfo.cags = [{ title: '根目录', name: 'root' }, ...data.pageData];
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