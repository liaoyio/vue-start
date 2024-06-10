<script setup lang="ts">
defineOptions({ name: 'AccordionRoot' })
</script>

<template>
  <a-card :body-style="{ padding: 0 }">
    <div class="divide-y divide-[#f0f0f0] dark:divide-[#303030]">
      <slot />
    </div>
  </a-card>
</template>
