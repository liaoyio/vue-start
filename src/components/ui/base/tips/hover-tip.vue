<script setup lang="ts">
defineOptions({ name: 'HoverTip' })
defineProps<{ title?: string }>()
</script>

<template>
  <a-tooltip>
    <template #title>
      <slot>
        <span v-if="title">{{ title }}</span>
      </slot>
    </template>
    <div class="group cursor-pointer text-info-4">
      <SvgIcon name="help" class="group-hover:opacity-75" size="16" />
    </div>
  </a-tooltip>
</template>
