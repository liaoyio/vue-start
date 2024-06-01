<script lang="ts" setup>
import { theme } from 'ant-design-vue'
import { useAppStore } from '@/store'

const app = useAppStore()
const { system, store } = useColorMode()

const themeAlgorithm = computed(() => {
  if (store.value === 'auto') {
    return system.value === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
  } else {
    return store.value === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
  }
})

const $theme = computed(() => ({
  token: {
    colorPrimary: app.themeColor,
    fontFamily: 'Inter',
  },
  algorithm: themeAlgorithm.value,
}))

watchEffect(() => {
  // if use auto mode, watch system color mode
  // store.value = app.mode
  const isDark = useDark()
  useToggle(isDark)
})
</script>

<template>
  <a-config-provider
    :theme="{
      ...$theme,
      components: {
        Button: {
          borderRadius: 8,
        },
        Segmented: {
          borderRadius: 8,
          fontSizeLG: 14,
        },
        Select: {
          fontSizeLG: 14,
        },
        Input: {
          fontSizeLG: 14,
        },
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<style lang="scss"></style>
