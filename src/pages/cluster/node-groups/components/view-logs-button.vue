<script lang="ts" setup>
defineEmits(['ok'])
</script>

<template>
  <a-button type="primary" class="yi-btn-default items-center gap-2 !flex" @click="$emit('ok')">
    View logs <icon-svg-view-log class="h-4 w-4" />
  </a-button>
</template>
