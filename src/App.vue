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
  token: { colorPrimary: app.themeColor },
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
          borderRadius: 4,
        },
        Segmented: {
          borderRadius: 8,
        },
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<style lang="scss"></style>
