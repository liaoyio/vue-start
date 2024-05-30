<script setup lang="ts">
import { provide, reactive, ref } from 'vue'

const props = defineProps({
  as: {
    type: String,
    default: 'div',
  },
  duration: {
    type: Number,
    default: 320,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  fluid: {
    type: Boolean,
    default: false,
  },
})

const isReady = ref(false)

const activeItem = reactive({
  index: -1,
  size: 0,
  position: 0,
})

let previousSize = -1
let previousPosition = 0
let animated = true
// @ts-ignore
function handleFluidMove(targetSize, targetPosition) {
  if (!animated) {
    return
  }

  animated = false

  if (previousSize === -1) {
    activeItem.size = targetSize
    activeItem.position = targetPosition

    animated = true
  } else if (targetPosition > previousPosition) {
    activeItem.size = targetSize + targetPosition - previousPosition

    setTimeout(() => {
      activeItem.size = targetSize
      activeItem.position = targetPosition

      animated = true
    }, props.duration)
  } else {
    activeItem.position = targetPosition
    activeItem.size = previousSize + previousPosition - activeItem.position

    setTimeout(() => {
      activeItem.size = targetSize

      animated = true
    }, props.duration)
  }

  previousSize = targetSize
  previousPosition = targetPosition
}
// @ts-ignore
function setActiveItem(index, size, position) {
  activeItem.index = index

  if (props.fluid) {
    handleFluidMove(size, position)
  } else {
    activeItem.size = size
    activeItem.position = position
  }

  isReady.value = true
}

const isMounted = ref(false)

function setMounted() {
  isMounted.value = true
}

provide('nav-context', {
  setActiveItem,
  activeItem,
  isReady,
  setMounted,
  isMounted,
  isFluid: props.fluid,
  isVertical: props.vertical,
  duration: props.duration,
})
</script>

<template>
  <component :is="as">
    <slot
      :ready="isReady"
      :position="`${activeItem.position}px`"
      :duration="`${duration}ms`"
      :size="`${activeItem.size}px`"
    />
  </component>
</template>
