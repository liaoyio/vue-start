<script lang="ts" setup>
import { computed, defineProps, useAttrs } from 'vue'

const props = defineProps({
  title: {
    //提示标题
    type: String,
    default: '',
  },
})

/** 获取绑定属性 */
const getBindValue = computed(() => {
  const delArr = ['title'] //需要过滤的属性
  const attrs = useAttrs()
  const obj = { ...attrs, ...props } as any
  for (const key in obj) {
    if (delArr.includes(key)) {
      delete obj[key]
    }
  }
  return obj
})

/** 不溢出不显示tooltip */
const showToolTip = (e: any) => {
  const { clientWidth, scrollWidth } = e.target
  if (clientWidth >= scrollWidth) {
    e.target.style.pointerEvents = 'none' // 阻止鼠标事件
  }
}
</script>

<template>
  <a-tooltip v-bind="getBindValue" @mouseenter="showToolTip">
    <template #title>
      {{ props.title }}
    </template>
    <slot
      ><span>{{ props.title }}</span></slot
    >
  </a-tooltip>
</template>
