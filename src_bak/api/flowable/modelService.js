import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  deploy: function (params) {
    return request.put(`${prefix}/flowable/model/deploy`, params);
  },
  updateCategory: function (params) {
    return request.put(`${prefix}/flowable/model/updateCategory`, params);
  },
  copy: function (id) {
    return request.get(`${prefix}/flowable/model/copy`, { id });
  },

  getBpmnXml: function (id) {
    return request.get(`${prefix}/flowable/model/getBpmnXml`, { id });
  },
  delete: function (ids) {
    return request.delete(`${prefix}/flowable/model/delete`, { ids });
  },

  saveModel: function (modelId, params) {
    return request.post(`${prefix}/flowable/model/saveModel/${modelId}`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    });
  },

  list: function (params) {
    return request.get(`${prefix}/flowable/model/list`, params);
  },

  // 根据流程定义id查询工作流节点
  processesId: function (params) {
    return request.post(
      `${prefix}/processesNodeData/qureyAllProcessesNodeByProcessesDefId`,
      params,
    );
  },

  // 根据工作流节点id查询关联应用
  getAppIdByTaskDefId: function (params) {
    return request.post(`${prefix}/zhgylApp/selectByTaskDefId`, params);
  },

  // 新增或更新关联应用
  saveAppIdByTaskDefId: function (params) {
    return request.post(`${prefix}/zhgylApp/updateOrSave`, params);
  },

  // 分配人员--应用
  queryDictType: function (params) {
    return request.get(`${prefix}/dict/queryDictType`, params);
  },

  // 分配人员--组织机构
  organList: function (params) {
    return request.get(`${prefix}/auth/info/organList`, params);
  },

  // 分配人员--角色
  roleList: function (params) {
    return request.get(`${prefix}/auth/info/roleList`, params);
  },

  // 分配人员--账号
  userList: function (params) {
    return request.get(`${prefix}/auth/info/userList`, params);
  },

  // 审核者查询
  taskList: function (params) {
    return request.get(`${prefix}/zhgyl/process/assingee/task/list`, params);
  },

  // 审核者保存
  assingeeSave: function (params) {
    return request.post(`${prefix}/zhgyl/process/assingee/save`, params);
  },

  // 待办地址查询
  selectByTaskDefId: function (params) {
    return request.post(`${prefix}/zhgylTask/selectByTaskDefId`, params);
  },

  // 待办地址保存
  taskSave: function (params) {
    return request.post(`${prefix}/zhgylTask/updateOrSave`, params);
  },

  // 告警预警查询
  findWarningData: function (params) {
    return request.get(`${prefix}/warn/findWarningData`, params);
  },

  // 告警预警保存
  warnSave: function (params) {
    return request.post(`${prefix}/warn/saveOrUpdate`, params);
  },

  // 自动审批查询
  auditList: function (params) {
    return request.post(`${prefix}/zhgyl/process/auto/audit/list`, params);
  },

  // 自动审批保存
  auditSave: function (params) {
    return request.post(`${prefix}/zhgyl/process/auto/audit/save`, params);
  },
};
