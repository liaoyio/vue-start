<script setup lang="ts">
import ErrorPage from './components/ErrorPage.vue'

defineOptions({ name: 'Error404' })
</script>

<template>
  <ErrorPage :code="404" />
</template>

<style lang="scss" scoped></style>
