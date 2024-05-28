<script setup lang="ts">
import ErrorPage from './components/ErrorPage.vue'

defineOptions({ name: 'Error403' })
</script>

<template>
  <ErrorPage :code="403" />
</template>

<style lang="scss" scoped></style>
