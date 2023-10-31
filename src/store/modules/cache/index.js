import { defineStore } from 'pinia';

// 数据存储
export const cacheStore = defineStore('cache', {
  state: () => {
    return {
      // 启用状态
      enabledStatus: [
        {
          value: 0,
          name: '停用',
        },
        {
          value: 1,
          name: '启用',
        },
      ],
      // 用户类型
      userTypeList: [
        {
          value: '1',
          name: '需求方',
        },
        {
          value: '2',
          name: '仓管员',
        },
      ]
    };
  }
});

