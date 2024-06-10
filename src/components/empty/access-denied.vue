<script setup lang="ts">
defineOptions({ name: 'AccessDenied' })
</script>

<template>
  <div class="flex_cc flex-col gap-2 min-h-128">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      class="text-[#888888]"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 8v4m0 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
        stroke-width="inherit"
      />
    </svg>
    <div class="text-xl text-center font-600 text-[#888888] dark:text-[#f4f4f4]">Access Denied</div>
    <div class="text-[#555555] dark:text-[#c6c6c6]">
      You do not belong to any project.<br />Please contact your
      <a class="ac-link" href="/org-settings/users">administrator</a> to give you access.
    </div>
  </div>
</template>
