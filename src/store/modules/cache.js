import * as types from '../types';
import { awaitWrap, getResult } from 'utils';
import { getQuestionTypeList, getApplicationAndMenuList } from 'api/sys/questionService';

export default {
  namespaced: true,
  state: {
    QuestionType: [],
    ApplicationAndMenu: [],
  },
  getters: {
    // 获取问题类型
    getQuestionType: (state) => {
      return state.QuestionType;
    },
    // 获取应用
    getApplicationSelect: (state) => {
      return state.ApplicationAndMenu;
    },
  },
  mutations: {
    // 写入-问题类型
    [types.SELECT_QuestionType](state, payload) {
      state.QuestionType = payload;
    },
    // 写入-应用和菜单
    [types.SELECT_ApplicationAndMenu](state, payload) {
      state.ApplicationAndMenu = payload;
    },
  },
  actions: {
    // 本地存储
    initLocalCache({ dispatch }) {
      dispatch('getQuestionTypeSelect');
      dispatch('getApplicationAndMenuSelect');
    },
    // 获取问题类型列表
    async getQuestionTypeSelect({ commit }) {
      const [error, response] = await awaitWrap(getQuestionTypeList());
      if (error) return Promise.reject(error);

      commit(types.SELECT_QuestionType, response || []);
      return Promise.resolve(getResult(true, '获取问题类型成功！'));
    },
    // 获取应用和菜单列表
    async getApplicationAndMenuSelect({ commit }) {
      const [error, response] = await awaitWrap(getApplicationAndMenuList());
      if (error) return Promise.reject(error);

      commit(types.SELECT_ApplicationAndMenu, response || []);
      return Promise.resolve(getResult(true, '获取应用和菜单成功！'));
    },
  },
};
