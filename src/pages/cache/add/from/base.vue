<script setup lang="ts">
import { useVModels } from '@vueuse/core'
const props = defineProps<{ name?: string; des?: string }>()
const emit = defineEmits(['update:name', 'update:des'])
const { name, des } = useVModels(props, emit)
</script>

<template>
  <a-form-item label="Name" name="name" :rules="[{ required: true, message: 'Please input cache name!' }]">
    <a-input v-model:value="name" size="large" placeholder="Enter name." />
  </a-form-item>
  <a-form-item label="Description" name="des" :rules="[{ required: false }]">
    <a-input v-model:value="des" size="large" placeholder="Enter description." />
  </a-form-item>
</template>

<style lang="scss" scoped>
.ant-input {
  width: 560px;
}
</style>
