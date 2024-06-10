<script lang="ts" setup>
import BackButton from './back-button.vue'
defineProps<{ title?: string }>()
</script>

<template>
  <header
    class="mt-header bg-white dark:bg-[#111] flex_c"
    style="border-bottom: 1px solid var(--sider-nav-border); height: 64px"
  >
    <div class="flex_lr">
      <div class="flex_c gap-1">
        <BackButton />
        <h3 class="block">{{ title }}</h3>
      </div>
      <slot />
    </div>
  </header>
</template>
