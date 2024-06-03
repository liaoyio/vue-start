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
  <div class="m-radio grid gap-6 md:grid-cols-2">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="m-radio-wrap"
      :class="{ 'm-radio-wrap-checked': value === option.value }"
    >
      <div class="m-box flex flex-col" @click="onClick(option.value)">
        <div class="flex items-center">
          <span class="u-radio" :class="{ 'u-radio-checked': value === option.value }" />
          <span class="u-label">
            <slot :label="option.label">{{ option.label }}</slot>
          </span>
        </div>
        <span v-if="option.info" class="mb-0.5 mt-2 pl-6 text-info-4">{{ option.info }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.dark .m-radio {
  color: rgba(255, 255, 255, 0.85);

  .m-radio-wrap {
    border-color: rgb(55, 58, 64);

    &:hover {
      background-color: rgb(37, 38, 43);
      color: rgba(255, 255, 255, 0.85);
    }

    &-checked {
      border-color: var(--primary-color);
    }
  }
}

.m-radio {
  color: #202d40;
  font-size: 14px;
  line-height: 1;

  .m-radio-wrap {
    font-size: 14px;
    display: inline-block;
    border-radius: 8px;
    padding: 12px;
    border-color: rgb(223, 229, 240);
    border-width: 1px;
    border-style: solid;
    transition:
      color 0.2s,
      background 0.2s,
      border-color 0.2s;

    &:hover {
      background-color: rgb(247, 249, 254);
    }

    &-checked {
      border-color: var(--primary-color);
    }

    .m-box {
      height: 100%;
      display: inline-flex; // 设置为flex布局后，所有的子元素都会变成行内块元素
      align-items: flex-start;
      cursor: pointer;

      .u-radio {
        position: relative;
        flex-shrink: 0; // 默认 1.即空间不足时，项目将缩小
        width: 16px;
        height: 16px;
        background: transparent;
        border: 1px solid rgb(223, 229, 240);
        border-radius: 50%;
        transition: all 0.3s;

        &::after {
          box-sizing: border-box;
          position: absolute;
          inset-block-start: 50%;
          inset-inline-start: 50%;
          display: block;
          width: 16px;
          height: 16px;
          margin-block-start: -8px;
          margin-inline-start: -8px;
          background-color: #fff;
          border-block-start: 0;
          border-inline-start: 0;
          border-radius: 16px;
          transform: scale(0);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
          content: '';
        }
      }

      .u-radio-checked {
        border-color: var(--primary-color);
        background-color: var(--primary-color);

        &::after {
          transform: scale(0.375);
          opacity: 1;
          transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
        }
      }

      .u-label {
        word-break: break-all;
        padding: 0 8px;
        font-size: 14px;
        line-height: 22px;
        display: inline-block;
      }
    }
  }
}
</style>
