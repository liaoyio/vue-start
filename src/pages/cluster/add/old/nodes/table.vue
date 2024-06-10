<script lang="tsx" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { Popover } from 'ant-design-vue'
import { useVModel } from '@vueuse/core'
import EditModal from './edit-modal.vue'
import type { NodeGroup } from '@/types/byoc'

const props = defineProps({
  modelValue: {
    type: Object as PropType<NodeGroup[]>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
const formData = useVModel(props, 'modelValue', emit)

const editRef = ref<InstanceType<typeof EditModal> | null>(null)
const editIndex = ref<number | undefined>()
const initLoading = ref(false)

const handleEdit = (row: NodeGroup, index: number) => {
  initLoading.value = true
  editIndex.value = index
  editRef.value?.modalInit(row)
  initLoading.value = false
}

const handleEditConfirm = (row: NodeGroup) => {
  formData.value[editIndex.value!] = row
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '6%',
  },
  {
    title: 'Zones',
    dataIndex: 'zoneList',
    width: '20%',
  },
  {
    title: 'Instance Number',
    dataIndex: 'instanceNumber',
    width: '10%',
  },
  {
    title: 'Actions',
    key: 'actions',
    width: '10%',
  },
]

const HeaderCell = ({ name }: { name: string }) => {
  const tips: Record<string, string> = {
    Zones:
      'Select the list of availability zones to be deployed. NodeGroup supports 1-3 availability zones. If you select multiple availability zones, you need to deploy nodes in each availability zone, which may increase costs.',
    'Instance Number': 'Set the desired number of nodes that the group should launch with initially.',
    'Instance Type': 'This is the model of the nodes. The default is r5n.axlarge.',
  }
  return (
    <div class="flex items-center gap-1">
      <span class="text-14px">{name}</span>
      {tips[name] && (
        <Popover content={<p class="max-w-[400px] text-[#4c576c]">{tips[name]}</p>} style={{ width: '200px' }}>
          <QuestionCircleOutlined />
        </Popover>
      )}
    </div>
  )
}
</script>

<template>
  <a-table
    :columns="columns"
    :row-key="(record) => record.key"
    :data-source="formData"
    :pagination="false"
    class="mt-6"
  >
    <template #headerCell="{ column }">
      <template v-if="column.dataIndex === 'name'">
        <HeaderCell name="Name" />
      </template>
      <template v-if="column.dataIndex === 'zoneList'">
        <HeaderCell name="Zones" />
      </template>
      <template v-if="column.dataIndex === 'instanceNumber'">
        <HeaderCell name="Instance Number" />
      </template>
    </template>

    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'zoneList'">
        <a-space :size="[0, 'small']" wrap>
          <a-tag v-for="(item, i) in record.zoneList" :key="i" style="border: none" :bordered="false" color="blue">{{
            item
          }}</a-tag>
        </a-space>
      </template>

      <template v-else-if="column.key === 'actions'">
        <div class="flex">
          <a-tooltip
            title="Modify"
            class="opacity-100 link"
            color="#202d40"
            :overlay-inner-style="{ fontSize: '12px', color: '#fafafa' }"
          >
            <a-button type="link" class="base" :loading="initLoading" @click="handleEdit(record as NodeGroup, index)">
              <icon-svg-pen class="h-4.5 w-4.5" />
            </a-button>
          </a-tooltip>
        </div>
      </template>
    </template>
  </a-table>
  <EditModal ref="editRef" @confirm="handleEditConfirm" />
</template>
