<script lang="ts" setup>
import dayjs, { type Dayjs } from 'dayjs'
import { message } from 'ant-design-vue'
import { ECharts } from '@/components/tools'
import type { ClusterMetrics, metricsParams } from '@/api/command'
const route = useRoute()

const loading = ref(false)

const params = ref<metricsParams & { picker: any }>({
  eksClusterId: Number(route.params.clusterId),
  rangeType: 'hour',
  picker: null,
})

const pickType = computed(() => {
  if (params.value.rangeType === 'hour') {
    return 'date'
  } else if (params.value.rangeType === 'day') {
    return 'month'
  } else if (params.value.rangeType === 'month') {
    return 'year'
  }
})

const cop = ref()

const getCat = async () => {
  loading.value = true
  if (params.value.picker) {
    if (params.value.rangeType === 'hour') {
      params.value.targetDate = dayjs(params.value.picker).format('YYYY-MM-DD')
    } else if (params.value.rangeType === 'day') {
      params.value.targetMonth = dayjs(params.value.picker).format('YYYY-MM')
    } else if (params.value.rangeType === 'month') {
      params.value.targetYear = dayjs(params.value.picker).format('YYYY')
    }
  } else {
    delete params.value.targetDate
    delete params.value.targetMonth
    delete params.value.targetYear
  }

  try {
    const res = await getK8sMetrics(params.value)
    const options = formatByHour(res)
    cop.value = options
  } catch {
    message.error('Request failed, please try again later')
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  getCat()
})

const formatByHour = (res: ClusterMetrics[]) => {
  // hourStr dayStr monthStr
  const byHourX = res.map((item) => item.hourStr ?? item.dayStr ?? item.monthStr) ?? []

  /** Memory Capacity  */
  const nodeMemoryTotalMb = res.map((item) => item.nodeMemoryTotalMb ?? 0)
  /** Cache Request Memory */
  const podRequiredMb = res.map((item) => item.podRequiredMb ?? 0)
  /** Total Used Memory */
  const cacheTotalRssMb = res.map((item) => item.cacheTotalRssMb ?? 0)

  const options = filterOption(byHourX, [
    {
      data: nodeMemoryTotalMb,
      type: 'line',
      smooth: true,
      name: 'Memory Capacity',
      emphasis: { focus: 'series' },
      itemStyle: { color: '#3D5DF4' },
    },
    {
      data: podRequiredMb,
      type: 'line',
      name: 'Cache Request Memory',
      emphasis: { focus: 'series' },
      itemStyle: { color: 'rgb(135, 208, 104)' },
    },
    {
      data: cacheTotalRssMb,
      type: 'line',
      name: 'Total Used Memory',
      emphasis: { focus: 'series' },
      itemStyle: { color: '#ff4d4f' },
    },
  ])
  return options
}

function filterOption(x: any, series: any[]) {
  const option = {
    legend: {
      top: 0,
      itemWidth: 24, // 设置宽度
      itemHeight: 10, // 设置高度
      itemGap: 30,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    xAxis: [
      {
        data: x,
        axisLabel: {
          show: true,
          type: 'time',
          margin: 16,
          color: '#1e324f',
        },
        axisLine: {
          // show:false,
          lineStyle: {
            color: 'rgba(39, 76, 129, 0.11)',
            width: 0.5,
          },
        },
        axisTick: { show: false }, // 刻度格子线
      },
    ],
    yAxis: [
      {
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(39, 76, 129, 0.11)',
            type: 'dashed',
            width: 0.8,
          },
        },
      },
    ],
    series,
  }
  return option
}

const disabledDate = (current: Dayjs) => {
  if (pickType.value === 'date') {
    // 无法选择今年之前的今天之后的日期
    return (current && current > dayjs().endOf('day')) || current < dayjs().startOf('year')
  } else if (pickType.value === 'month') {
    // 无法今天之后的月份
    return current && current > dayjs().endOf('month')
  } else {
    // 无法选择今年之后
    return current && current > dayjs().endOf('year')
  }
}
</script>

<template>
  <main>
    <header class="mt-header my-2">
      <h3 class="block">Overview</h3>
    </header>
    <section px="6" py="2" class="flex flex-col gap-y-8">
      <div class="w-full">
        <div class="flex">
          <div class="ml-auto">
            <a-radio-group v-model:value="params.rangeType" style="margin: 8px" @change="params.picker = null">
              <a-radio-button value="hour">Hour</a-radio-button>
              <a-radio-button value="day">Day</a-radio-button>
              <a-radio-button value="month">Month</a-radio-button>
            </a-radio-group>

            <a-date-picker
              v-model:value="params.picker"
              class="w-40 ml-2"
              :picker="pickType"
              :disabled-date="disabledDate"
            />
          </div>
        </div>
        <a-card :loading="loading" class="mt-6">
          <ECharts width="100%" height="500px" :options="cop" />
        </a-card>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.bento-card li {
  div:nth-child(2) {
    font-size: 14px;
    margin-top: 8px;
    font-weight: 500;
    color: rgb(32, 45, 64);
    color: var(--tips-text-color);
  }
}
</style>
