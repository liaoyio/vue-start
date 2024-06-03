<script lang="ts" setup>
import { useRequest } from 'vue-request'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { Progress, StatusCache } from '@/components/ui'
import { delCluster, getClusterList } from '@/api/byoc'
import { DeleteModal } from '@/components/modal'
import type { Cluster } from '@/types/byoc'

const delRef = ref<InstanceType<typeof DeleteModal> | null>(null)
const currentId = ref()
const router = useRouter()

const { data, refresh, loading } = useRequest(getClusterList, { pollingInterval: 5000 })

const dataSource = computed(() => {
  const list: Cluster[] = []
  data.value?.list.forEach((it) => {
    // 删除成功
    const isDeleted = it.stackType === -1 && it.stackStatus === 10
    // 删除的集群是否在15分钟前 (15内显示已经删除的集群)
    const isisBefore = dayjs(it.updatedDate).isBefore(dayjs().subtract(15, 'minute'))
    if (isDeleted) {
      if (isisBefore) return
      else list.push(it)
    } else {
      list.push(it)
    }
  })
  return list
})

const handleDetail = (record: Cluster) => {
  if (!String(record.stackStatus)) return message.warning('Cluster initializing')
  if (record.stackType === -1 && record.stackStatus === 10) return message.error('Unable to access deleted cluster')
  /* if(record.stackType === 0 && record.stackStatus === 10) */
  router.push({ name: 'ClusterDetail', params: { clusterId: 12 } })
}

const onViewLogs = (record: Cluster) => {
  if (!record.stackId) return
  if (record.stackType === -1) {
    router.push({
      name: 'Logs',
      query: { stackId: record.stackId, type: 'delete' },
    })
  } else if (record.stackType === 0) {
    router.push({ name: 'Logs', query: { stackId: record.stackId } })
  } else if (record.stackType === 10) {
    router.push({
      name: 'Logs',
      query: { stackId: record.stackId, type: 'scale' },
    })
  }
}

const onDelete = async () => {
  try {
    await delCluster({ stackId: currentId.value })
    refresh()
  } catch {
    message.error('Delete failed')
  }
  delRef.value?.setModal(false)
}

const handleDelPopConfirm = (record: Cluster) => {
  currentId.value = record.stackId
  delRef.value?.setModal(true)
}

const columns = [
  {
    title: 'Cluster Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
  },
  {
    title: 'Status',
    dataIndex: 'stackStatus',
    key: 'stackStatus',
  },
  {
    title: 'Version',
    dataIndex: 'clusterVersion',
    key: 'clusterVersion',
  },
  {
    title: 'Provider',
    dataIndex: 'cloudProvider',
    key: 'cloudProvider',
  },
  {
    title: 'Support Type',
    dataIndex: 'supportUntilDate',
    key: 'supportUntilDate',
  },
  {
    title: 'Cache Number',
    dataIndex: 'byocCacheNumber',
    key: 'byocCacheNumber',
  },
  {
    title: 'MemUsage',
    dataIndex: 'ramUsed',
    key: 'ramUsed',
  },
  {
    title: 'Actions',
    key: 'action',
  },
]
</script>

<template>
  <main class="">
    <header class="mt-header my-4">
      <h3>Montplex Kubernetes Clusters</h3>
      <a-button type="primary" @click="router.push({ name: 'InitRuntime' })"> Init Runtime</a-button>
    </header>
    <section px="6" py="2">
      <a-table
        :loading="loading"
        :data-source="dataSource"
        :row-key="(record) => record.id"
        :pagination="false"
        :columns="columns"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'name'">
            <a
              class="ac-link"
              :class="{ disabled: record.stackStatus === 0 || record.stackStatus === -1 }"
              @click="handleDetail(record as any)"
              >{{ text }}</a
            >
          </template>

          <template v-else-if="column.key === 'supportUntilDate'">
            <span>
              {{ dayjs(text).format('YYYY-MM-DD') }}
            </span>
          </template>

          <template v-else-if="column.key === 'stackStatus'">
            <StatusCache :stack-type="record.stackType" :stack-status="record.stackStatus" />
          </template>

          <template v-else-if="column.key === 'ramUsed'">
            <Progress :percent="text" :use-rate="true" />
          </template>

          <template v-else-if="column.key === 'action'">
            <div class="flex gap-2">
              <a-tooltip v-if="false" title="Modify">
                <a-button type="text" class="action-btn" shape="circle" disabled>
                  <SvgIcon name="pen" size="16" />
                </a-button>
              </a-tooltip>

              <a-tooltip title="View deployment logs">
                <a-button type="text" class="action-btn" shape="circle" @click="onViewLogs(record as any)">
                  <SvgIcon name="view-log" size="16" />
                </a-button>
              </a-tooltip>

              <a-tooltip title="Delete">
                <a-button
                  type="text"
                  class="action-btn"
                  shape="circle"
                  :disabled="record.stackType === -1 && [0, 1, 10].includes(record.stackStatus)"
                  @click="handleDelPopConfirm(record as any)"
                >
                  <SvgIcon name="delete" size="16" />
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </a-table>
    </section>
  </main>
  <DeleteModal ref="delRef" type="del-cluster" @on-del="onDelete" />
</template>
