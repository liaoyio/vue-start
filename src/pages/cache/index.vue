<script lang="ts" setup>
import { ExclamationCircleFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { type TableProps, message } from 'ant-design-vue'
import { usePagination, useRequest } from 'vue-request'
import dayjs from 'dayjs'
import { theme } from 'ant-design-vue'
import { Progress, StatusCache } from '@/components/ui'
import { getCacheList } from '@/api'
import bus from '@/utils/bus'
const { token } = theme.useToken()

onMounted(() => {
  bus.on('switchOrg', (orgId) => {
    console.log('触发订阅 -> switchOrg', orgId)
  })
})

type TFilter = {
  cloudProvider?: string
  keyword?: string
  region?: string
}

// const { data } = useRequest(getRegionZoneList)

const router = useRouter()

const filterState = reactive<TFilter>({
  keyword: '',
})

const {
  data: dataSource,
  run,
  current,
  pageSize,
  total,
} = usePagination(getCacheList, {
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
  pollingInterval: 30000,
})

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,
  hideOnSinglePage: true,
}))

const handleTableChange: TableProps['onChange'] = (pagination) => {
  const prams = {
    ...filterState,
    // status: filterState.status === '0' ? '' : filterState.status,
    pageNum: pagination.current,
  }
  run({ ...prams })
}

const handleFilter = () => {
  const prams = {
    ...filterState,
    // status: filterState.status === '0' ? '' : filterState.status,
    pageNum: current.value,
  }
  run({ ...prams })
}

/** 新建 MontCache 服务 */
const handleCreateCache = () => {
  router.push({ name: 'AddMontCache' })
}

/** 进入详情 */
const handleCacheItem = (item: any) => {
  if (item.status === 1) {
    router.push({ name: 'CacheDetail', params: { id: item.id } })
  } else if (item.status === -10) {
    // terminated
    message.warning('The cache service has been terminated')
  } else {
    message.warning('The cache service is being created, please wait a moment')
  }
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },

  {
    title: 'Shards',
    dataIndex: 'shards',
    key: 'shards',
  },
  {
    title: 'Usage',
    dataIndex: 'ramUsed',
    key: 'ramUsed',
  },
  {
    title: 'Creation Time',
    dataIndex: 'createdDate',
    key: 'createdDate',
  },
  {
    title: 'Actions',
    key: 'action',
  },
]
</script>

<template>
  <div class="flex justify-between px-8 py-6">
    <div class="text-xl font-medium text-gray-i">MontCache</div>
    <div class="flex gap-4">
      <a-button type="primary" class="items-center !flex" @click="handleCreateCache">
        <template #icon>
          <PlusOutlined />
        </template>
        New Database
      </a-button>
    </div>
  </div>

  <div class="p-8 pt-0">
    <div class="mb-6 mt-4 flex justify-between gap-6">
      <a-space :size="['middle', 'middle']">
        <a-input
          v-model:value="filterState.keyword"
          style="width: 224px"
          size="large"
          placeholder="Search Name..."
          allow-clear
          @press-enter="handleFilter"
        >
          <template #suffix>
            <SearchOutlined :style="{ color: token.colorIcon }" />
          </template>
        </a-input>
        <a-select
          v-model:value="filterState.cloudProvider"
          size="large"
          placeholder="Select Cloud Provider"
          style="width: 224px"
          allow-clear
          @change="handleFilter"
        >
          <a-select-option value="aws">AWS</a-select-option>
          <a-select-option value="aliyun">Aliyun</a-select-option>
          <template #suffixIcon>
            <SvgIcon name="select-suffix" />
          </template>
        </a-select>

        <a-select
          v-model:value="filterState.region"
          size="large"
          placeholder="Select Region"
          style="width: 224px"
          allow-clear
          :options="[]"
          :field-names="{ label: 'region', value: 'region' }"
          @change="handleFilter"
        >
          <template #suffixIcon>
            <SvgIcon name="select-suffix" />
          </template>
        </a-select>
      </a-space>
    </div>
    <a-table
      :data-source="dataSource?.list"
      :row-key="(record: any) => record.id"
      :columns="columns"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'name'">
          <a class="ac-link" @click="handleCacheItem(record)">{{ text }}</a>
        </template>
        <template v-else-if="column.key === 'status'">
          <span>
            <!-- created(0), running(1), not_ready(-1), terminated(-10) -->
            <span v-if="record.status === -1" class="flex_c gap-1.5">
              <ExclamationCircleFilled style="color: #f16538" />
              Not Ready
            </span>
            <StatusCache v-else :status="record.status" :phase="record.phase" />
          </span>
        </template>

        <template v-else-if="column.key === 'region'">
          <a-tag style="border: none" :bordered="false" color="blue">{{ text }}</a-tag>
        </template>

        <template v-else-if="column.key === 'ramUsed'">
          <Progress :percent="text" :use-rate="true" />
        </template>

        <template v-else-if="column.key === 'createdDate'">
          {{ dayjs(text).format('YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="flex gap-2">-</div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style lang="scss">
.status-row {
  @apply flex items-center;

  span {
    @apply mr-2 block h-2 w-2 rounded-full;
  }
}
</style>
