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
                <QueryBarItem label="用户名" :label-width="50">
                    <n-input v-model:value="queryItems.name" type="text" placeholder="请输入用户名"
                        @keypress.enter="$table?.handleSearch" />
                </QueryBarItem>
            </template>
        </CrudTable>

        <!-- 新增/编辑/查看 -->
        <CrudModal v-model:visible="modalVisible" :title="modalTitle" :loading="modalLoading"
            :show-footer="modalAction !== 'view'" @save="handleSave">
            <n-form ref="modalFormRef" label-placement="top" label-align="left" :model="modalForm"
                :disabled="modalAction === 'view'">


                <div class="grid grid-cols-[200px_1fr] gap-16">
                    <div>
                        <n-form-item label="头像" path="avatar">
                            <n-upload class="gird_1 _1x1" :custom-request="handleUpload" :max="1"
                                accept=".png,.jpg,.jpeg,.gif" @before-upload="onBeforeUpload" :default-file-list="imgList"
                                list-type="image-card">

                                <n-upload-dragger class="p-0 !border-0">
                                    <div class="f-c-c flex-col gap-12">
                                        <TheIcon icon="mdi:upload" :size="48" />
                                        <n-text class="text-14 c-gray">上传头像，图片格式（png jpg jpeg gif）</n-text>
                                    </div>
                                </n-upload-dragger>

                            </n-upload>
                            <n-input v-model:value="modalForm.avatar" class="hidden" />
                        </n-form-item>
                    </div>
                    <div>
                        <n-form-item label="用户名" path="name" :rule="{
                            required: true,
                            message: '请输入用户名',
                            trigger: ['input', 'blur'],
                        }">
                            <n-input v-model:value="modalForm.name" placeholder="请输入用户名" />
                        </n-form-item>

                        <n-form-item label="昵称" path="nickname" :rule="{}">
                            <n-input v-model:value="modalForm.nickname" placeholder="请输入昵称" />
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
                    </div>
                </div>


                <n-form-item label="角色" path="role" :rule="{
                    required: true,
                    validator(rule, value) {
                        if (value.length === 0) {
                            return false
                        }
                        return true
                    },
                    message: '请选择角色',
                    trigger: ['change', 'blur'],
                }">
                    <n-select :options="pageInfo.roles" multiple label-field="name" value-field="key"
                        v-model:value="modalForm.role" filterable />
                </n-form-item>



                <div class="grid grid-cols-2 gap-16">
                    <n-form-item label="邮箱" path="email">
                        <n-input v-model:value="modalForm.email" />
                    </n-form-item>

                    <n-form-item label="手机" path="phone">
                        <n-input v-model:value="modalForm.phone" />
                    </n-form-item>
                </div>

                <n-form-item label="描述" path="description" :rule="{}">
                    <n-input v-model:value="modalForm.description" placeholder="请输入描述" type="textarea" :autosize="{
                        minRows: 3,
                        maxRows: 5,
                    }" />
                </n-form-item>


                <n-form-item label="备注" path="mark" :rule="{}">
                    <n-input v-model:value="modalForm.mark" placeholder="请输入备注" type="textarea" :autosize="{
                        minRows: 3,
                        maxRows: 5,
                    }" />
                </n-form-item>

            </n-form>
        </CrudModal>


        <!-- 修改密码 -->
        <NModal v-model:show="pswModal.show" preset="card" :title="pswModal.title" :style="pswModal.style">
            <NForm :ref="(el) => pswModal.form = el" :model="pswModal.modalForm" :rules="pswModal.rules">
                <n-form-item path="password" label="密码">
                    <n-input v-model:value="pswModal.modalForm.password" type="password"
                        @input="pswModal.handlePasswordInput" @keydown.enter.prevent size="large" />
                </n-form-item>
                <n-form-item :ref="(el) => pswModal.rPasswordFormItemRef = el" first path="reenteredPassword" label="重复密码">
                    <n-input v-model:value="pswModal.modalForm.reenteredPassword" :disabled="!pswModal.modalForm.password"
                        type="password" @keydown.enter.prevent size="large" />
                </n-form-item>
            </NForm>

            <template #footer>
                <NSpace justify="end">
                    <NButton @click="pswModal.show = false">取消</NButton>
                    <NButton type="primary" @click="pswModal.save" :loading="pswModal.loading">确定</NButton>
                </NSpace>
            </template>
        </NModal>
    </CommonPage>
</template>

<script setup>


import { NButton, NSwitch, NSpace, NTooltip, NDropdown, NSelect, NUpload, NUploadDragger, NTag } from 'naive-ui'
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


// 封面
const imgList = ref([])

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

// 修改密码
const pswModal = reactive({
    loading: false,
    show: false,
    style: { width: "600px" },
    title: '修改密码',
    form: null,
    rPasswordFormItemRef: null,
    modalForm: {
        password: '',
        reenteredPassword: ''
    },
    save: () => {
        // console.log(pswModal.form);
        // $message.info('save')
        const formRef = pswModal.form;
        formRef?.validate((errors) => {
            if (!errors) {
                $message.success("验证成功");
                pswModal.loading = true;

                setTimeout(() => {
                    pswModal.show = false
                }, 500)


            } else {
                console.log(errors);
                $message.error("验证失败");
            }
        });
    },
    handlePasswordInput: () => {
        // console.log(pswModal.modalForm);
        if (pswModal.modalForm.reenteredPassword) {
            pswModal.rPasswordFormItemRef.value?.validate({ trigger: "password-input" });
        }
    },
    validatePasswordStartWith: (rule, value) => {
        const modelRef = pswModal.modalForm
        console.log(modelRef);
        return !!modelRef.password && modelRef.password.startsWith(value) && modelRef.password.length >= value.length;
    },
    validatePasswordSame: (rule, value) => {
        const modelRef = pswModal.modalForm
        return value === modelRef.password;
    },
    rules: {
        password: [
            {
                required: true,
                message: "请输入密码"
            }
        ],
        reenteredPassword: [
            {
                required: true,
                message: "请再次输入密码",
                trigger: ["input", "blur"]
            },
            {
                validator: (rule, value) => {
                    const modelRef = pswModal.modalForm
                    return !!modelRef.password && modelRef.password.startsWith(value) && modelRef.password.length >= value.length;
                },
                message: "两次密码输入不一致",
                trigger: "input"
            },
            {
                validator: (rule, value) => {
                    const modelRef = pswModal.modalForm
                    return value === modelRef.password;
                },
                message: "两次密码输入不一致",
                trigger: ["blur", "password-input"]
            }
        ]
    },

})

// 页面数据
const pageInfo = reactive({
    title: '用户',
    initForm: {},
    rowKey: 'id',
    api: {
        list: api.getUsers,
        add: api.addUser,
        del: api.deleteUser,
        edit: api.updateUser,
        roles: api.getRoles,
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
            title: '账号', key: 'account', render: (row) => {
                return h(NSpace, { vertical: true, size: 'small' }, { default: () => [h('strong', row.name), h('div', row.nickname)] })
            }
        },
        {
            title: '角色', key: 'role', render: (row) => {
                const roles = row.role.map((item) => h(NTag, {
                    type: "success",
                }, {
                    default: () => pageInfo.roles.find(c => c.key === item)?.name || item
                }))
                return h(NSpace, { size: 'small' }, { default: () => roles })
            }
        },
        {
            title: '联系方式', key: 'contact', render: (row) => {
                return h(NSpace, { vertical: true, size: 'small' }, { default: () => [h('div', row.email), h('div', row.mobile)] })
            }
        },
        {
            title: '其他信息', key: 'other', render: (row) => {
                return h(NSpace, { vertical: true, size: 'small' }, { default: () => [h('div', row.description)] })
            }
        },
        {
            title: '备注', key: 'mark',
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
                                    label: '修改密码',
                                    key: "changePW"
                                },
                            ],
                            renderLabel: (option) => h('div', {
                                onClick: () => {
                                    // $message.info(option.label);
                                    if (option.key === "changePW") {
                                        pswModal.show = true;
                                    }
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
    roles: [],

})

const getData = async () => {
    const { data } = await pageInfo.api.roles();
    pageInfo.roles = data.pageData;
}

onMounted(() => {
    watchEffect(() => {
        if (modalVisible.value == true) {
            getData()
            // console.log(modalForm);
            if (modalForm.value.avatar) {
                imgList.value.push({ fileName: 'avatar', url: modalForm.value.avatar, status: "finished" })
            }
        } else {
            imgList.value = [];
        }
    })
})

onActivated(() => {
    getData()
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
        modalForm.value.avatar = URL.createObjectURL(file.file);
        onFinish()
    }, 1500)
}






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
