import { defineStore } from 'pinia'
import { resetRouter } from '@/router'
import { convertImgUrl, removeToken, toLogin} from '@/utils'
import { usePermissionStore, useTagsStore } from '@/store'
import api from '@/api'

// 用户全局变量
export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {},
    }
  },
  getters: {
    userId: (state) => state.userInfo.id,
    nickname: (state) => state.userInfo.nickname,
    avatar: (state) => convertImgUrl(state.userInfo.avatar),
    role: (state) => state.userInfo?.role || [],
    intro: (state) => state.userInfo.intro,
    website: (state) => state.userInfo.website,
  },
  actions: {
    // 获取用户信息
    async getUserInfo() {
      try {
        const res = await api.getUser()
        let data
        if (JSON.parse(import.meta.env.VITE_USE_JSONSERVER)) {
          data = res.data[0]
        } else {
          data = res.data
        }
        const { id, nickname, avatar, role, intro, website } = data
        this.userInfo = { id, nickname, avatar, role, intro, website }
        return Promise.resolve(data)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    setUserInfo(user) {
      Object.keys(user).forEach((key) => {
        this.userInfo[key] = user[key]
      })
    },
    // * 退出登录: 主动行为, 需要调用退出登录接口
    async logout() {
      // * 必须先调用退出登录接口, 再清除本地 Token, 因为退出登录接口需要 Token
      await api.logout()

      removeToken()
      useTagsStore().resetTags()
      usePermissionStore().resetPermission()
      resetRouter()
      this.$reset()

      toLogin()
      window.$message.success('您已经退出登录!')
    },
    // * 被强制退出: 被动行为, 不需要调用退出登录接口
    async forceOffline() {
      removeToken()
      useTagsStore().resetTags()
      usePermissionStore().resetPermission()
      resetRouter()
      this.$reset()

      toLogin()
      window.$message.error('您已经被强制下线!')
    },
  },
})
