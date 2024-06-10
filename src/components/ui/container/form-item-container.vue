<script setup lang="ts">
defineProps({ title: String, subTitle: String })

defineOptions({ name: 'FormItemContainer' })
</script>

<template>
  <div class="p-6">
    <div v-if="title || subTitle" class="flex gap-2 flex-col pb-6">
      <span class="text-base font-600">{{ title }}</span>
      <span class="text-sm font-400 text-info-4">{{ subTitle }}</span>
    </div>

    <slot />
  </div>
</template>

<style lang="scss"></style>
