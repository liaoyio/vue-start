import { defineStore } from 'pinia'


export const useAppStore = defineStore('app', {
  //@ts-ignore
  state: (): AppState => ({
    hello: 'world',
   })
})
