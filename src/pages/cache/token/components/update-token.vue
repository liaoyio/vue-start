<script setup lang="ts">
import type { ModalProps } from 'ant-design-vue'

const state = ref<{ mode?: 'ro' | 'rw'; id?: number }>({
  mode: undefined,
  id: undefined,
})
const open = ref(false)
const loading = ref(false)

defineExpose({ open, loading, state })

const emit = defineEmits(['ok'])

const onSubmit = () => {
  emit('ok', state.value)
}

const $bind = computed(() => {
  return {
    width: 618,
    centered: true,
    okText: 'Confirm',
    title: 'Update Access Token',
    okButtonProps: {
      size: 'large',
      loading: loading.value,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})

const options = [
  { value: 'ro', label: 'Read Only' },
  { value: 'rw', label: 'Read & Write' },
]
</script>

<template>
  <a-modal v-model:open="open" v-bind="$bind" @ok="onSubmit" @cancel="open = false">
    <a-select
      v-model:value="state.mode"
      size="large"
      placeholder="Please select the Mode"
      :options="options"
      class="my-8 w-full"
    >
      <template #suffixIcon>
        <SvgIcon name="select-suffix" />
      </template>
    </a-select>
  </a-modal>
</template>
