export const MenuList = [
  {
    title: '设备拓扑图',
    url: 'topology/index',
    customIcon: 'g-topology',
  },
  {
    title: '环控大屏',
    url: 'iframe:http://172.16.40.22:17000',
    customIcon: 'g-early-warning',
  },
  {
    title: '设备管理',
    customIcon: 'g-device-management',
    children: [
      {
        title: '设备列表',
        url: 'device/index',
        customIcon: '',
      },
      {
        title: '设备配置',
        url: 'configuration/index',
        customIcon: '',
      },
      {
        title: '称重货架管理',
        url: 'shelves/index',
        customIcon: '',
      },
      {
        title: '托盘管理',
        url: 'tray/index',
        customIcon: '',
      },
      {
        title: '下发管理',
        url: 'log/index',
        customIcon: '',
      },
      {
        title: '视频中心',
        url: 'video/index',
        customIcon: '',
      },
      {
        title: '视频中心详情',
        tooltip: '视频中心详情',
        url: 'video/details',
        isHidden: true,
        customIcon: '',
      },
    ],
  },
  {
    title: '基础管理',
    customIcon: 'g-basic-config',
    children: [
      {
        title: '用户管理',
        url: 'user/index',
        customIcon: '',
      },
      {
        title: '物料管理',
        url: 'materiel/index',
        customIcon: '',
      },
      {
        title: 'RFID绑定',
        url: 'rfid/index',
        customIcon: '',
      },
      {
        title: '称重绑定',
        url: 'weight/index',
        customIcon: '',
      },
    ],
  },
  {
    title: '系统监控',
    customIcon: 'g-system-monitor',
    children: [
      {
        title: '登录日志',
        url: 'loginLog/index',
        customIcon: '',
      },
      {
        title: '操作日志',
        url: 'operationLog/index',
        customIcon: '',
      },
      {
        title: '运行日志',
        url: 'runLog/index',
        customIcon: '',
      },
      {
        title: '服务监控',
        url: 'serviceMonitor/index',
        customIcon: '',
      },
    ],
  },
];
