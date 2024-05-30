<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { watchOnce } from '@vueuse/core'
import { useAppStore } from '@/store'
const app = useAppStore()
const onChange = (mode: 'light' | 'auto' | 'dark') => {
  app.themeswitcher(mode)
}

const props = defineProps({
  as: {
    type: String,
    default: 'div',
  },
  active: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['activated'])

const container = ref()

const context = inject<any>('nav-context')

// current element index
const peers = inject<any>('peers')
const index = computed(() => {
  // @ts-ignore
  return peers?.value ? peers.value.indexOf(container.value) : -1
})

// active item indicator
const isActive = computed(() => {
  // @ts-ignore
  return context.activeItem.index === index.value
})

// navlist mounted callback
watchOnce(index, () => {
  // set default element as active
  if (props.active) {
    setActive(false)
  }

  if (index.value === peers.value.length - 1) {
    // @ts-ignore
    context.setMounted()
  }
})

watch(context.isMounted, () => {
  // set first element as active
  // @ts-ignore
  if (context.activeItem.index === -1 && index.value === 0) {
    setActive(false)
  }
})

// @ts-ignore
function setActive(event) {
  if (context.isVertical) {
    context.setActiveItem(index.value, container.value.getBoundingClientRect().height, container.value.offsetTop)
  } else {
    context.setActiveItem(index.value, container.value.getBoundingClientRect().width, container.value.offsetLeft)
  }

  if (event !== false) {
    if (typeof event === 'string') {
      onChange(event as 'light' | 'auto' | 'dark')
    }
    setTimeout(() => emit('activated'), context.duration)
  }
}
</script>

<template>
  <component :is="as" ref="container">
    <slot :set-active="setActive" :is-active="isActive" />
  </component>
</template>
