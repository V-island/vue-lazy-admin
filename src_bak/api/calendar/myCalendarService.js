import request from 'http-request';
import { SYS_PATH as prefix } from 'config';

export default {
  save: function (params) {
    return request.post(`${prefix}/myCalendar/save`, params);
  },

  delete: function (id) {
    return request.delete(`${prefix}/myCalendar/del1`, { id });
  },

  queryById: function (id) {
    return request.get(`${prefix}/myCalendar/queryById`, { id });
  },

  drag: function (params) {
    return request.put(`${prefix}/myCalendar/drag`, params);
  },

  resize: function (params) {
    return request.put(`${prefix}/myCalendar/resize1`, params);
  },

  list: function () {
    return request.get(`${prefix}/myCalendar/findList1`);
  },
};
