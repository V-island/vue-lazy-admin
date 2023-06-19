import request from 'http-request';
import { AUTH_PATH as prefix } from 'config';

export default {
  getCode: function () {
    return request.get(`${prefix}/user/getCode`);
  },
  login: function (params) {
    return request.post(`${prefix}/user/login`, params);
  },
  logout: function () {
    return request.get(`${prefix}/user/logout`);
  },
};
