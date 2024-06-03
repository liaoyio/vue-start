<script lang="ts" setup>
import { h } from 'vue'
import { ExclamationCircleFilled, WarningFilled } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { notification } from 'ant-design-vue'
import { LoadingLoop, Sand } from '@/components/icon'
import type { StepLogs } from '@/types/byoc'

type State = {
  stackId: number
  lastId?: number
}

const router = useRouter()
const route = useRoute()

const logRef = ref<HTMLElement>()
const logsList = ref<StepLogs[]>([])

const loadding = ref(true)
const retryLoading = ref(false)

const state = reactive<State>({
  stackId: Number(route.query.stackId),
})

const logPull = async () => {
  const { stackId, lastId } = state
  const params: any = { stackId }
  if (lastId) {
    params.lastId = lastId
  }
  const res = await getLogs(params)
  if (res.list.length) {
    state.lastId = res.lastId
    logsList.value = [...logsList.value, res]
  }
  if (res.isBreak) {
    pause()
  }
}

// 轮询请求
const { pause, resume } = useIntervalFn(
  () => {
    logPull()
  },
  3000,
  { immediateCallback: true, immediate: false },
)

const openNotification = () => {
  notification.open({
    message: 'Waiting for retry......',
    icon: () => h(Sand, { style: 'color: #0065FD' }),
  })
}

const retryDeploy = async () => {
  retryLoading.value = true
  if (route.query.type === 'delete') {
    const { stackId } = await delCluster({ stackId: state.stackId })
    if (String(stackId)) {
      state.stackId = stackId as any
      router.replace({ name: 'Logs', query: { stackId, type: 'delete' } })
      logsList.value = []
      init()
      openNotification()
      setTimeout(() => (retryLoading.value = false), 1600)
    }
  } else {
    onclusterDeploy()
  }
}

const onclusterDeploy = async () => {
  const { stackId } = await clusterDeploy({
    stackId: state.stackId,
  })
  if (String(stackId)) {
    state.stackId = stackId
    const query: any = { stackId }
    if (route.query.type) {
      query.type = route.query.type
    }
    router.replace({ name: 'Logs', query })
    resume()
    openNotification()
    setTimeout(() => (retryLoading.value = false), 1600)
  }
}

const disabled = computed(() => {
  const result = logsList.value.find((i) => i.status < 0)
  return result?.isBreak && result.status < 0 && route.query.type !== 'scale'
})

const shwloading = computed(() => {
  const result = logsList.value.filter((i) => i.isBreak)
  return !result.length
})

const notLog = computed(() => {
  return logsList.value.every((i) => !i.list.length)
})

const tips = computed(() => {
  if (route.query.type === 'delete' && disabled) {
    return 'Deleting cluster, it will take about 10 minutes to complete. The cluster will no longer be available after deletion.'
  } else if (route.query.type === 'scale') {
    return 'Node group scaling is in progress.'
  } else {
    return 'Creating cluster, it will take about 25 minutes to complete. During this time, you can close the page to operate other clusters.'
  }
})

onMounted(() => {
  init()
})

const init = () => {
  resume()
  setTimeout(() => (loadding.value = false), 1200)
}

const getColor = (type: number) => {
  switch (type) {
    case 0:
      return 'text-gray-400'
    case 1:
      return 'text-gray-400'
    case 10:
      return 'text-green-500'
    case -1:
      return 'text-red-500'
    case -10:
      return 'text-red-500'
    default:
      return 'text-gray-400'
  }
}

const vScrollDown = {
  updated: (el: HTMLElement) => {
    el.scrollTo({
      top: el.scrollHeight - el.clientHeight,
      behavior: 'smooth',
    })
  },
}
</script>

<template>
  <main>
    <header class="mt-header my-4">
      <h3>Deployment Details</h3>
      <a-button
        :loading="retryLoading"
        :disabled="!disabled"
        class="flex items-center gap-1"
        style="transform: rotate(90dge)"
        @click="retryDeploy"
      >
        <template #icon>
          <SvgIcon name="reload" class="transform rotate-90" size="16" />
        </template>
        Retry
      </a-button>
    </header>
    <section px="6" py="2">
      <a-alert
        v-if="shwloading"
        type="info"
        show-icon
        class="mx-8 mb-4 border-transparent bg-[#f5f9ff] py-3 text-[14px]"
        closable
      >
        <template #icon>
          <ExclamationCircleFilled style="color: #fa7624" />
        </template>
        <template #message>
          <span> {{ tips }} </span>
        </template>
      </a-alert>

      <div class="flex gap-8 py-4">
        <div class="w-full overflow-hidden rounded-lg bg-[#23282e] px-1 py-3 pl-6 pt-4">
          <div
            ref="logRef"
            v-scroll-down
            class="logs-container max-h-[600px] min-h-[600px] w-full overflow-y-scroll font-mono"
          >
            <template v-if="notLog && !loadding">
              <div class="dot text-green-400">Loading logs<span class="dot-ani" /></div>
            </template>
            <div v-else>
              <div v-for="(logs, index) in logsList" :key="index">
                <div v-for="(item, idx) in logs?.list" :key="idx" class="py-[1px]" :class="getColor(item.type)">
                  <div class="flex items-center justify-between">
                    <div class="flex items-start py-[1px]">
                      <span class="h-6 min-w-[500px]" style="line-height: 24px">
                        [{{ dayjs(item.createdDate).format('YYYY-MM-DD HH:mm:ss') }}] {{ item.step }}</span
                      >
                      <span v-if="item?.message"> {{ item?.message }} </span>
                    </div>
                  </div>
                </div>
                <template v-if="logs.failedResourceList.length > 0">
                  <br />

                  <div class="py-[1px] text-yellow-500">
                    <div class="flex items-center justify-between">
                      <div class="flex items-start py-[1px]">
                        <span class="text-yellow-500">
                          <span> <WarningFilled class="text-[14px] text-yellow-500" /> Warning : </span>
                          Cluster deletion successful, but the following related dependent resources are left behind
                        </span>
                      </div>
                    </div>
                  </div>

                  <div v-for="(failed, key) in logs?.failedResourceList" :key="key" class="py-[1px] text-red-500">
                    <div class="flex items-center justify-between">
                      <div class="flex items-start py-[1px]">
                        <span>{{ failed.type }} </span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <LoadingLoop v-if="shwloading" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.dot-ani {
  margin-left: 2px;
  display: inline-block;
  height: 12px;
  line-height: 12px;
  overflow: hidden;
}

.dot-ani::after {
  display: inline-table;
  white-space: pre;
  content: '\A.\A..\A...';
  animation: spin 2s steps(4) infinite;
}

@keyframes spin {
  to {
    -webkit-transform: translateY(-48px);
    transform: translateY(-48px);
  }
}
</style>
