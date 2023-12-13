import { resolveToken } from '../utils'

const users = {
  admin: {
    id: 1,
    nickname: '管理员(admin)',
    avatar: 'https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png',
    email: 'Ronnie@123.com',
    role: ['admin'],
  },
  test: {
    id: 2,
    nickname: '测试(test)',
    avatar: 'https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png',
    role: ['test'],
  },
  guest: {
    id: 3,
    nickname: '访客(guest)',
    avatar: 'https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png',
    role: ['guest'],
  },
}
const userlist = [
  {
    id: 1,
    name: 'admin',
    nickname: '管理员(admin)',
    avatar: 'https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png',
    email: 'Ronnie@123.com',
    role: ['Administrator'],
    isDisabled: false,
  },
  {
    id: 2,
    name: 'test',
    nickname: '测试(test)',
    avatar: 'https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png',
    role: ['Test'],
    isDisabled: false,
  },
  {
    id: 3,
    name: 'guest',
    nickname: '访客(guest)',
    avatar: 'https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png',
    role: ['Visitor'],
    isDisabled: false,
  },
]

export default [
  {
    url: '/api/users',
    method: 'get',
    response: (data = {}) => {
      const { name, pageNo, pageSize } = data.query
      let pageData = []
      let total = 60
      const filterData = userlist.filter(
        (item) => item.name.includes(name) || (!name && name !== 0)
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
    url: '/api/user',
    method: 'post',
    response: ({ body }) => {
      return {
        code: 200,
        message: 'ok',
        data: body,
      }
    },
  },
  {
    url: '/api/user/:id',
    method: 'put',
    response: ({ query, body }) => {
      return {
        code: 200,
        message: 'ok',
        data: {
          id: query.id,
          body,
        },
      }
    },
  },
  {
    url: '/api/user/:id',
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
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: ({ headers }) => {
      const token = resolveToken(headers?.authorization)
      return {
        code: 200,
        data: {
          ...(users[token] || users.guest),
        },
      }
    },
  },
  {
    url: '/api/user/current',
    method: 'put',
    response: ({ headers }) => {
      const token = resolveToken(headers?.authorization)
      return {
        code: 200,
        data: {
          ...(users[token] || users.guest),
        },
      }
    },
  },
  {
    url: '/api/user/current/password',
    method: 'put',
    response: ({ headers }) => {
      const token = resolveToken(headers?.authorization)
      return {
        code: 200,
        data: {
          ...(users[token] || users.guest),
        },
      }
    },
  },
]
