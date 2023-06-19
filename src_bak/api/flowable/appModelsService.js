import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  models: function (params) {
    return request.post(`${prefix}/rest/models`, params);
  },

  editorJson: function (modelId) {
    return request.get(
      `${prefix}/rest/models/${modelId}/editor/json?version=${new Date().getTime()}`,
    );
  },
};
