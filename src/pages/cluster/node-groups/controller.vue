<script setup lang="ts">
import { message } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { Progress, StatusCluster } from '@/components/ui'
import { LoadingLoop } from '@/components/icon'
import { ScaleModal } from './components/index'

const route = useRoute()

const scaleRef = ref<InstanceType<typeof ScaleModal> | null>(null)

const eksClusterId = route.params.clusterId

const { data: cluster } = useRequest(getClusterById, {
  defaultParams: [Number(eksClusterId)],
})

const { data: nodes } = useRequest(getEksNodeGroupResourceList, {
  defaultParams: [{ eksClusterId: Number(eksClusterId), isController: true }],
})

const list = computed(() => nodes.value?.list ?? [])

const base = computed(() => nodes.value?.list?.filter((item) => item.eksVersion)[0])

const router = useRouter()
const handleViewLogs = (stackId: number) => {
  if (!stackId) return message.error('No stackId')
  router.push({ name: 'Logs', query: { stackId, type: 'scale' } })
}

const emit = defineEmits<{ (e: 'refresh', stackId: number): void }>()
const handleRefresh = (stackId: number) => emit('refresh', stackId)

const handleScale = () => {
  const { instanceNumber, minSize, maxSize, name } = base.value!

  scaleRef.value?.open({
    eksClusterId: cluster?.value?.id,
    nodeGroupName: name,
    instanceNumber,
    minSize,
    maxSize,
  })
}

const controllerColumns = [
  { title: 'Zone', dataIndex: 'zone', key: 'zone' },
  {
    title: 'Instance Number',
    dataIndex: 'instanceNumber',
    key: 'instanceNumber',
    // width: '20%',
  },
  {
    title: 'MemUsage',
    dataIndex: 'memoryRequestedRate',
    key: 'memoryRequestedRate',
    width: '12%',
  },
  {
    title: 'CPU Usage',
    dataIndex: 'cpuRequestedRate',
    key: 'cpuRequestedRate',
    width: '12%',
  },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="pb-2 text-base font-medium text-gray-i">
      Controller Node Info
      <p class="text-12px font-normal text-[#4c576c]">Controller nodes are used to deploy control components.</p>
    </div>

    <div class="flex flex-col gap-4">
      <div
        class="grid grid-cols-3 items-center items-center gap-4 border-b border-t border-dashed px-4 py-4 sm:grid-flow-col"
      >
        <div class="meat">
          <div>InstanceType</div>
          <span>{{ base?.instanceType ?? '-' }}</span>
        </div>
        <div class="meat">
          <div>Version</div>
          <span>{{ base?.eksVersion }}</span>
        </div>
        <div class="meat">
          <div>Status</div>
          <template v-if="base?.status">
            <StatusCluster v-if="base.status === 'Ready'" :status="1" :phase="base.status" />
            <span v-else-if="base.status === 'Scaling'" class="flex_c gap-1.5"> <LoadingLoop /> Scaling </span>
            <span v-else-if="base.status === 'Creating'" class="flex_c gap-1.5"> <LoadingLoop /> Creating </span>
            <span v-else> - </span>
          </template>
        </div>
      </div>

      <div class="my-3 flex flex-row-reverse">
        <div class="flex gap-4">
          <a-button type="primary" class="flex items-center gap-2" @click="handleScale">
            Scale
            <SvgIcon name="scale" size="16" class="text-black·" />
          </a-button>

          <a-button
            type="primary"
            class="flex items-center gap-2"
            :disabled="!base?.stackId || base.status !== 'Ready'"
            @click="handleViewLogs(cluster?.stackId!)"
          >
            <SvgIcon name="view-log" size="16" />
            Logs
          </a-button>
        </div>
      </div>

      <a-table :columns="controllerColumns" :data-source="list" :pagination="false" class="yi-table">
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'zone'">
            <a-tag style="border: none" :bordered="false" color="blue">
              {{ text }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'cpuRequestedRate'">
            <Progress :percent="record?.cpuRequestedRate" :use-rate="true" />
          </template>

          <template v-if="column.key === 'memoryRequestedRate'">
            <div class="pr-4">
              <Progress :percent="record?.memoryRequestedRate" :use-rate="true" />
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>

  <ScaleModal ref="scaleRef" @ok="handleRefresh" />
</template>

<style lang="scss" scoped>
::v-deep(.ant-table-wrapper .ant-table-tbody > tr > td) {
  padding: 12px 16px !important;
}
</style>
