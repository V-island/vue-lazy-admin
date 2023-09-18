import { defineStore } from 'pinia';
import { getProjectEnum } from 'api/cache';
import { utilFn, getResult, awaitWrap } from 'utils';

// 数据存储
export const cacheStore = defineStore('cache', {
  state: () => {
    return {
      projectEnum: [],
      // 在库状态
      inventoryStatus: [
        {
          value: '0',
          name: '已出库',
        },
        {
          value: '1',
          name: '在库内',
        },
      ],
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
      // 单据类型
      orderTypeList: [
        {
          value: '1',
          name: 'ERP领料入仓',
        },
        {
          value: '2',
          name: '退料入仓',
        },
        {
          value: '3',
          name: '工作票领料',
        },
        {
          value: '4',
          name: '领料单领料',
        },
      ],
      // 单据状态
      orderState: [
        {
          value: '0',
          name: '未开始',
        },
        {
          value: '1',
          name: '正在出库',
        },
        {
          value: '2',
          name: '正在入库',
        },
        {
          value: '3',
          name: '已完成',
        },
      ],
      // 操作类型
      operateTypeList: [
        {
          value: '1',
          name: 'ERP领料入仓单',
        },
        {
          value: '2',
          name: '退料入仓单',
        },
        {
          value: '3',
          name: '领料单',
        },
        {
          value: '4',
          name: '工作票领料',
        },
        {
          value: '5',
          name: '一般入仓',
        },
        {
          value: '6',
          name: '其他领料',
        },
      ],
      // 盘点状态
      pdStatusList: [
        {
          value: '1',
          name: '盘平',
        },
        {
          value: '2',
          name: '盘盈',
        },
        {
          value: '3',
          name: '盘亏',
        },
      ],
      // 盘点类型
      pdTypeList: [
        {
          value: '0',
          name: '手动',
        },
        {
          value: '1',
          name: '自动',
        },
      ],
    };
  },
  actions: {
    async getProjectEnum(params) {
      try {
        const result = await getProjectEnum(params);

        if (result.code !== 200) return Promise.resolve(getResult(false, result.message));

        const projectEnum = utilFn._get(result, 'data', []);

        // 写入数据
        this.projectEnum = projectEnum;

        return Promise.resolve(getResult(true, '获取工程项目枚举成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
