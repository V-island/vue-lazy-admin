import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  list: function (params) {
    return request.get(`${prefix}/flowable/process/list`, params);
  },

  runningDataList: function (params) {
    return request.get(`${prefix}/flowable/process/runningData`, params);
  },

  historyListData: function (params) {
    return request.get(`${prefix}/flowable/process/historyListData`, params);
  },

  revokeProcIns: function (id) {
    return request.put(`${prefix}/flowable/process/revokeProcIns`, { id });
  },

  deleteProcIns: function (ids, reason) {
    return request.delete(`${prefix}/flowable/process/deleteProcIns`, { ids, reason });
  },

  deleteAllProcIns: function (procInsIds) {
    return request.delete(`${prefix}/flowable/process/deleteAllProcIns`, { procInsIds });
  },

  suspend: function (procDefId) {
    return request.put(`${prefix}/flowable/process/update/suspend`, { procDefId });
  },

  active: function (procDefId) {
    return request.put(`${prefix}/flowable/process/update/active`, { procDefId });
  },

  stop: function (id, message) {
    return request.put(`${prefix}/flowable/process/stop`, { id, message });
  },

  getFlowChart: function (processDefId) {
    return request.get(`${prefix}/flowable/process/getFlowChart`, { processDefId });
  },

  queryProcessStatus: function (procDefId, procInsId) {
    return request.get(`${prefix}/flowable/process/queryProcessStatus`, { procDefId, procInsId });
  },

  exist: function (key) {
    return request.get(`${prefix}/flowable/process/exist`, { key });
  },
};
