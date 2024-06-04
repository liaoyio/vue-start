<script lang="ts" setup>
import { useRequest } from 'vue-request'

const props = defineProps({
  modelValue: {
    type: [Array, String] as any,
    default: (rawProps: { multiple?: boolean }) => {
      return rawProps.multiple ? [] : ''
    },
  },
  multiple: { type: Boolean, default: false },
  region: { type: String, required: true },
  isController: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
const state = useVModel(props, 'modelValue', emit)

const { data, loading } = useRequest(getInstanceTypeList, {
  defaultParams: [
    {
      region: 'ap-southeast-1',
      isController: props.isController,
    },
  ],
})
</script>

<template>
  <a-space>
    <a-select
      v-model:value="state"
      style="width: 600px"
      :loading="loading"
      allow-clear
      :mode="multiple ? 'multiple' : undefined"
      show-arrow
      placement="bottomLeft"
      :list-height="300"
    >
      <a-select-opt-group v-for="item in data?.list" :key="item.instanceTypePrefix" style="margin: 4px">
        <template #label>
          <div class="my-1 w-full border rounded border-dashed bg-[#f7f9fe] px-2 py-1 font-semibold text-primary">
            {{ item.instanceTypePrefix }}
          </div>
        </template>
        <a-select-option
          v-for="it in item.instanceTypeList"
          :key="it.instanceType"
          :value="it.instanceType"
          style="margin: 4px"
        >
          <div class="flex flex-col gap-2">
            <div class="font-medium">{{ it.instanceType }}</div>
            <ul class="flex gap-3 text-[#47576c] !text-xs !font-normal">
              <li>vCPU: {{ it.cpuVCore }} vCPUs</li>
              <li>Memory: {{ it.memGB }} GiB</li>
              <li>Memory: {{ it.memGB }} GiB</li>
            </ul>
          </div>
        </a-select-option>
      </a-select-opt-group>
      <template #tagRender="{ closable, onClose, value }">
        <a-tag :closable="closable" style="margin-right: 3px" color="blue" @close="onClose">
          {{ value }}
        </a-tag>
      </template>
    </a-select>
  </a-space>
</template>

<style lang="scss">
::v-deep(.ant-select-selector) {
  background-color: transparent !important;

  .ant-select-selection-item {
    background-color: transparent;
  }
}
</style>
