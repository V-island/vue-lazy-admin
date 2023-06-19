import request from 'http-request';
import { SYS_PATH as prefix } from 'config';

export default {
  exportData: function (tableName, dataSourceId) {
    return request.get(
      `${prefix}/database/table/executeSql/${tableName}?dataSourceId=${dataSourceId}`,
    );
  },

  save: function (params) {
    return request.post(`${prefix}/gen/genTable/saveTableFromDB`, params);
  },

  queryAlter: function (dataSourceId, name) {
    return request.get(`${prefix}/database/table/alter`, { dataSourceId, name });
  },

  submitAlter: function (params) {
    return request.post(`${prefix}/database/table/alter/do`, params);
  },

  queryCreate: function (dataSourceId) {
    return request.get(`${prefix}/database/table/create`, { dataSourceId });
  },

  export: function (dataSourceId) {
    return request.get(
      `${prefix}/database/table/export`,
      { dataSourceId },
      {
        responseType: 'blob',
      },
    );
  },

  submitCreate: function (params) {
    return request.post(`${prefix}/database/table/create/do`, params);
  },

  list: function (params) {
    return request.get(`${prefix}/database/table/list`, params);
  },

  drop: function (tableName, dataSourceId) {
    return request.delete(`${prefix}/database/table/drop`, { tableName, dataSourceId });
  },
};
