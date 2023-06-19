import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/extension/formDefinition/save`, params);
  },

  delete: function (ids) {
    return request.delete(`${prefix}/extension/formDefinition/delete`, { ids });
  },

  queryById: function (id) {
    return request.get(`${prefix}/extension/formDefinition/queryById`, { id });
  },
  queryByJsonId: function (jsonId) {
    return request.get(`${prefix}/extension/formDefinition/queryByJsonId`, { jsonId });
  },

  list: function (params) {
    return request.get(`${prefix}/extension/formDefinition/list`, params);
  },
};
