<script setup lang="ts">
defineOptions({ name: 'BackButton' })
</script>

<template>
  <div class="group cursor-pointer" @click="$router.back">
    <SvgIcon name="arrow-back-line" class="group-hover:opacity-75" />
  </div>
</template>
