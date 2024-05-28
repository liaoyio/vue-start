import { useDark, useToggle } from '@vueuse/core'
import { theme } from 'ant-design-vue'
const { defaultSeed } = theme

export const antdUseDark = () => {
  //
  const theme = reactive({
    token: { colorPrimary: defaultSeed.colorPrimary },
  })
  const toggleTheme = () => {
    console.log('toggleTheme')
    useToggle()
    // theme.token.colorPrimary = theme.token.colorPrimary === '#00b96b' ? defaultSeed.colorPrimary : '#00b96b'
  }

  const isDark = useDark()

  return { isDark, toggleTheme, theme }
}
