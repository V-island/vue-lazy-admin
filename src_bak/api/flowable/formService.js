import request from 'http-request';
import { FLOW_PATH as prefix } from 'config';

export default {
  submitStartFormData: function (params) {
    return request.post(`${prefix}/flowable/form/submitStartFormData`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    });
  },

  submitTaskFormData: function (params) {
    return request.post(`${prefix}/flowable/form/submitTaskFormData`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    });
  },

  getStartFormData: function (params) {
    return request.get(`${prefix}/flowable/form/getStartFormData`, params);
  },
  getHistoryTaskFormData: function (params) {
    return request.get(`${prefix}/flowable/form/getHistoryTaskFormData`, params);
  },

  getTaskFormData: function (params) {
    return request.get(`${prefix}/flowable/form/getTaskFormData`, params);
  },
};
