<script setup lang="ts">
import { useVModel } from '@vueuse/core'
const props = defineProps({
  modelValue: {
    type: String,
  },
  groups: {
    type: Array as PropType<any[]>,
  },
})

const emit = defineEmits(['update:modelValue'])
const busiGroupId = useVModel(props, 'modelValue', emit)
</script>

<template>
  <a-form-item
    label="BusiGroup"
    name="busiGroupId"
    :rules="[{ required: true, message: 'please select resource group!' }]"
  >
    <a-select
      v-model:value="busiGroupId"
      size="large"
      style="width: 560px"
      :options="groups"
      :field-names="{ label: 'name', value: 'id' }"
      placeholder="Please Select Resource Group."
    />
  </a-form-item>
</template>

<style lang="scss" scoped>
::v-deep(.ant-select-selector) {
  width: 560px;
}
</style>
