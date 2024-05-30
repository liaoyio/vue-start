import { defineStore } from 'pinia'
import { useColorMode, useDark, useToggle } from '@vueuse/core'
const { system, store } = useColorMode()

export interface AppState {
  theme: 'light' | 'dark'
  mode: 'dark' | 'light' | 'auto'
  themeColor: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    themeColor: 'rgb(12, 166, 242)',
    mode: store.value === 'auto' ? system.value : store.value,
  }),
  actions: {
    toggleTheme() {
      const isDark = useDark()
      const toggleDark = useToggle(isDark)
      toggleDark()
      this.theme = isDark.value ? 'dark' : 'light'
    },
    themeswitcher(mode: 'dark' | 'light' | 'auto') {
      this.mode = mode
    },
  },
  persist: true,
})
