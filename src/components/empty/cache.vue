<script setup lang="ts">
defineOptions({ name: 'EmptyCache' })
</script>

<template>
  <div class="mt-header">
    <div class="text-xl font-medium text-gray-i">Montplex Cache</div>
  </div>

  <div class="flex_cc flex-col gap-2 min-h-128">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke-width="1.5" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.5 12h3.382c.685 0 1.312.387 1.618 1 .306.613.933 1 1.618 1h5.764c.685 0 1.312-.387 1.618-1 .306-.613.933-1 1.618-1H21.5M8.967 4h6.066c1.077 0 1.616 0 2.091.164a3 3 0 0 1 1.121.693c.36.352.6.833 1.082 1.796l2.166 4.333c.19.378.284.567.35.765.06.177.102.357.128.541.029.207.029.418.029.841V15.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C19.72 20 18.88 20 17.2 20H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C2 17.72 2 16.88 2 15.2v-2.067c0-.422 0-.634.029-.84.026-.184.068-.365.128-.541.066-.199.16-.388.35-.766l2.166-4.333c.482-.963.723-1.444 1.082-1.796a3 3 0 0 1 1.12-.693C7.352 4 7.89 4 8.968 4Z"
        stroke-width="inherit"
      />
    </svg>
    <div class="text-2xl text-center font-600 text-[#888888] dark:text-[#f4f4f4]">
      Get started by creating your first cluster
    </div>
    <a-button size="large" type="primary" @click="$router.push({ name: 'AddCache' })">Create Cache Service</a-button>
  </div>
</template>
