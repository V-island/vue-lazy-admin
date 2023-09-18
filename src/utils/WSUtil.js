import { WebSocketBean } from 'tools-vue3';
import { message } from 'ant-design-vue';
import { utilFn, getBuildUUID, clearAppState, toLoginPage } from 'utils';
import { useAuthStore } from 'store/auth';
import { WS_SERVICE_SITE } from 'config';

export default class WSUtil {
  // constructor() {}

  errorHandlers = {
    403: () => {
      message.error(`未授权，拒绝访问`);
      CEvent.emit(`onNotPermission`);
    },
    404: () => {
      message.error(`请求地址出错`);
    },
    408: () => {
      message.error(`请求超时`);
    },
    5000: () => {
      message.error(`服务器内部错误`);
    },
  };

  // 声明socket
  static ws = null;
  static watchDog = null;

  /**
   * 初始化WebSocket
   * 注：主要用于用户登录后与服务器数据传输及消息推送
   */
  static async init() {
    const sendSuffix = '';

    //初始化websokcet对象
    this.ws = new WebSocketBean({
      url: `${WS_SERVICE_SITE}/api/env/free`,
      needReconnect: true,
      reconnectGapTime: 5000,
      heartSend: { cmd: 'ping' },
      heartGet: '~',
      heartGapTime: 5000,
      onerror: () => {
        utilFn._hidePageLoading();
      },
      onmessage: (data) => {
        //在这里写消息处理逻辑
        const sp = data.data.split(sendSuffix).filter((el) => el.length > 0);
        //这里sp的数据为['{\"code\":\"getData\",\"data\":\"test\"}']
        sp.forEach((item) => {
          const jsonData = JSON.parse(item);
          // 获取http请求码
          const { code } = jsonData;
          if (code != 200) utilFn._hidePageLoading();

          switch (code) {
            case 200:
              //事件触发
              CEvent.emit(`DeviceRealTimeStatus`, jsonData.data);
              break;
            case 403:
              message.error(`未授权，拒绝访问`);
              CEvent.emit(`onNotPermission`);
              break;
            case 5000:
              message.error(jsonData.msg);
              break;
          }
        });
      },
    });
    //建立连接
    this.ws.start();
  }

  // 发送数据
  static async send(params) {
    const auth = useAuthStore();
    const UUID = getBuildUUID();
    const msg = {
      userId: auth.userId,
      msgId: UUID,
      cmd: '',
      ...params,
    };
    if (this.ws == null) this.init();

    this.ws.send(JSON.stringify(msg));
  }

  static async dispose() {
    if (this.ws) this.ws.dispose();
  }
}

// // 主动断开
// WSUtil.ws.dispose()

// //在任意文件或者页面中
// CEvent.on("getData",(data)=>{
//   //在onmessage触发后，这里应该打印test字符串
//   console.log(data)
// })
