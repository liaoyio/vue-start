<script setup lang="ts">
import { h } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { message } from 'ant-design-vue'
import cache from 'mock/cache'
import { c } from 'vite/dist/node/types.d-aGj9QkWt'
import { SuffixIcon } from '@/components/icon'
import { FormItemContainer } from '@/components/ui'
import { NODES_COLUMNS } from '@/utils/const'
import type { ClusterBasic, NodeGroup } from '@/types/byoc'

type FormState = { zones: string[]; nodeGroupList: NodeGroup[] }

defineProps({ eksClusterId: Number })

const loading = ref(false)
const submitLoading = ref(false)
const zoneList = ref<string[]>([])

const query = useRouteQuery('eksClusterId', Number, { transform: Number })
const basic: Partial<ClusterBasic> = {}
const local = useStorage('mt-resources-basic-form-sate', basic)

const formState = reactive<FormState>({
  zones: [],
  nodeGroupList: [],
})

const secondStepInitDate = async () => {
  loading.value = true
  try {
    const res = await getZones({ eksClusterId: query.value, region: local.value.region })
    zoneList.value = res.list.map((it) => it.name)
    formState.zones = zoneList.value.slice(0, 2)
  } catch {
    message.error('Failed to get the zone list')
  } finally {
    loading.value = false
  }
}

secondStepInitDate()

const emit = defineEmits(['finish'])

watch(
  () => formState.zones,
  () => {
    zonesChangeInitNodeGroupList()
  },
  { immediate: true },
)

function zonesChangeInitNodeGroupList() {
  const data: NodeGroup[] = []
  const zones = formState.zones
  const length = zones.length + 1
  for (let i = 0; i < length; i++) {
    data.push({
      name: i === 0 ? 'controller' : `worker${i}`,
      zoneList: i === 0 ? getControllerZones(zones, formState.zones) : formState.zones.slice(i - 1, i),
      instanceNumber: i === 0 ? 1 : formState.nodeGroupList[i]?.instanceNumber ?? 1,
    })
  }
  formState.nodeGroupList = data
}

/**
 * 获取 controller 可用的 zones 列表
 * @param currentZoneList 已选的 zones 列表
 * @param zoneList 当前 Region 可选的 zones 列表
 */
function getControllerZones(currentZoneList: string[], zoneList: string[]) {
  if (!zoneList.length) {
    return []
  }
  if (!currentZoneList.length) {
    return zoneList.slice(0, 3)
  }
  const complementaryList = zoneList.filter((zone) => !currentZoneList.includes(zone))
  if (!complementaryList.length && currentZoneList.length >= 3) {
    return zoneList.slice(0, 3)
  } else if (complementaryList.length && currentZoneList.length === 1) {
    return [...complementaryList.slice(0, 2), ...currentZoneList].sort((a, b) => a.localeCompare(b))
  } else if (complementaryList.length && currentZoneList.length === 2) {
    return [complementaryList[0], ...currentZoneList].sort((a, b) => a.localeCompare(b))
  } else {
    return zoneList.slice(0, 3)
  }
}

const router = useRouter()

const onFinish = async () => {
  const clusterVpc = {
    ...toRaw(local.value),
  }

  submitLoading.value = true
  message.loading({ content: 'Submitting cluster basic information...', key: 'deploy', duration: 1.5 })

  try {
    const { eksClusterId } = await setClusterVpc(clusterVpc as any)
    query.value = eksClusterId ?? query.value

    message.loading({ content: 'Submitting cluster node group settings...', key: 'deploy', duration: 1.5 })

    const { stackId } = await setClusterNodeGroup({
      eksClusterId: query.value,
      nodeGroupList: toRaw(formState).nodeGroupList,
    })

    message.loading({ content: 'Submitting deployment request', key: 'deploy', duration: 1.5 })

    await clusterDeploy({ stackId })

    message.success({ content: 'Submitted successfully', key: 'deploy', duration: 0.6 })

    emit('finish', { stackId })

    router.replace({ name: 'Logs', query: { stackId } })
  } finally {
    submitLoading.value = false
  }
}

const options = computed(() => {
  return zoneList.value.map((it) => ({ label: it, value: it }))
})
</script>

<template>
  <a-card :body-style="{ padding: 0, backgroundColor: 'transparent' }" :loading="loading">
    <a-form :model="formState" layout="vertical" size="middle" @finish="onFinish">
      <FormItemContainer
        class="!p-12"
        title="Choose zones for new resources"
        sub-title="Configure node group through your selected zones."
      >
        <a-form-item name="zones" :rules="[{ required: true, message: 'Please select zones', trigger: 'change' }]">
          <template #help>
            <p class="text-[13px] my-2">
              Select the list of available zones that need to be deployed, and by default, 3 available zones will be
              created.
            </p>
          </template>
          <a-select
            v-model:value="formState.zones"
            :options="options"
            size="large"
            :suffix-icon="h(SuffixIcon)"
            mode="multiple"
          >
            <template #tagRender="{ label, closable, onClose }">
              <a-tag color="blue" :closable="closable" @close="onClose"> &nbsp;{{ label }}&nbsp; </a-tag>
            </template>
          </a-select>
        </a-form-item>
      </FormItemContainer>

      <a-divider class="my-0" />

      <FormItemContainer
        class="!px-12 !pt-8"
        title="Node Groups"
        sub-title="Determine the settings for the node group."
      >
        <a-table
          :data-source="formState.nodeGroupList"
          :columns="NODES_COLUMNS"
          row-key="id"
          :pagination="false"
          bordered
          size="large"
        >
          <template #bodyCell="{ column, record, text, index }">
            <template v-if="column.dataIndex === 'name'">
              {{ text }}
            </template>

            <template v-if="column.dataIndex === 'zoneList'">
              <a-tag v-for="(zone, index) in text" :key="index" color="blue" class="mr-2">{{ zone }}</a-tag>
            </template>
            <template v-if="column.dataIndex === 'instanceNumber'">
              <div v-if="index === 0" class="w-1/2 px-[11px] h-7.5 line-height-7.5">{{ text }}</div>

              <a-input-number v-else v-model:value="record.instanceNumber" class="w-1/2" :min="1" :max="100" />
            </template>
          </template>
          <template #footer>
            <div class="flex flex-col gap-2 py-4">
              <p class="text-info-4">
                <a-tag class="font-medium">controller</a-tag>: To achieve high availability at the availability zone
                level, you need to select three or more availability zones. It has some control components.
              </p>

              <p class="text-info-4"><a-tag class="font-medium">work(*)</a-tag>: Work nodes are used for caches.</p>
            </div>
          </template>
        </a-table>
      </FormItemContainer>

      <div class="px-12 pb-8">
        <a-form-item>
          <a-button :loading="submitLoading" type="primary" class="!h-8 !py-0 w-30 mt-4" html-type="submit"
            >Submit</a-button
          >
        </a-form-item>
      </div>
    </a-form>
  </a-card>
</template>

<style lang="scss" scoped>
::v-deep(.ant-table-footer) {
  background-color: transparent;
}
</style>
