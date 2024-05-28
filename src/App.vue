<script lang="ts" setup>
import { theme } from 'ant-design-vue'
import { useAppStore } from '@/store'
const app = useAppStore()

const $theme = computed(() => ({
  token: { colorPrimary: app.themeColor },
  algorithm: app.theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
}))

watchEffect(() => {
  const isDark = useDark()
  useToggle(isDark)
})
</script>

<template>
  <a-config-provider :theme="$theme">
    <router-view />
  </a-config-provider>
</template>
