import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/extension/formDefinitionJson/save`, params);
  },

  updatePrimary: function (id) {
    return request.put(`${prefix}/extension/formDefinitionJson/updatePrimary`, { id });
  },

  delete: function (ids) {
    return request.delete(`${prefix}/extension/formDefinitionJson/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/extension/formDefinitionJson/queryById`, { id });
  },

  list: function (params) {
    return request.get(`${prefix}/extension/formDefinitionJson/list`, params);
  },
};
