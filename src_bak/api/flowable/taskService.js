import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  start: function (params) {
    return request.post(`${prefix}/flowable/task/start`, params);
  },

  todoList: function (params) {
    return request.get(`${prefix}/flowable/task/todo`, params);
  },

  historicList: function (params) {
    return request.get(`${prefix}/flowable/task/historic`, params);
  },

  historicTaskList: function (procInsId) {
    return request.get(`${prefix}/flowable/task/historicTaskList`, { procInsId });
  },

  myApplyedList: function (params) {
    return request.get(`${prefix}/flowable/task/myApplyed`, params);
  },

  getTaskDef: function (params) {
    return request.get(`${prefix}/flowable/task/getTaskDef`, params);
  },

  delegate: function (taskId, userId) {
    return request.put(`${prefix}/flowable/task/delegate`, { taskId, userId });
  },

  callback: function (params) {
    return request.put(`${prefix}/flowable/task/callback`, params);
  },

  audit: function (params) {
    return request.post(`${prefix}/flowable/task/audit`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    });
  },

  backNodes: function (taskId) {
    return request.put(`${prefix}/flowable/task/backNodes`, { taskId });
  },

  back: function (params) {
    return request.put(`${prefix}/flowable/task/back`, params);
  },

  transfer: function (taskId, userId) {
    return request.put(`${prefix}/flowable/task/transfer`, { taskId, userId });
  },

  addSignTask: function (params) {
    return request.post(`${prefix}/flowable/task/addSignTask`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    });
  },
  getFlowChart: function (processInstanceId) {
    return request.get(`${prefix}/flowable/task/getFlowChart`, { processInstanceId });
  },

  urge: function (params) {
    return request.post(`${prefix}/flowable/task/urge`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    });
  },
};
