<script setup lang="ts">
interface Props {
  options: any[] // 单选元素数据
  value?: any // 当前选中的值（v-model）
}
const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  value: null,
})

const emits = defineEmits(['update:value', 'change'])

function onClick(value: any) {
  if (value !== props.value) {
    emits('update:value', value)
    emits('change', value)
  }
}
</script>

<template>
  <div class="m-radio">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="m-radio-button-wrap"
      :class="{
        'm-radio-button-checked': value === option.value,
        'm-radio-button-disabled': option.disabled,
      }"
      @click="onClick(option.value)"
    >
      <span class="u-label">
        <slot :option="option">{{ option.label }}</slot>
      </span>
    </div>
  </div>
</template>

<style lang="scss">
.m-radio {
  display: flex;
  gap: 16px;
  color: #202d40;
  font-size: 14px;

  .m-radio-button-wrap {
    position: relative;
    padding: 12px 16px;
    border-color: rgb(223, 229, 240);
    border-width: 1px;
    border-style: solid;
    border-radius: 8px;
    cursor: pointer;
    transition:
      color 0.2s,
      background 0.2s,
      border-color 0.2s;

    &:hover {
      background-color: rgb(247, 249, 254);

      .m-radio-button-checked {
        border-color: var(--primary-color);
      }
    }
  }

  .m-radio-button-checked:not(.m-radio-button-disabled) {
    z-index: 1;
    border-color: var(--primary-color);
  }

  .m-radio-button-disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: rgba(0, 0, 0, 0.04);
    border-color: #d9d9d9;
    cursor: not-allowed;
  }

  .m-radio-button-disabled.m-radio-button-checked {
    background-color: rgba(0, 0, 0, 0.15);
  }
}
</style>
