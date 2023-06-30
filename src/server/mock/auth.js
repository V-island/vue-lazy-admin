export default [
  {
    name: '登录获取TOKEN',
    url: "/auth/login",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "ok",
        data: {
          token: 'qaz123wsx456edc789'
        }
      };
    }
  }, {
    name: '获取角色列表',
    url: "/auth/getRoleList",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "ok",
        data: {
          userId: 'zhul70',
          id: '8a65eac66d632e14016d6707c9de02d1',
          code: 'IN_SYS_ADMIN',
          name: '系统管理员',
        },
      };
    }
  }, {
    name: '获取用户信息',
    url: "/auth/getUserInfo",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "ok",
        data: {
          userId: 'zhul70',
          userName: 'zhul70',
          orgName: '测试组',
          realName: '朱亮',
        }
      };
    }
  }, {
    name: '获取当前角色菜单列表',
    url: "/auth/getMenuList",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "ok",
        data: [
          {
            url: '/home',
            name: '首页',
            customIcon: '/home.png',
          },
        ],
      };
    }
  }, {
    name: '获取当前角色权限代码列表',
    url: "/auth/getPermissionList",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "ok",
        data: [
          'ny:nyRuleHistory:list',
          'test:onetomany:testDataMain:export',
          'gencode:validateType:view',
          'ureport:add',
          'extension:actCategory:del',
          'test:manytomany:testCourse:list',
          'test:grid:testCountry:del',
        ]
      };
    }
  }
];