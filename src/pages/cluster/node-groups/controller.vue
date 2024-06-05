<script setup lang="ts">
import { message } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { Progress, StatusCluster } from '@/components/ui'
import { LoadingLoop } from '@/components/icon'
import { ScaleModal } from './components/index'

const route = useRoute()

const scaleRef = ref<InstanceType<typeof ScaleModal> | null>(null)

const eksClusterId = route.params.clusterId

const { data: cluster, loading: clusterLoading } = useRequest(getClusterById, {
  defaultParams: [Number(eksClusterId)],
})

const { data: nodes, loading } = useRequest(getEksNodeGroupResourceList, {
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
    <div class="flex flex-col gap-4">
      <a-card :loading="clusterLoading">
        <div class="flex_lr">
          <div>
            <h3>Controller Node Info</h3>
            <p class="text-info-4 mt-1">Controller nodes are used to deploy control components.</p>
          </div>
        </div>

        <div class="flex flex-col gap-4 mt-8">
          <ul class="bento-card">
            <li>
              <div>InstanceType</div>
              <div>{{ base?.instanceType ?? '-' }}</div>
            </li>
            <li>
              <div>Version</div>
              <div>{{ base?.eksVersion }}</div>
            </li>
            <li>
              <div>Status</div>
              <div>
                <template v-if="base?.status">
                  <StatusCluster v-if="base.status === 'Ready'" :status="1" :phase="base.status" />
                  <span v-else-if="base.status === 'Scaling'" class="flex_c1.5"> <LoadingLoop /> Scaling </span>
                  <span v-else-if="base.status === 'Creating'" class="flex_c1.5"> <LoadingLoop /> Creating </span>
                  <span v-else> - </span>
                </template>
              </div>
            </li>
          </ul>
        </div>
      </a-card>

      <div class="my-2 flex flex-row-reverse">
        <div class="flex gap-4">
          <a-button type="primary" class="flex_c2" @click="handleScale">
            <template #icon>
              <SvgIcon name="scale" size="16" />
            </template>
            Scale
          </a-button>

          <a-button
            type="primary"
            class="flex_c2"
            :disabled="!base?.stackId || base.status !== 'Ready'"
            @click="handleViewLogs(cluster?.stackId!)"
          >
            <SvgIcon name="view-log" size="16" />
            Logs
          </a-button>
        </div>
      </div>

      <a-table :loading="loading" :columns="controllerColumns" :data-source="list" :pagination="false" class="yi-table">
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

.bento-card li {
  div:nth-child(2) {
    font-size: 14px;
    margin-top: 8px;
    font-weight: 500;
    color: var(--tips-text-color);
  }
}
</style>
