<script setup lang="ts">
import { useRequest } from 'vue-request'
import { formatDate } from '@/utils'
import { Progress, StatusCache } from '@/components/ui'
import OperatingButton from './components/operating-button.vue'
import ScaleButton from './components/scale-button.vue'

const { data, loading, refresh } = useRequest(cacheOne)

const columns = [
  { title: 'Name', dataIndex: 'shardIndex', key: 'shardIndex' },
  { title: 'Zone', dataIndex: 'zone', key: 'zone' },
  { title: 'Phase', dataIndex: 'phase', key: 'phase' },
  { title: 'MemUsage', dataIndex: 'ramUsed', key: 'ramUsed', width: '16%' },
]
provide('mtCache', readonly(data))
</script>

<template>
  <main>
    <header class="mt-header my-2">
      <h3 class="block">Overview</h3>
      <OperatingButton :info="data" />
    </header>
    <section px="6" py="2" class="flex flex-col gap-y-8">
      <a-card :loading="loading">
        <div class="flex_lr">
          <div>
            <h3>Cache Information</h3>
            <!-- <p class="tips mt-2">Used to identify your organization on MontCache</p> -->
          </div>
        </div>
        <!-- Name	Cluster Name Busi Group -->
        <div class="flex flex-col gap-4 mt-8">
          <ul class="bento-card">
            <li>
              <div>Name</div>
              <div>{{ data?.one.name }}</div>
            </li>
            <li>
              <div>Resource</div>
              <div>Cluster-yi</div>
            </li>
            <li>
              <div>Organization Name</div>
              <div>
                <div>Yoail'Org</div>
              </div>
            </li>
            <li>
              <div>Creation Time</div>
              <div>{{ formatDate(data?.one.createdDate) }}</div>
            </li>
          </ul>
          <ul class="bento-card">
            <li>
              <div>CloudProvider</div>
              <div>{{ data?.one.cloudProvider }}</div>
            </li>
            <li>
              <div>Region</div>
              <div>{{ data?.one.region }}</div>
            </li>

            <li>
              <div>Version</div>
              <div>{{ data?.one.version }}</div>
            </li>
          </ul>
        </div>
      </a-card>

      <div>
        <div class="flex_lr mb-6 mt-4">
          <h3>Shards</h3>
          <ScaleButton @refresh="refresh" />
        </div>
        <a-table
          :loading="loading"
          :columns="columns"
          :pagination="false"
          :row-key="(record) => record.id"
          :data-source="data?.shardInfoList"
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.key === 'shardIndex'">
              <span> Shard-{{ text }} </span>
            </template>
            <template v-if="column.key === 'zone'">
              <a-space :size="[0, 'small']" wrap>
                <a-tag style="border: none" :bordered="false" color="blue">{{ text }}</a-tag>
              </a-space>
            </template>

            <template v-if="column.key === 'phase'">
              <span>
                <StatusCache v-if="text === 'Running'" :status="1" :phase="text" />
                <StatusCache v-else-if="record.status === -1 && text" :status="-1" :phase="text" />
                <span v-else> - </span>
              </span>
            </template>

            <template v-else-if="column.key === 'ramUsed'">
              <div class="pr-4">
                <Progress :percent="text" :use-rate="true" />
              </div>
            </template>
          </template>
        </a-table>
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

<style lang="scss" scoped>
::v-deep(.ant-table-wrapper .ant-table-tbody > tr > td) {
  padding: 12px 16px !important;
}
</style>
