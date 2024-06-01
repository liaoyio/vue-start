<script setup lang="ts">
const props = defineProps({
  percent: [Number, String],
  useRate: {
    type: Boolean,
    default: false,
  },
})

const percentValue = computed(() => {
  const percent = Number(props.percent ?? 0)
  return percent <= 1 ? Number((percent * 100).toFixed(2)) : percent
})

const useRateColor = computed(() => {
  const rate = percentValue.value
  if (rate < 60) {
    return '#67c23a'
  } else if (rate < 80) {
    return '#0065fd'
  } else if (rate < 90) {
    return '#fd7e14'
  } else {
    return '#ff4d4f'
  }
})

const color = computed(() => {
  const rate = percentValue.value
  if (rate > 80) {
    return '#67c23a'
  } else if (rate > 60) {
    return '#0065fd'
  } else if (rate > 20) {
    return '#6610f2'
  } else if (rate > 18) {
    return '#fd7e14'
  } else if (rate > 12) {
    return '#ffc107'
  } else {
    return '#ff4d4f'
  }
})
</script>

<template>
  <span class="flex flex-1 text-xs">
    <a-progress
      :percent="percentValue"
      size="small"
      :show-info="false"
      :stroke-color="useRate ? useRateColor : color"
      style="width: 80px"
    />
    <span class="pt-[2px]">{{ percentValue }}%</span>
  </span>
</template>
