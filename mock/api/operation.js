const posts = [
  {
    "id": 271,
    "created_at": "2023-06-28T06:47:41.564Z",
    "updated_at": "2023-06-28T06:47:41.564Z",
    "opt_module": "用户",
    "opt_type": "修改",
    "opt_method": "blog/api/v1.(*User).Update-fm",
    "opt_url": "/api/user",
    "opt_desc": "修改用户",
    "request_param": "{\"id\":3,\"user_info_id\":3,\"avatar\":\"https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png\",\"nickname\":\"测试用户\",\"roles\":[],\"login_type\":1,\"ip_address\":\"182.108.82.76\",\"ip_source\":\"江西省九江市 电信\",\"created_at\":\"2022-11-01T10:41:13.3Z\",\"last_login_time\":\"2023-06-28T06:47:12.248Z\",\"is_disable\":0,\"role_ids\":[2]}",
    "request_method": "PUT",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "49.75.55.171",
    "ip_source": "江苏省苏州市 电信"
  },
  {
    "id": 270,
    "created_at": "2023-06-21T14:07:29.77Z",
    "updated_at": "2023-06-21T14:07:29.77Z",
    "opt_module": "角色",
    "opt_type": "删除",
    "opt_method": "blog/api/v1.(*Role).Delete-fm",
    "opt_url": "/api/role",
    "opt_desc": "删除角色",
    "request_param": "[3]",
    "request_method": "DELETE",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "112.24.20.113",
    "ip_source": "江苏省镇江市 移动"
  },
  {
    "id": 269,
    "created_at": "2023-05-14T15:28:29.294Z",
    "updated_at": "2023-05-14T15:28:29.294Z",
    "opt_module": "文章",
    "opt_type": "修改",
    "opt_method": "blog/api/v1.(*Article).SoftDelete-fm",
    "opt_url": "/api/article/soft-delete",
    "opt_desc": "修改文章",
    "request_param": "{\"ids\":[6],\"is_delete\":1}",
    "request_method": "PUT",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "49.94.28.160",
    "ip_source": "江苏省南京市 电信"
  },
  {
    "id": 259,
    "created_at": "2023-05-09T02:17:57.159Z",
    "updated_at": "2023-05-09T02:17:57.159Z",
    "opt_module": "标签",
    "opt_type": "新增或修改",
    "opt_method": "blog/api/v1.(*Tag).SaveOrUpdate-fm",
    "opt_url": "/api/tag",
    "opt_desc": "新增或修改标签",
    "request_param": "{\"id\":9,\"created_at\":\"2023-04-22T13:22:48.641Z\",\"updated_at\":\"2023-04-22T13:22:48.641Z\",\"name\":\"吃6666666666\",\"article_count\":0}",
    "request_method": "POST",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "49.70.206.125",
    "ip_source": "江苏省镇江市 电信"
  },
  {
    "id": 258,
    "created_at": "2023-04-22T13:29:00.717Z",
    "updated_at": "2023-04-22T13:29:00.717Z",
    "opt_module": "用户",
    "opt_type": "修改",
    "opt_method": "blog/api/v1.(*User).UpdateCurrent-fm",
    "opt_url": "/api/user/current",
    "opt_desc": "修改用户",
    "request_param": "{\"avatar\":\"https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png\",\"nickname\":\"管理员\",\"intro\":\"我是管理员用户！\",\"website\":\"\"}",
    "request_method": "PUT",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "124.240.37.254",
    "ip_source": "广东省广州市 广东广电"
  },
  {
    "id": 257,
    "created_at": "2023-04-22T13:28:53.259Z",
    "updated_at": "2023-04-22T13:28:53.259Z",
    "opt_module": "操作日志",
    "opt_type": "删除",
    "opt_method": "blog/api/v1.(*OperationLog).Delete-fm",
    "opt_url": "/api/operation/log",
    "opt_desc": "删除操作日志",
    "request_param": "[229]",
    "request_method": "DELETE",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "124.240.37.254",
    "ip_source": "广东省广州市 广东广电"
  },
  {
    "id": 256,
    "created_at": "2023-04-22T13:23:30.083Z",
    "updated_at": "2023-04-22T13:23:30.083Z",
    "opt_module": "菜单",
    "opt_type": "新增或修改",
    "opt_method": "blog/api/v1.(*Menu).SaveOrUpdate-fm",
    "opt_url": "/api/menu",
    "opt_desc": "新增或修改菜单",
    "request_param": "{\"order_num\":0,\"is_hidden\":0,\"is_catelogue\":true,\"component\":\"Layout\",\"parent_id\":0,\"name\":\"123\"}",
    "request_method": "POST",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "124.240.37.254",
    "ip_source": "广东省广州市 广东广电"
  },
  {
    "id": 255,
    "created_at": "2023-04-22T13:23:18.451Z",
    "updated_at": "2023-04-22T13:23:18.451Z",
    "opt_module": "菜单",
    "opt_type": "新增或修改",
    "opt_method": "blog/api/v1.(*Menu).SaveOrUpdate-fm",
    "opt_url": "/api/menu",
    "opt_desc": "新增或修改菜单",
    "request_param": "{\"id\":33,\"name\":\"首页\",\"path\":\"/home\",\"component\":\"/home\",\"icon\":\"ic:sharp-home\",\"created_at\":\"2022-11-01T01:43:10.142Z\",\"order_num\":0,\"children\":[],\"parent_id\":0,\"is_hidden\":0,\"keep_alive\":1,\"redirect\":\"\",\"publishing\":true}",
    "request_method": "POST",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "124.240.37.254",
    "ip_source": "广东省广州市 广东广电"
  },
  {
    "id": 254,
    "created_at": "2023-04-22T13:23:18.067Z",
    "updated_at": "2023-04-22T13:23:18.067Z",
    "opt_module": "菜单",
    "opt_type": "新增或修改",
    "opt_method": "blog/api/v1.(*Menu).SaveOrUpdate-fm",
    "opt_url": "/api/menu",
    "opt_desc": "新增或修改菜单",
    "request_param": "{\"id\":33,\"name\":\"首页\",\"path\":\"/home\",\"component\":\"/home\",\"icon\":\"ic:sharp-home\",\"created_at\":\"2022-11-01T01:43:10.142Z\",\"order_num\":0,\"children\":[],\"parent_id\":0,\"is_hidden\":1,\"keep_alive\":1,\"redirect\":\"\",\"publishing\":true}",
    "request_method": "POST",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "124.240.37.254",
    "ip_source": "广东省广州市 广东广电"
  },
  {
    "id": 253,
    "created_at": "2023-04-22T13:23:07.653Z",
    "updated_at": "2023-04-22T13:23:07.653Z",
    "opt_module": "留言",
    "opt_type": "修改",
    "opt_method": "blog/api/v1.(*Message).UpdateReview-fm",
    "opt_url": "/api/message/review",
    "opt_desc": "修改留言",
    "request_param": "{\"ids\":[34],\"is_review\":1}",
    "request_method": "PUT",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "124.240.37.254",
    "ip_source": "广东省广州市 广东广电"
  },
  {
    "id": 252,
    "created_at": "2023-04-22T13:23:06.797Z",
    "updated_at": "2023-04-22T13:23:06.797Z",
    "opt_module": "留言",
    "opt_type": "修改",
    "opt_method": "blog/api/v1.(*Message).UpdateReview-fm",
    "opt_url": "/api/message/review",
    "opt_desc": "修改留言",
    "request_param": "{\"ids\":[34],\"is_review\":0}",
    "request_method": "PUT",
    "response_data": "{\"code\":200,\"message\":\"OK\",\"data\":null}",
    "user_id": 1,
    "nickname": "管理员",
    "ip_address": "124.240.37.254",
    "ip_source": "广东省广州市 广东广电"
  }
]

export default [
  {
    url: '/api/operation/log/list',
    method: 'get',
    response: (data = {}) => {
      const { title, pageNo, pageSize } = data.query
      let pageData = []
      let total = 20
      const filterData = posts.filter(
        (item) => item.title.includes(title) || (!title && title !== 0)
      )
      if (filterData.length) {
        if (pageSize) {
          while (pageData.length < pageSize) {
            pageData.push(filterData[Math.round(Math.random() * (filterData.length - 1))])
          }
        } else {
          pageData = filterData
        }
        pageData = pageData.map((item, index) => ({
          id: pageSize * (pageNo - 1) + index + 1,
          ...item,
        }))
      } else {
        total = 0
      }
      return {
        code: 200,
        message: 'ok',
        data: {
          pageData,
          total,
          pageNo,
          pageSize,
        },
      }
    },
  },
  {
    url: '/api/operation/log',
    method: 'delete',
    response: ({ query }) => {
      return {
        code: 200,
        message: 'ok',
        data: {
          id: query.id,
        },
      }
    },
  }
]
