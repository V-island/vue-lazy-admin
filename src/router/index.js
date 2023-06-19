import { createRouter, createWebHashHistory } from 'vue-router';
import { beforeHook, afterHook } from './routerHooks';
import Layout from 'layout';
import PreviewLayout from 'layout/other/previewLayout';

// 路由表
const routes = [
  {
    path: '/',
    redirect: {
      name: process.env.VUE_APP_ISC_LOGIN === 'true' ? 'login' : 'freeLogin',
    },
  },
  {
    path: '/freeLogin',
    name: 'freeLogin',
    meta: {
      title: '登录',
    },
    component: () => import('views/common/FreeLogin.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
    },
    component: () => import('views/common/Login.vue'),
  },
  {
    path: '/layout',
    name: 'layout',
    component: Layout,
    redirect: { name: 'home' },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '首页',
        },
        component: () => import('views/common/Home.vue'),
      },
      // 支持直接传递第三方url，打开iframe, router.push('/iframe??iframeUrl=http://localhost:8088/ureport/designer?_u=file:22.ureport.xml&title=编辑报表')
      {
        path: 'iframe',
        component: () => import('layout/other/empty'),
        meta: { target: 'iframe' },
      },
    ],
  },
  // 动态表单
  {
    path: '/form',
    name: 'form',
    component: Layout,
    redirect: { name: 'formMakeFormList' },
    children: [
      {
        path: 'MakeFormList',
        name: 'formMakeFormList',
        meta: {
          title: '表单设计器',
        },
        component: () => import('views/modules/form/MakeFormList.vue'),
      },
      {
        path: 'generateList',
        name: 'formGenerateList',
        meta: { title: '列表' },
        component: () => import('views/modules/form/GenerateList.vue'),
      },
    ],
  },
  // 流程应用
  {
    path: '/flowable',
    name: 'flowable',
    component: Layout,
    redirect: { name: 'flowableTaskTodoList' },
    children: [
      {
        path: 'task/TodoList',
        name: 'flowableTaskTodoList',
        meta: {
          title: '待办任务',
        },
        component: () => import('views/modules/flowable/task/TodoList.vue'),
      },
      {
        path: 'task/HistoryList',
        name: 'flowableTaskHistoryList',
        meta: {
          title: '已办事项',
        },
        component: () => import('views/modules/flowable/task/HistoryList.vue'),
      },
      {
        path: 'task/ProcessList',
        name: 'flowableTaskProcessList',
        meta: {
          title: '发起流程',
        },
        component: () => import('views/modules/flowable/task/ProcessList.vue'),
      },
      {
        path: 'task/ApplyList',
        name: 'flowableTaskApplyList',
        meta: {
          title: '我发起的',
        },
        component: () => import('views/modules/flowable/task/ApplyList.vue'),
      },
      {
        path: 'extension/FlowCopyList',
        name: 'flowableExtensionFlowCopyList',
        meta: {
          title: '抄送事项',
        },
        component: () => import('views/modules/flowable/extension/FlowCopyList.vue'),
      },
      {
        path: 'process/ModelList',
        name: 'flowableProcessModelList',
        meta: {
          title: '流程设计',
        },
        component: () => import('views/modules/flowable/process/ModelList.vue'),
      },
      {
        path: 'extension/ConditionList',
        name: 'flowableExtensionConditionList',
        meta: {
          title: '流程表达式',
        },
        component: () => import('views/modules/flowable/extension/ConditionList.vue'),
      },
      {
        path: 'extension/ButtonList',
        name: 'flowableExtensionButtonList',
        meta: {
          title: '常用按钮',
        },
        component: () => import('views/modules/flowable/extension/ButtonList.vue'),
      },
      {
        path: 'extension/ActCategoryList',
        name: 'flowableExtensionActCategoryList',
        meta: {
          title: '分类管理',
        },
        component: () => import('views/modules/flowable/extension/ActCategoryList.vue'),
      },
      {
        path: 'extension/ListenerList',
        name: 'flowableExtensionListenerList',
        meta: {
          title: '流程监听器',
        },
        component: () => import('views/modules/flowable/extension/ListenerList.vue'),
      },
      {
        path: 'process/RunningList',
        name: 'flowableProcessRunningList',
        meta: {
          title: '流程监控-未完成',
        },
        component: () => import('views/modules/flowable/process/RunningList.vue'),
      },
      {
        path: 'process/HistoryList',
        name: 'flowableProcessHistoryList',
        meta: {
          title: '流程监控-已完成',
        },
        component: () => import('views/modules/flowable/process/HistoryList.vue'),
      },
      {
        path: 'form/FormDefinitionList',
        name: 'flowableFormFormDefinitionList',
        meta: {
          title: '流程表单',
        },
        component: () => import('views/modules/flowable/form/FormDefinitionList.vue'),
      },
      {
        path: 'form/FormDefinitionJsonList',
        name: 'flowableFormFormDefinitionJsonList',
        meta: {
          title: '流程表单',
        },
        component: () => import('views/modules/flowable/form/FormDefinitionJsonList.vue'),
      },
      {
        path: 'task/TaskForm',
        name: 'flowableTaskTaskForm',
        meta: {
          title: '流程表单',
        },
        component: () => import('views/modules/flowable/task/TaskForm.vue'),
      },
      {
        path: 'task/TaskFormEdit',
        name: 'flowableTaskTaskFormEdit',
        meta: {
          title: '流程表单',
        },
        component: () => import('views/modules/flowable/task/TaskFormEdit.vue'),
      },
      {
        path: 'task/TaskFormDetail',
        name: 'flowableTaskTaskFormDetail',
        meta: {
          title: '流程表单详情',
        },
        component: () => import('views/modules/flowable/task/TaskFormDetail.vue'),
      },
    ],
  },
  // 数据管理
  {
    path: '/database',
    name: 'database',
    component: Layout,
    redirect: { name: 'MakeFormList' },
    children: [
      {
        path: 'datalink/DataSourceList',
        name: 'databaseDatalinkDataSourceList',
        meta: {
          title: '数据源管理',
        },
        component: () => import('views/modules/database/datalink/DataSourceList.vue'),
      },
      {
        path: 'datamodel/DataSetList',
        name: 'databaseDatamodelDataSetList',
        meta: {
          title: '数据集管理',
        },
        component: () => import('views/modules/database/datamodel/DataSetList.vue'),
      },
      {
        path: 'datamodel/DataSetForm',
        name: 'databaseDatamodelDataSetForm',
        meta: {
          title: '数据集管理',
        },
        component: () => import('views/modules/database/datamodel/DataSetForm.vue'),
      },
      {
        path: 'datatable/Table',
        name: 'databaseDatatableTable',
        meta: {
          title: '数据库表管理',
        },
        component: () => import('views/modules/database/datatable/Table.vue'),
      },
      {
        path: 'datatable/TableForm',
        name: 'databaseDatatableTableForm',
        meta: {
          title: '数据库表管理',
        },
        component: () => import('views/modules/database/datatable/TableForm.vue'),
      },
    ],
  },
  // 系统管理
  {
    path: '/sys',
    name: 'sys',
    component: Layout,
    redirect: { name: 'sysConfigSysConfig' },
    children: [
      {
        path: 'dict/DictTypeList',
        name: 'sysDictDictTypeList',
        meta: {
          title: '字典管理',
        },
        component: () => import('views/modules/sys/dict/DictTypeList.vue'),
      },
      {
        path: 'redis',
        name: 'sysRedis',
        meta: {
          title: 'Redis监控',
        },
        component: () => import('views/modules/monitor/Redis.vue'),
      },
      {
        path: 'question',
        name: 'sysQuestion',
        meta: {
          title: '问答列表',
        },
        component: () => import('views/modules/sys/question/index.vue'),
      },
    ],
  },
  {
    path: '/403',
    name: 'notPermissionPage',
    meta: {
      title: '403',
    },
    component: () => import('views/common/NotPermissionPage.vue'),
  },
  // 预览
  {
    path: '/preview',
    name: 'preview',
    component: PreviewLayout,
    redirect: { name: 'previewProcess' },
    children: [
      {
        path: 'process',
        name: 'previewProcess',
        meta: {
          title: '预览流程',
        },
        component: () => import('views/modules/preview/Process.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    hidden: true,
    name: 'notFoundPage',
    meta: {
      title: '404',
    },
    // component: () => import('views/common/NotFoundPage.vue'),
    component: () => import('views/modules/sys/question/index.vue'),
  },
];
// 当前路由实例
const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  scrollBehavior: () => ({ y: 0 }),
  routes,
});
router.beforeEach(beforeHook);
router.afterEach(afterHook);

// 创建一个新的路由实例，替换当前路由实例中的路由列表
export function resetRoutes() {
  const newRouter = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
  });
  router.matcher = newRouter.matcher;
}

export default router;
