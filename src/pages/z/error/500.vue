<script setup lang="ts">
import ErrorPage from './components/ErrorPage.vue'

defineOptions({ name: 'Error500' })
</script>

<template>
  <ErrorPage :code="500" />
</template>

<style lang="scss" scoped></style>
