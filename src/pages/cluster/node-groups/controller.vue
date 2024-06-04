<script setup lang="ts">
import { message } from 'ant-design-vue'
import { Progress, StatusCluster } from '@/components/ui'
import { LoadingLoop } from '@/components/icon'
import ScaleModal from '../components/modal/scale-modal.vue'
import type { Cluster } from '@/types/byoc'
import type { NodeGroups } from '@/api/byoc'

const scaleRef = ref<InstanceType<typeof ScaleModal> | null>(null)

const props = defineProps({ list: { type: Array as PropType<NodeGroups[]> } })
const cluster = inject<Ref<Cluster>>('cluster')
const base = computed(() => props.list?.filter((item) => item.eksVersion)[0])

const router = useRouter()
const handleViewLogs = (stackId: number) => {
  if (!stackId) return message.error('No stackId')
  router.push({ name: 'Logs', query: { stackId, type: 'scale' } })
}

const emit = defineEmits<{ (e: 'refresh', stackId: number): void }>()
const handleRefresh = (stackId: number) => emit('refresh', stackId)

const handleScale = () => {
  console.log('controller -->', cluster?.value.id)
  const { instanceNumber, minSize, maxSize, name } = base.value!

  scaleRef.value?.open({
    eksClusterId: cluster?.value.id,
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
          <a-button type="primary" class="yi-btn-default items-center gap-2 !flex" @click="handleScale">
            Scale <icon-svg-scale class="h-4 w-4" />
          </a-button>

          <a-button
            type="primary"
            class="yi-btn-default items-center gap-2 !flex"
            :disabled="!base?.stackId || base.status !== 'Ready'"
            @click="handleViewLogs(cluster?.stackId!)"
          >
            Logs <icon-svg-view-log class="h-4 w-4" />
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
