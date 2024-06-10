import { defineStore } from 'pinia'
import { type IUserInfo, userInfo } from '@/api'

type User = {
  user: null | IUserInfo
  /** org id */
  teamId?: number
  /** project id */
  busiGroupId?: number
}
export const userStore = defineStore('userStore', {
  state: (): User => ({
    user: {} as null | IUserInfo,
  }),
  getters: {
    getInfo: (state) => state.user,
  },
  actions: {
    async setUserInfo() {
      const res = await userInfo()
      this.user = res
      return res
    },
  },
  persist: true,
})
