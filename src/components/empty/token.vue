<script setup lang="ts"></script>

<template>
  <a-empty class="rounded-lg !m-0 !py-12" :image-style="{ height: 60 }">
    <template #description>
      <div class="mx-auto my-4 max-w-screen-sm text-gray-800">
        <span>The assess token list is empty !</span>
        <p class="mt-1">Please add manually assess token.</p>
      </div>
    </template>
    <a-button type="primary" @click="$emit('btnClick')"> Create Now </a-button>
  </a-empty>
</template>
