import { defineStore } from 'pinia'
import { type CacheDetail, cacheOne, getTokenList } from '@/api'
import type { TokenItem } from '@/types/cache'

interface ICache {
  oneCache: CacheDetail | null
  tokenList: TokenItem[] | null
  port: string
}

export const cacheStore = defineStore('cacheStore', {
  state: (): ICache => ({
    oneCache: null,
    tokenList: [],
    port: '8125',
  }),

  actions: {
    async setOneCache(id: number) {
      const res = await cacheOne(id)
      if (res) {
        this.oneCache = res
      }
    },
    updateOneCache(data: any) {
      this.oneCache = data
    },
    async setTokenList(id: number) {
      const res = await getTokenList(id)
      const list: TokenItem[] = res.list.map((v: any) => ({
        ...v,
        show: false,
      }))
      this.tokenList = list
    },
    deleteTokenList(id: number) {
      if (this.tokenList) {
        this.tokenList = this.tokenList.filter((item) => item.id !== id)
      }
    },
  },
})
