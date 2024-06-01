<script setup lang="ts"></script>

<template>
  <div class="mt-card">
    <slot />
  </div>
</template>

<style lang="scss">
.mt-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid rgb(55, 58, 64);
  color: rgb(193, 194, 197);
  background-color: rgb(23, 23, 23);
  box-shadow: rgba(0, 0, 0, 0.04) 0px 2px 4px;
}

.dark .mt-card {
  color: rgb(0, 0, 0);
  border: 1px solid rgb(237, 237, 237);
  background-color: #fff;
}
</style>
