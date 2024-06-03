<script setup lang="ts">
import { usePagination, useRequest } from 'vue-request'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { type TableProps, message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { filterOptions } from '@/utils'
import AddModal from './add-modal.vue'

const add = ref<InstanceType<typeof AddModal>>()

type Params = {
  itemType?: string
  orgIdTarget?: number
  cloudProvider?: string
  region?: string
}

const state = reactive({
  visible: false,
  delLoading: false,
})

const params = reactive<Params>({})

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  hideOnSinglePage: true,
}))

const { data, run, refresh, loading, current, pageSize, total } = usePagination(getDynConfigList, {
  defaultParams: [{ pageNum: 1 }],
  pagination: {
    /** 当前页数 */
    currentKey: 'pageNum',
    /** 每页条数 */
    pageSizeKey: 'pageSize',
    /** 总条数 */
    totalKey: 'totalCount',
    /** 总页数 */
    totalPageKey: 'totalPage',
  },
})

const res = useRequest(getItemTypeoptionList)
const itemTypeOptions = computed(() => filterOptions(res.data.value?.list))
const reg = useRequest(getRegionZoneList)

const regionZoneOptions = computed(() => filterOptions(reg.data.value?.list, 'region'))

const cp = useRequest(getCloudProvider)
const cloudProviderOptions = computed(() => filterOptions(cp.data.value?.list))

const addModalProps = computed(() => ({
  cloudProviderOptions,
  itemTypeOptions,
  regionZoneOptions,
}))

provide('options', readonly(addModalProps))

const handleTableChange: TableProps['onChange'] = (pagination) => {
  const prams = {
    ...params,
    pageNum: pagination.current,
  }
  run({ ...prams })
}

const handleFilter = () => {
  const prams = { ...params, pageNum: current.value }
  console.log(prams)
  run({ ...prams })
}

const onDel = (id: number) => {
  state.delLoading = true
  deleteDynConfig(id)
    .then(() => {
      message.success('Delete successfully')
      handleFilter()
    })
    .catch(() => message.error('Delete failed'))
    .finally(() => (state.delLoading = false))
}

const columns = [
  {
    title: 'OrgId',
    dataIndex: 'orgId',
    key: 'orgId',
  },
  {
    title: 'Item Type',
    dataIndex: 'itemType',
    key: 'itemType',
  },
  {
    title: 'Cloud Provider',
    dataIndex: 'cloudProvider',
    key: 'cloudProvider',
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'region',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedDate',
    key: 'updatedDate',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
  },
]
</script>

<template>
  <main>
    <header class="mt-header my-4">
      <h3>Configuration Center</h3>
      <a-button type="primary" class="items-center !flex" @click="add?.open()">
        <template #icon>
          <PlusOutlined />
        </template>
        Add Item
      </a-button>
    </header>
    <section px="6" py="2">
      <div class="my-4 flex justify-between gap-6">
        <a-space :size="['middle', 'middle']">
          <a-input v-model:value="params.orgIdTarget" placeholder="Org id..." allow-clear />

          <a-select
            v-model:value="params.itemType"
            placeholder="Select Item Type"
            style="width: 198px"
            allow-clear
            :options="itemTypeOptions"
          />

          <a-select
            v-model:value="params.cloudProvider"
            placeholder="Select Cloud Provider"
            style="width: 198px"
            allow-clear
            :options="cloudProviderOptions"
          />

          <a-select
            v-model:value="params.region"
            placeholder="Select Region"
            style="width: 198px"
            allow-clear
            :options="regionZoneOptions"
          />

          <a-button :disabled="loading" type="primary" class="items-center !flex" @click="handleFilter">
            <template #icon>
              <SearchOutlined />
            </template>
            Search
          </a-button>
        </a-space>
      </div>

      <a-table
        :loading="loading"
        :data-source="data?.list"
        :row-key="(record) => record.id"
        :columns="columns"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'updatedDate'">
            {{ dayjs(text).format('YYYY-MM-DD HH:mm') }}
          </template>
          <template v-if="column.key === 'cloudProvider'">
            {{ text ?? '-' }}
          </template>
          <template v-if="column.key === 'region'"> {{ text ?? '-' }} </template>
          <template v-if="column.key === 'orgId'"> {{ text ?? '-' }} </template>

          <template v-else-if="column.key === 'action'">
            <div class="flex gap-2">
              <a-button type="text" class="action-btn" shape="circle" @click="add?.open(record)">
                <SvgIcon name="pen" size="16" />
              </a-button>

              <a-button
                type="text"
                :disabled="!!record?.id"
                class="action-btn"
                shape="circle"
                @click="onDel(record.id)"
              >
                <SvgIcon name="delete" size="16" />
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
    </section>
  </main>
  <AddModal ref="add" @ok="refresh" />
</template>
