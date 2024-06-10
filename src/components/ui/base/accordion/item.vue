<script setup lang="ts">
defineOptions({ name: 'AccordionItem' })

defineProps({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  open: { type: Boolean, default: false },
})
</script>

<template>
  <details class="group" :open="open">
    <summary class="flex_lr cursor-pointer list-none select-none p-6 text-lg font-medium">
      <div class="flex-1">
        <h3>
          {{ title }}
        </h3>
        <p class="pt-2">
          {{ subTitle }}
        </p>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="block size-4 transition-all duration-300 group-open:rotate-180"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </summary>
    <div class="px-6 pb-6">
      <slot />
    </div>
  </details>
</template>
