import { resolveToken } from '../utils'

const users = {
  admin: {
    id: 1,
    name: '管理员(admin)',
    avatar: 'https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png',
    email: 'Ronnie@123.com',
    role: ['admin'],
  },
  test: {
    id: 2,
    name: '测试(test)',
    avatar: 'https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png',
    role: ['test'],
  },
  guest: {
    id: 3,
    name: '访客(guest)',
    avatar: 'https://www.bing.com/rp/ar_9isCNU2Q-VG1yEDDHnx8HAFQ.png',
    role: ['guest'],
  },
}
export default [
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
]
