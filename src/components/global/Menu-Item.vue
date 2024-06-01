<script setup lang="ts">
import { defineProps, ref } from 'vue'
defineProps({
  selected: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="menu-item" :class="selected ? 'menu-item-selected' : ''">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.menu-item {
  inset-inline-start: 0;
  position: relative;
  text-overflow: clip;
  display: flex;
  min-height: 36px;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 8px;
  transition:
    border-color 0.3s,
    background 0.3s,
    padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &.menu-item-selected {
    background-color: #e6fbff;
    color: #0ca6f2;
  }
}

.dark {
  .menu-item {
    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }

    &.menu-item-selected {
      color: rgb(12, 166, 242);
      background-color: rgb(4, 54, 90);
    }
  }
}
</style>
