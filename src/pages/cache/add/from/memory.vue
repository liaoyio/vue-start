<script setup lang="ts">
import { useVModels } from '@vueuse/core'

const props = defineProps<{ maxMemoryMb?: number }>()
const emit = defineEmits(['update:maxMemoryMb', 'update:unit'])
const { maxMemoryMb } = useVModels(props, emit)
</script>

<template>
  <a-form-item
    name="maxMemoryMb"
    label="Memory"
    :rules="[{ required: true, message: 'Please input memory' }]"
    help="The memory of each shard is 4 GB. If number of shards is greater than or equal to 2, some commands may not be supported."
    :auto-link="false"
  >
    <a-row :gap="3">
      <div>
        <a-input-number v-model:value="maxMemoryMb" size="large" :min="1" :max="1024" style="min-width: 560px">
          <template #addonAfter> GB </template>
        </a-input-number>
      </div>
    </a-row>
  </a-form-item>
</template>
