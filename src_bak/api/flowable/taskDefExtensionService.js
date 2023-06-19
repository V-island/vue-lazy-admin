import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/extension/taskDefExtension/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/extension/taskDefExtension/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/extension/taskDefExtension/queryById`, { id });
  },

  queryByDefIdAndTaskId: function (params) {
    return request.get(`${prefix}/extension/taskDefExtension/queryByDefIdAndTaskId`, params);
  },

  list: function (params) {
    return request.get(`${prefix}/extension/taskDefExtension/list`, params);
  },
};
