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
                <QueryBarItem label="角色名" :label-width="50">
                    <n-input v-model:value="queryItems.name" type="text" placeholder="请输入角色名"
                        @keypress.enter="$table?.handleSearch" />
                </QueryBarItem>
            </template>
        </CrudTable>

        <!-- 新增/编辑/查看 -->
        <CrudModal v-model:visible="modalVisible" :title="modalTitle" :loading="modalLoading"
            :show-footer="modalAction !== 'view'" @save="handleSave">
            <n-form ref="modalFormRef" label-placement="top" label-align="left" :model="modalForm"
                :disabled="modalAction === 'view'">



                <n-form-item label="角色名" path="name" :rule="{
                    required: true,
                    message: '请输入角色名',
                    trigger: ['input', 'blur'],
                }">
                    <n-input v-model:value="modalForm.name" placeholder="请输入角色名" />
                </n-form-item>

                <n-form-item label="角色代码" path="key" :rule="{}">
                    <n-input v-model:value="modalForm.key" placeholder="请输入角色代码" />
                </n-form-item>

                <n-form-item label="状态">
                    <n-space>
                        <n-switch v-model:value="modalForm.isDisabled">
                            <template #checked>
                                已禁用
                            </template>
                            <template #unchecked>
                                未禁用
                            </template>
                        </n-switch>
                    </n-space>
                </n-form-item>


                <n-form-item label="菜单权限" path="menus" :rule="{
                    required: true,
                    validator(rule, value) {
                        if (value.length === 0) {
                            return false
                        }
                        return true
                    },
                    message: '请选择菜单',
                    trigger: ['change', 'blur'],
                }">
                    <n-tree-select :options="pageInfo.menus" multiple cascade checkable label-field="name" key-field="id"
                    v-model:value="modalForm.menus" filterable />
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


import { NButton, NSwitch, NSpace, NTooltip, NDropdown, NTreeSelect, NUpload, NUploadDragger, NTag } from 'naive-ui'
import { formatDateTime, renderIcon, isNullOrUndef } from '@/utils'
import { useCRUD } from '@/composables'
import api from './api'
import { computed } from 'vue'

defineOptions({ name: 'Userlist' })


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



// const imgList = ref([])



// 批量操作
const batchActions = ref([
    {
        label: '批量禁用',
        key: 'batchDisabled',
        disabled: computed(() => selectedCount.value == 0),
        onSelect: (pageData) => {
            console.log('禁用选中项', selectedKeys.value);
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
    title: '用户',
    initForm: {},
    rowKey: 'id',
    api: {
        list: api.getRoles,
        add: api.addRole,
        del: api.deleteRole,
        edit: api.updateRole,
        menu: api.getMenus,
    },
    columns: [
        {
            type: 'selection', fixed: 'left', options: batchActions.value
        },
        {
            title: '禁用',
            key: 'isDisabled',
            width: 60,
            align: 'center',
            fixed: 'left',
            render(row) {
                return h(NSwitch, {
                    size: 'small',
                    rubberBand: false,
                    value: row['isDisabled'],
                    loading: !!row.disabling,
                    onUpdateValue: () => handlePublish(row),
                })
            },
        },
        {
            title: '角色名称', key: 'name',
        },
        {
            title: '角色代码', key: 'key',
        },
        {
            title: '描述', key: 'description',
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
    menus: [],

})



onMounted(() => {
    watchEffect(async () => {
        if (modalVisible.value == true) {
            const { data } = await pageInfo.api.menu();
            pageInfo.menus = data.pageData;
            modalForm.value.menus = modalForm.value.menus.map(i=>i.id);
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

// swtich
function handlePublish(row) {
    if (isNullOrUndef(row.id)) return
    row.disabling = true

    setTimeout(() => {
        row.isDisabled = !row.isDisabled
        row.disabling = false
        $message?.success(row.isDisabled ? '已禁用' : '已取消禁用')
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