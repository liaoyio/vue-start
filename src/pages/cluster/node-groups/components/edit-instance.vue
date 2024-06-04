<script lang="ts" setup>
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
</script>

<template>
  <a-modal v-model:open="open" :closable="false" title="Edit Instance Number">
    <p class="pb-6 pt-4 text-gray-modal">
      <a-input v-model:value="state" type="number" />
    </p>
    <template #footer>
      <a-button
        key="back"
        style="color: rgb(32, 45, 64); background-color: transparent; border-color: rgb(237, 242, 250)"
        @click="open = false"
        >Cancel</a-button
      >
      <a-button key="submit" type="primary" class="yi-btn-default" @click="$emit('submit')">OK</a-button>
    </template>
  </a-modal>
</template>
