<script setup lang="ts">
import dayjs from 'dayjs'
import { useRequest } from 'vue-request'
import { FieldTimeOutlined } from '@ant-design/icons-vue'
import { CodeView, ECharts } from '@/components/tools'
import { formatBytes, toThousandFilter } from '@/utils'
import { getChart, getHotHey } from '@/api'
import type { Cards, ChartParams, ChartRes, FMetrics } from '@/types/cache'

const { data } = useRequest(cacheOne)

const options = ref([
  { value: 'hour', label: 'Past Hour' },
  { value: 'hour,3', label: 'Past 3 Hours' },
  { value: 'hour,12', label: 'Past 12 Hours' },
  { value: 'day', label: 'Past Day' },
  { value: 'day,3', label: 'Past 3 Days' },
  { value: 'week', label: 'Past Week' },
])

const route = useRoute()
const unit = ref('hour')
const cluster = ref()
const metrics = ref<FMetrics>()
const cards = ref<Cards>()
const visibleKey = ref(false)
const code = ref<any>()
const loading = ref(false)

const params = reactive<ChartParams>({
  byocCacheId: route.params.id as any,
  start: getTimeAgo('hour') / 1000,
  step: '3m',
})

const shardOptions = computed(() => {
  const len = data.value?.shardInfoList.length ?? 0
  // eslint-disable-next-line unicorn/no-new-array
  const arr = new Array(len).fill(0)
  return arr.map((_, i) => ({ value: i, label: `Shard ${i}` }))
})

const titleMap = {
  memory_used_bytes: 'Memory Used Bytes',
  db_keys: 'DB Keys',
  client_commands_total: 'Client Commands Total',
  hit_rate: 'Hit Rate',
  big_key_count: 'Big Key Count',
  hot_key_count: 'Hot Key Count',
  slow_command_count: 'Slow Command Count',
}

watchEffect(() => initChartData())

function initChartData() {
  loading.value = true
  getChart(params).then((res) => {
    const { memo, card } = formatCharts(res)
    metrics.value = Object.keys(memo).length ? memo : undefined
    cards.value = card
    setTimeout(() => (loading.value = false), 300)
  })
}

function formatCharts(res: ChartRes) {
  const memo = {} as FMetrics
  const card = {} as Cards
  for (const [key, value] of Object.entries(res)) {
    if (Array.isArray(value) && value.length > 0) {
      const x = value.map((item) => {
        // const formatStr = lang.value ? "D MMM HH:mm" : "YYYY年MM月DD日 HH:mm";
        return dayjs(item[0] * 1000).format('D MMM HH:mm')
      })
      const y = value.map((item) => (item[1] === 'NaN' ? 0 : Number(item[1])))
      const item = mergeData({ x, y })
      memo[key as keyof FMetrics] = item
    } else {
      card[key as keyof Cards] = key === 'fee' ? toThousandFilter(value) : formatBytes(value)
    }
  }
  return { memo, card }
}

function hlChange(e: any) {
  const setMap = new Map([
    ['hour', '3m'],
    ['hour,3', '20m'],
    ['hour,12', '30m'],
    ['day', '1h'],
    ['day,3', '3h'],
    ['week', '6h'],
  ])

  const [type, ago] = e.split(',')
  const start = getTimeAgo(type as any, ago ? Number(ago) : 1) / 1000

  params.start = start
  params.step = setMap.get(e) as string
}

const hcInstance = (e: any) => {
  params.shardIndex = e
}

type Type = keyof Pick<FMetrics, 'big_key_count' | 'hot_key_count' | 'slow_command_count'>

const hcKeyView = async (type: Type) => {
  visibleKey.value = true

  const typeMap = {
    big_key_count: 'viewBigKeys',
    hot_key_count: 'viewHotKeys',
    slow_command_count: 'viewSlowLog',
  }

  const params = {
    cacheServiceId: route.params.id as any,
    [typeMap[type]]: true,
  }

  const codes = await getHotHey(params)
  code.value = codes
}

function getTimeAgo(type: 'hour' | 'day' | 'week', ago = 1) {
  const now = Date.now()
  const hour = 60 * 60 * 1000 // 1小时的毫秒数
  const day = 24 * hour // 1天的毫秒数
  const week = 7 * day // 1周的毫秒

  switch (type) {
    case 'hour':
      return now - ago * hour
    case 'day':
      return now - ago * day
    case 'week':
      return now - ago * week
    default:
      return now - ago * hour
  }
}

function mergeData(value: any) {
  const res = {
    // 悬浮提示相关
    tooltip: {
      trigger: 'axis',
    },
    //图表边界控制
    // grid: {
    //   top: '10px',
    //   bottom: '10px',
    //   left: '10px',
    //   right: '10px',
    //   containLabel: true,
    // },
    grid: {
      left: '0',
      right: '0',
      bottom: '2%',
      top: '10px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        show: true,
        margin: 10,
      },
      data: value.x,
      axisLine: {
        lineStyle: {
          width: 0.5,
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: { show: false }, //不显示坐标轴刻度
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false }, //不显示坐标抽轴线
      axisTick: { show: false }, //不显示坐标轴刻度
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          width: 0.5,
        },
      },
    },
    series: [
      {
        data: value.y,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        animation: true,
        areaStyle: {
          color: 'rgba(12, 166, 242,0.1)',
        },
        lineStyle: { color: '#0ca6f2', width: 1.5 },
        itemStyle: {
          color: '#0ca6f2',
        },
      },
    ],
  }
  return res
}
</script>

<template>
  <main>
    <header class="flex_lr" p="x-6" h="14" m="y-2">
      <h3 class="block">General</h3>
    </header>
    <section px="12" py="2">
      <div grid="~ grid-cols-1 gap-6">
        <a-card :loading="loading" class="bg-[#f9f9f9] dark:bg-[#222222]">
          <div class="grid-card my-2 mx-1">
            <div class="items">
              <div class="title">Storage Bytes</div>
              <div class="meat">{{ cards?.storageBytes ?? 0 }}</div>
            </div>
            <div class="items">
              <div class="title">Read Bytes</div>
              <div class="meat">{{ cards?.readBytes ?? 0 }}</div>
            </div>

            <div class="items">
              <div class="title">Write Bytes</div>
              <div class="meat">{{ cards?.writeBytes ?? 0 }}</div>
            </div>
            <div class="items">
              <div class="title">Fee</div>
              <div class="meat">{{ cards?.fee ?? 0 }}</div>
            </div>
          </div>
        </a-card>

        <div class="flex flex-row-reverse gap-20 py-2">
          <div class="flex items-center gap-3">
            <span>Filter Data</span>
            <a-select v-model:value="unit" :options="options" class="w-60" @change="hlChange">
              <template #suffixIcon>
                <FieldTimeOutlined class="text-base" />
              </template>
            </a-select>
          </div>

          <div class="flex items-center gap-3">
            <span>Shards</span>
            <a-select
              v-model:value="cluster"
              placeholder="select shards"
              :options="shardOptions"
              class="w-60"
              allow-clear
              @change="hcInstance"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-8">
          <a-card v-for="(option, key) in metrics" :key="key" :loading="loading">
            <div class="flex_lr mb-6">
              <h4 class="text-base">{{ titleMap[key] }}</h4>
              <span v-if="key === 'big_key_count' || key === 'hot_key_count' || key === 'slow_command_count'">
                <a-button class="!text-xs" size="small" @click="hcKeyView(key)">View Details</a-button>
              </span>
            </div>
            <div class="size-full">
              <ECharts height="200px" :options="option" />
            </div>
          </a-card>
        </div>
        <a-empty v-if="!loading && !metrics" :image-style="{ height: '80px' }" class="py-10" />

        <a-modal v-model:open="visibleKey" title="Hot/Big key view" width="60%">
          <div v-if="code" class="rounded bg-[#282c34] pb-4 pt-8 overflow-hidden">
            <CodeView :code-json="JSON.stringify(code, null, '\t')" />
          </div>
          <template #footer>
            <a-button key="submit" @click="visibleKey = false">Close</a-button>
          </template>
        </a-modal>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.grid-card {
  @apply grid md:gap-6 grid-cols-1 md:grid-cols-4 gap-8;

  .items {
    @apply rounded-lg px-5 pt-4 pb-3 shadow-sm bg-white dark:border dark:bg-transparent dark:border-[#373a40]/60;

    .title {
      @apply text-[#606266] dark:text-white mb-2 leading-5 opacity-80;
    }

    .meat {
      @apply text-black/80 dark:text-white/90;
      @apply text-xl font-normal;
    }

    span {
      padding-left: 0.25rem;
    }
  }
}
</style>
