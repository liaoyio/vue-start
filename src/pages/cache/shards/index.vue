<script setup lang="ts">
import { useRequest } from 'vue-request'
import { Progress, StatusCache } from '@/components/ui'
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
    <header class="mt-header my-4">
      <h3>Shards</h3>
      <ScaleButton @refresh="refresh" />
    </header>
    <section px="6" py="2">
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
    </section>
  </main>
</template>

<style lang="scss" scoped>
::v-deep(.ant-table-wrapper .ant-table-tbody > tr > td) {
  padding: 12px 16px !important;
}
</style>
