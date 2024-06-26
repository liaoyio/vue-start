<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { message, notification } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { Progress, StatusCluster } from '@/components/ui'
import { DeleteModal } from '@/components/modal'
import { LoadingLoop } from '@/components/icon'
import { AddNodeGroupModal, ScaleModal, ViewLogButton } from './components'

const route = useRoute()
const router = useRouter()

const addRef = ref<InstanceType<typeof AddNodeGroupModal> | null>(null)
const scaleRef = ref<InstanceType<typeof ScaleModal> | null>(null)
const delRef = ref<InstanceType<typeof DeleteModal> | null>(null)

const eksClusterId = route.params.clusterId
const currentNodeGroupName = ref('')
const loading = ref(false)

const { data: cluster } = useRequest(getClusterById, {
  defaultParams: [Number(eksClusterId)],
})

const { data: nodes, loading: nodeLoading } = useRequest(getEksNodeGroupResourceList, {
  defaultParams: [{ eksClusterId: Number(eksClusterId), isProxy: true }],
})

const works = computed(() => nodes.value?.list ?? [])
const emit = defineEmits<{ (e: 'refresh', stackId: number): void }>()
const handleRefresh = (stackId: number) => emit('refresh', stackId)

const handleViewLogs = (stackId: number) => {
  if (!stackId) return message.error('No stackId')
  router.push({ name: 'Logs', query: { stackId, type: 'scale' } })
}

const handleCrate = async () => {
  const params = {
    eksClusterId: cluster?.value?.id,
    region: cluster?.value?.region,
    type: 'work',
  }
  await addRef.value?.modalInit(params)
}

const handleConfirm = async (state: any) => {
  try {
    const { stackId } = await scaleUpNodeGroup({
      ...state,
      eksClusterId: cluster?.value?.id,
    })
    if (stackId) {
      notification.success({
        message: 'Success',
        description: 'Node group is being created.',
        btn: () =>
          h(ViewLogButton, {
            onOk: () => {
              handleViewLogs(stackId)
              notification.close('scale')
            },
          }),
        key: 'scale',
      })
      handleRefresh(stackId)
    }
  } catch {
    message.error('Failed to create the worker node')
  }
}

const handleDelete = (row: any) => {
  currentNodeGroupName.value = row.name
  delRef.value?.setModal(true)
}

const onHandelDel = async () => {
  if (!currentNodeGroupName.value) return

  try {
    const { stackId } = await deleteNodeGroup({
      eksClusterId: cluster?.value?.id,
      nodeGroupName: currentNodeGroupName.value,
    })
    if (stackId) {
      notification.success({
        message: 'Success',
        description: 'Node group is being deleted.',
        btn: () =>
          h(ViewLogButton, {
            onOk: () => {
              handleViewLogs(stackId)
              notification.close('delete')
            },
          }),
        key: 'delete',
      })
      handleRefresh(stackId)
    }
  } catch {
    message.error('Failed to delete the worker node')
  }

  delRef.value?.setModal(false)
}

const handleScale = (record: any) => {
  const { instanceNumber, name } = record
  scaleRef.value?.open({
    eksClusterId: cluster?.value?.id,
    nodeGroupName: name,
    instanceNumber,
  })
}

const workNodeColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Zone', dataIndex: 'zone', key: 'zone' },
  { title: 'Version', dataIndex: 'eksVersion', key: 'eksVersion' },
  {
    title: 'InstanceType',
    dataIndex: 'instanceType',
    key: 'instanceType',
  },
  {
    title: 'Instance Number',
    dataIndex: 'instanceNumber',
    key: 'instanceNumber',
  },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Spot Percent',
    dataIndex: 'spotPercentIn100',
    key: 'spotPercentIn100',
    width: '12%',
  },
  {
    title: 'Resource Request Rate',
    dataIndex: 'ramUsed',
    key: 'ramUsed',
    width: '15%',
  },
  { title: 'Action', dataIndex: 'action', key: 'action' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <a-card class="mb-2">
      <h3>Work Node Info</h3>
      <p class="text-sm text-info-4 m-1">Work node is the node for deploying montCache.</p>
    </a-card>

    <div class="flex flex-row-reverse">
      <div class="flex gap-4">
        <a-button type="primary" :loading="loading" class="flex_c" @click="handleCrate">
          <template #icon>
            <PlusOutlined />
          </template>
          Create
        </a-button>
      </div>
    </div>

    <a-table
      :columns="workNodeColumns"
      :data-source="works"
      :pagination="false"
      :row-key="(record) => record.id"
      :loading="nodeLoading"
      class="yi-table mt-3"
    >
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'zone'">
          <a-space :size="[0, 'small']" wrap>
            <a-tag style="border: none" :bordered="false" color="blue">{{ text }}</a-tag>
          </a-space>
        </template>

        <template v-if="column.key === 'eksVersion'">
          {{ text ?? '-' }}
        </template>

        <template v-if="column.key === 'instanceType'">
          <span v-if="text">{{ text }}</span>

          <a-space v-else-if="record.instanceTypeList" :size="[0, 'small']" wrap>
            <a-tag v-for="it in record.instanceTypeList" :key="it" style="border: none" color="blue">{{ it }}</a-tag>
          </a-space>

          <span v-else>-</span>
        </template>

        <template v-if="column.key === 'instanceNum'">
          {{ text ?? 0 }}
        </template>

        <!-- Creating/Scaling/Ready -->

        <template v-if="column.key === 'status'">
          <StatusCluster v-if="text === 'Ready'" :status="1" :phase="text" />
          <span v-else-if="text === 'Scaling'" class="flex_c1.5"> <LoadingLoop /> Scaling </span>
          <span v-else-if="text === 'Creating'" class="flex_c1.5"> <LoadingLoop /> Creating </span>
          <span v-else> - </span>
        </template>

        <template v-else-if="column.key === 'spotPercentIn100'">
          <Progress :percent="record.spotPercentIn100" />
        </template>

        <template v-else-if="column.key === 'ramUsed'">
          <ul class="flex flex-col gap-1 text-[12px]">
            <li class="flex_c gap-1">
              <span class="min-w-16">Memory: </span>
              <Progress :percent="record.memoryRequestedRate" :use-rate="true" />
            </li>
            <li class="flex_c gap-1">
              <span class="min-w-16">CPU: </span>
              <Progress :percent="record.cpuRequestedRate" :use-rate="true" />
            </li>
            <li class="flex_c gap-1">
              <span class="min-w-16">Pod:</span>
              <Progress :percent="record.podsRequestedRate" :use-rate="true" />
            </li>
          </ul>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="flex gap-2">
            <a-tooltip title="Scale">
              <a-button type="text" class="action-btn" shape="circle" @click="handleScale(record)">
                <template #icon>
                  <SvgIcon name="scale" size="16" />
                </template>
              </a-button>
            </a-tooltip>

            <a-tooltip title="View deployment logs">
              <a-button
                type="text"
                class="action-btn"
                shape="circle"
                :disabled="record.stackId <= 0"
                @click="handleViewLogs(record.stackId ?? cluster?.stackId!)"
              >
                <SvgIcon name="view-log" size="16" />
              </a-button>
            </a-tooltip>

            <a-tooltip title="Delete">
              <a-button type="text" class="action-btn" shape="circle" @click="handleDelete(record)">
                <SvgIcon name="delete" size="16" />
              </a-button>
            </a-tooltip>
          </div>
        </template>
      </template>
    </a-table>
  </div>
  <AddNodeGroupModal ref="addRef" @confirm="handleConfirm" />
  <DeleteModal ref="delRef" title="Are you sure to delete the worker node?" @on-del="onHandelDel">
    <template #content>
      <p>
        Deleting the current worker node will also delete its zone. When the cluster has less than three availability
        zones, availability zone level high availability cannot be achieved.
      </p>
    </template>
  </DeleteModal>
  <ScaleModal ref="scaleRef" @ok="handleRefresh" />
</template>
