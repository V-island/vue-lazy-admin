import { defineStore } from 'pinia';
import { getDeviceTypeList, getDateTypeList } from 'api/cache';
import { utilFn, getResult, awaitWrap } from 'utils';

// 数据存储
export const cacheStore = defineStore('cache', {
  state: () => {
    return {
      materielList: [],
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
      // 网关类型
      gatewayType: [
        {
          value: '1',
          name: 'modbus-tcp',
        },
        {
          value: '2',
          name: 'http',
        },
        {
          value: '3',
          name: 'websocket',
        },
      ],
      // 网关位置
      gatewaySite: [
        {
          value: '1',
          name: '门口',
        },
        {
          value: '2',
          name: '货架',
        },
      ],
      // 设备类型
      deviceType: [],
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
      // com口
      comPortList: [
        {
          value: '1',
          name: 'com-1',
        },
        {
          value: '2',
          name: 'com-2',
        },
        {
          value: '3',
          name: 'com-3',
        },
        {
          value: '4',
          name: 'com-4',
        },
        {
          value: '5',
          name: 'com-5',
        },
        {
          value: '5',
          name: 'com-5',
        },
        {
          value: '6',
          name: 'com-6',
        },
        {
          value: '7',
          name: 'com-7',
        },
        {
          value: '8',
          name: 'com-8',
        },
        {
          value: '9',
          name: 'com-9',
        },
        {
          value: '10',
          name: 'com-10',
        },
        {
          value: '11',
          name: 'com-11',
        },
        {
          value: '12',
          name: 'com-12',
        },
        {
          value: '13',
          name: 'com-13',
        },
        {
          value: '14',
          name: 'com-14',
        },
        {
          value: '15',
          name: 'com-15',
        },
        {
          value: '16',
          name: 'com-16',
        },
      ],
      // 数据类型
      deviceDataType: [],
      // 绑定状态
      toBindStatus: [
        {
          value: '0',
          name: '未绑定',
        },
        {
          value: '1',
          name: '已绑定',
        },
      ],
      // 登录类型
      loginTypeList: [
        {
          value: '1',
          name: '人脸机',
        },
        {
          value: '2',
          name: '账号密码',
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
      ],
      // 货架层级
      shelvesType: [
        {
          value: 3,
          name: '3层',
        },
        {
          value: 4,
          name: '4层',
        },
      ],
    };
  },
  actions: {
    // 获取设备类型
    async getDeviceTypeList() {
      try {
        const result = await getDeviceTypeList();

        if (result.code !== 200) return Promise.resolve(getResult(false, result.message));

        const list = utilFn._get(result, 'data', []);

        // 写入数据
        this.deviceType = utilFn._map(list, (item) => {
          const keys = utilFn._keys(item);
          const values = utilFn._values(item);
          return {
            value: utilFn._get(keys, '[0]', ''),
            name: utilFn._get(values, '[0]', ''),
          };
        });

        return Promise.resolve(getResult(true, '获取设备类型成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 获取数据类型
    async getDateTypeList() {
      try {
        const result = await getDateTypeList();

        if (result.code !== 200) return Promise.resolve(getResult(false, result.message));

        const list = utilFn._get(result, 'data', []);

        // 写入数据
        this.deviceDataType = utilFn._map(list, (item) => {
          const keys = utilFn._keys(item);
          const values = utilFn._values(item);
          return {
            value: utilFn._get(keys, '[0]', ''),
            name: utilFn._get(values, '[0]', ''),
          };
        });

        return Promise.resolve(getResult(true, '获取数据类型成功！'));
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
});
