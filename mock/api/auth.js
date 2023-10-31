import { resolveToken } from '../utils'

const token = {
  admin: 'admin',
  test: 'test',
  guest: 'guest',
}

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      if (['admin', 'guest'].includes(body?.username)) {
        return {
          code: 200,
          data: {
            token: token[body.username],
          },
        }
      } else {
        return {
          code: 500,
          message: '没有此用户',
        }
      }
    },
  },
  {
    url: '/api/auth/refreshToken',
    method: 'post',
    response: ({ headers }) => {
      return {
        code: 0,
        data: {
          token: resolveToken(headers?.authorization),
        },
      }
    },
  },
]
