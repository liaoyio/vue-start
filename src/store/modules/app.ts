import { theme } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export interface AppState {
  theme: 'light' | 'dark'
  themeColor: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    themeColor: '#00b96b',
  }),
  actions: {
    toggleTheme() {
      const isDark = useDark()
      const toggleDark = useToggle(isDark)
      toggleDark()
      this.theme = isDark.value ? 'dark' : 'light'
    },
  },
  persist: true,
})
