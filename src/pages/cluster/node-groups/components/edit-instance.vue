<script lang="ts" setup>
import type { ModalProps } from 'ant-design-vue'

const open = ref<boolean>(false)
const setModal = (value: boolean) => (open.value = value)

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])
const state = useVModel(props, 'modelValue', emit)

defineExpose({ setModal })

const $bind = computed(() => {
  return {
    width: 720,
    closable: false,
    centered: true,
    okText: 'OK',
    cancelText: 'Cancel',
    title: 'Edit Instance Number',
    okButtonProps: {
      size: 'large',
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})
</script>

<template>
  <a-modal v-model:open="open" v-bind="$bind" @ok="$emit('submit')">
    <p class="pb-6 pt-4 text-gray-modal">
      <a-input v-model:value="state" type="number" />
    </p>
  </a-modal>
</template>
