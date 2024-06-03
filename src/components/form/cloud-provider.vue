<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import SvgIcon from '../global/SvgIcon.vue'

type Props = { modelValue: string; clouds: { label: string; value: string }[] }

const props = withDefaults(defineProps<Props>(), {
  modelValue: 'aws',
})

const emit = defineEmits(['update:modelValue'])
const state = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div id="yi-r-groups">
    <a-radio-group v-model:value="state" class="flex" style="z-index: 1">
      <a-radio-button v-for="(item, index) in clouds" :key="index" class="yi-r-btn" :value="item.value">
        <span class="w-full flex items-center gap-2.5">
          <SvgIcon v-if="item.value === 'aliyun'" name="cloud-aliyun" class="h-6 w-6" />
          <SvgIcon v-if="item.value === 'aws'" name="cloud-aws" class="h-6 w-6" />
          <span class="text-center"> {{ item.label }}</span>
        </span>
      </a-radio-button>
    </a-radio-group>
  </div>
</template>

<style lang="scss" scoped>
.dark #yi-r-groups .ant-radio-group {
  .yi-r-btn {
    color: rgba(255, 255, 255, 0.85);
    border: 1px solid rgb(55, 58, 64);

    &:not(.ant-radio-button-wrapper-disabled):hover {
      background-color: rgb(37, 38, 43);
      color: rgba(255, 255, 255, 0.85);
    }

    svg {
      color: #fff;
    }

    &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
      border-color: rgb(12, 166, 242);
    }

    &.ant-radio-button-wrapper-checked {
      color: rgb(12, 166, 242);
      background-color: rgb(37, 38, 43);
    }
  }
}

#yi-r-groups .ant-radio-group {
  margin: -4px;

  .yi-r-btn {
    width: 148px;
    align-items: center;
    justify-content: center;
    display: flex;
    height: 42px;
    margin: 6px;
    font-size: 14px;
    padding: 0px 8px;
    font-weight: 400;
    color: rgb(32, 45, 64);
    border: 1px solid rgb(223, 229, 240);
    border-radius: 8px;
    padding: 12px;

    svg {
      color: #000;
    }

    &:not(.ant-radio-button-wrapper-disabled):hover {
      color: rgb(76, 87, 108);
      background-color: rgb(247, 249, 254);
    }

    &.ant-radio-button-wrapper:not(:first-child)::before {
      display: hidden !important;
      background-color: transparent;
      padding-block: 0 !important;
    }

    &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
      border-color: rgb(12, 166, 242);
    }

    &.ant-radio-button-wrapper-checked {
      color: rgb(12, 166, 242);
      background-color: #fff;
    }
  }
}
</style>
