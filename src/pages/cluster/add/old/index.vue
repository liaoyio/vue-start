<script setup lang="ts">
import { CloseOutlined } from '@/components/icon'
import { EmptyCredential } from '@/components/empty'
import FromConfigureCluster from './configure-cluster.vue'
import FromGroupNodes from './nodes/index.vue'
import type { Credential, EksVersion } from '@/api'
import type { Config, NodeGroup, Region, VPC } from '@/types/byoc'

const credentials = ref<Credential[]>([])

export type NewK8s = {
  step: number
  credentialId?: number
  eksClusterId?: number
  config: Partial<Config>
  nodes: {
    zones: string[]
    nodeGroupList: NodeGroup[]
  }
  regions: Region[]
  vpcList: VPC[]
  zones: string[]
  currentRegion?: string
  versionList: EksVersion[]
}

const state = reactive<NewK8s>({
  step: -1,
  config: {
    clusterVersion: '',
    subnetPrivateType: 10,
    name: '',
  },
  nodes: {
    zones: [],
    nodeGroupList: [],
  },
  regions: [],
  vpcList: [],
  zones: [],
  currentRegion: '',
  versionList: [],
})

provide('$base', readonly(state))

const loading = ref(false)
const spinning = ref(false)

const prev = () => (state.step -= 1)

onMounted(async () => {
  const { list } = await getCredentialList()
  if (list.length > 0) {
    credentials.value = list
    state.step = 0
  }
})

const onFirstStepFinish = async () => {
  const { eksClusterId } = await checkCredentialhasInit(state.credentialId!)
  if (eksClusterId) {
    await firstStepInitDate(eksClusterId)
  }
}

const firstStepInitDate = async (eksClusterId: number) => {
  state.step += 1
  spinning.value = true
  const { list: regions } = await initRegions({ eksClusterId })

  const { list } = await getEksVersionList()
  state.versionList = list ?? []
  state.config.clusterVersion = (state.versionList as any).at(-1).version ?? ''

  state.eksClusterId = eksClusterId
  state.config.eksClusterId = eksClusterId
  state.regions = regions
  spinning.value = false
}

const secondStepInitDate = async () => {
  const { eksClusterId, region } = state.config
  const res = await getZones({ eksClusterId, region })
  state.zones = res.list.map((it) => it.name) ?? []
  state.nodes.zones = state.zones.slice(0, 2)
  state.currentRegion = region
}

const secondStep = async (eksClusterId: number) => {
  state.config.eksClusterId = eksClusterId
  state.step += 1
  loading.value = true
  try {
    await secondStepInitDate()
  } finally {
    loading.value = false
  }
}

watch(
  () => state.config?.region,
  async ($new, $old) => {
    if ($new !== $old) {
      console.log(state.config?.region)
      await regionChangeInitVpcList()
    }
  },
)

async function regionChangeInitVpcList() {
  delete state.config.vpcIndex
  const { eksClusterId, region } = state.config
  console.log(state.config)
  const { list } = await initVpcList({ eksClusterId, region })
  state.vpcList = list
}

watch(
  () => state.nodes.zones,
  () => {
    zonesChangeInitNodeGroupList()
  },
  { immediate: true },
)

function zonesChangeInitNodeGroupList() {
  const data: NodeGroup[] = []
  const zones = state.nodes.zones
  const length = zones.length + 1
  for (let i = 0; i < length; i++) {
    data.push({
      name: i === 0 ? 'controller' : `worker${i}`,
      zoneList: i === 0 ? getControllerZones(zones, state.zones) : state.nodes.zones.slice(i - 1, i),
      instanceNumber: i === 0 ? 1 : 1,
    })
  }
  state.nodes.nodeGroupList = data
}

const router = useRouter()

const handleBack = () => {
  router.replace({ name: 'K8s' })
}

const STEPS = [
  {
    title: 'Verify identity',
  },
  {
    title: 'Configure cluster',
    content: 'Create a new node group',
  },
  {
    title: 'Deploy Worker Node Groups',
    content: 'Create a new node pool',
  },
]

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
</script>

<template>
  <div class="h-full w-full bg-white">
    <div class="h-screen w-full flex flex-col gap-10">
      <header class="flex items-center justify-between gap-4 px-8 py-6">
        <div class="flex_cc text-lg font-medium text-gray-i">
          <div @click="handleBack">
            <icon-svg-back class="icon-back" />
          </div>
          Create EKS cluster
        </div>
        <span class="base yi-action-btn transition-is" @click="handleBack">
          <CloseOutlined class="close" />
        </span>
      </header>
      <div class="flex-1 px-6 md:pb-16 md:pl-14 md:pr-12">
        <div class="mx-auto">
          <!-- <div class="w-1/2"> -->
          <ASteps :current="state.step" :items="STEPS" />
          <!-- </div> -->
          <div class="mt-4 min-h-xs border-1.5 border-[#e9e9e9] rounded-md border-dashed px-6 py-8 md:mt-12">
            <template v-if="credentials.length">
              <template v-if="state.step === 0">
                <a-form auto-complete="off" class="pt-6" :model="state" layout="vertical" @finish="onFirstStepFinish">
                  <a-form-item
                    label="Security Credentials"
                    name="credentialId"
                    :rules="[
                      {
                        required: true,
                        message: 'Please select ak or credential!',
                      },
                    ]"
                  >
                    <a-select
                      v-model:value="state.credentialId"
                      :options="credentials"
                      placeholder="Please select ak or credential"
                      style="width: 420px"
                      :field-names="{ label: 'name', value: 'id' }"
                    />
                  </a-form-item>

                  <a-form-item>
                    <a-space class="mt-6" size="large">
                      <a-button type="primary" html-type="submit" :loading="loading">Next</a-button>
                    </a-space>
                  </a-form-item>
                </a-form>
              </template>

              <a-spin v-if="state.step === 1" :spinning="spinning" :delay="200">
                <FromConfigureCluster v-model:modelValue="state.config" @next="secondStep" @prev="prev" />
              </a-spin>
              <a-spin v-if="state.step === 2" :spinning="loading" :delay="200">
                <FromGroupNodes v-if="state.step === 2" v-model:modelValue="state.nodes" @prev="prev" />
              </a-spin>
            </template>

            <EmptyCredential v-else />
          </div>
          <div />
        </div>
      </div>
    </div>
  </div>
</template>
