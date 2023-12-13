import auth from './auth'
import user from './user'
import role from './role'
import menu from './menu'
import post from './post'
import cag from './cag'
import operation from './operation'
import setting from './setting'
import files from './files'

export default [
  ...auth,
  ...user,
  ...role,
  ...menu,
  ...post,
  ...cag,
  ...files,
  ...operation,
  ...setting,
]
