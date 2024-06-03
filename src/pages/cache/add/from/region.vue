<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { PlusOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  modelValue?: string
  regionsList: any[]
}>()

const emit = defineEmits(['update:modelValue'])
const region = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="flex items-center">
    <a-form-item label="Region" name="region" :rules="[{ required: true, message: 'please select region!' }]">
      <a-select v-model:value="region" size="large" style="width: 560px" placeholder="Please Select Region.">
        <a-select-option v-for="item in regionsList" :key="item" :value="item.dev_code">
          {{ item.city }}
          ( {{ item.code }} )
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-button size="large" class="mt-1 items-center -ml-8 !flex !text-sm" @click="$router.push({ name: 'NewK8s' })">
      Init Runtime
    </a-button>
  </div>
</template>

<style lang="scss" scoped>
::v-deep(.ant-select-selector) {
  width: 560px;
  // height: 36px !important;
  // line-height: 36px !important;
  border-radius: 8px;
}
</style>
