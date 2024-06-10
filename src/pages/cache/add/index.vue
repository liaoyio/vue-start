<script setup lang="ts">
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { getRegionZoneList } from '@/api'
import { CloudProvider } from '@/components/form'
import { uiRegion } from '@/utils/const'
import { BaseInfo, BusiGroup, Memory, Region, Zones } from './from'

import type { NewCacheBody, RegionZone } from '@/types/cache'

const formRef = ref()

const state = reactive<{
  clouds: { label: string; value: string }[]
  fullData: { [key: string]: any }
  initialData: RegionZone[]
}>({
  clouds: [],
  fullData: {},
  initialData: [],
})

const formState = reactive<Partial<NewCacheBody>>({
  name: '',
  des: '',
  cloudProvider: 'aws',
  maxMemoryMb: 1,
})

const createLoading = ref(false)
const spinning = ref(true)
const router = useRouter()

const regionsList = computed(() => {
  const res = Object.keys(state.fullData?.[formState.cloudProvider!] ?? [])
  return res.map((i) => uiRegion(i)) ?? []
})

const zoneList = computed(() => state.fullData?.[formState.cloudProvider!]?.[formState.region!] ?? [])

const groups: any[] = []

const onSubmit = () => {
  formRef.value.validate().then(() => {
    if (formState.disasterRecoveryZone) {
      createCache()
    } else {
      Modal.confirm({
        title: 'No Disaster Recovery Zone selected!',
        icon: h(ExclamationCircleOutlined),
        content: 'Single availability zone, business will not have high availability.',
        onOk: () => {
          createCache()
        },
      })
    }
  })
}
const createCache = async () => {
  const eksClusterId = state.initialData.find((it) => it.region === formState.region)?.id
  createLoading.value = true
  const hide = message.loading('cache', 4)
  const params = { ...toRaw(formState), eksClusterId } as any
  params.maxMemoryMb = params.maxMemoryMb * 1024
  try {
    const res = await addCacheService(params)
    if (res.id) {
      setTimeout(() => {
        hide()
        createLoading.value = false
        router.push({ name: 'Cache' })
      }, 1000)
    }
  } catch {
    hide()
    createLoading.value = false
  }
}

watch(
  () => formState.cloudProvider,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      formState.region = regionsList.value?.[0]?.dev_code ?? ''
      rest()
    }
  },
)

watch(
  () => formState.region,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      rest()
    }
  },
)
// @ts-ignore
const rest = () => {
  formState.primaryZone = ''
  formState.disasterRecoveryZone = ''
}

onMounted(async () => {
  spinning.value = true
  const { list } = await getRegionZoneList()
  spinning.value = false
  const result = forMatRegionZone(list)
  const clouds =
    Object.keys(result ?? []).map((value) => ({
      label: getcloudLabel(value),
      value,
    })) ?? []
  /** 根据 26 英文字母倒序排序 */
  state.clouds = clouds.sort((a, b) => b.label.localeCompare(a.label))
  state.fullData = result
  state.initialData = list
})

function getcloudLabel(str: string) {
  if (str.includes('aws')) {
    return 'AWS'
  }
  if (str.includes('aliyun')) {
    return 'Aliyun Cloud'
  } else {
    const tmp = str.toLowerCase()
    return tmp.charAt(0).toUpperCase() + tmp.slice(1)
  }
}

function forMatRegionZone(list: any) {
  return list.reduce((acc: any, it: any) => {
    if (!acc[it.cloudProvider]) {
      acc[it.cloudProvider] = {}
    }
    if (!acc[it.cloudProvider][it.region]) {
      acc[it.cloudProvider][it.region] = it.stackZones
    }
    return acc
  }, {})
}
</script>

<template>
  <main>
    <header class="mt-header py-6 bg-white dark:bg-[#111]">
      <h3 class="block">Create Cache Service</h3>
    </header>
    <section px="6" py="2">
      <ASpin :spinning="spinning" class="w-full flex items-center justify-center bg-white/70 !max-h-full">
        <a-form ref="formRef" layout="vertical" autocomplete="off" :model="formState" hide-required-mark class="">
          <a-form-item label="Cloud Provider" name="cloudProvider">
            <cloud-provider v-model="formState.cloudProvider" :clouds="state.clouds" />
          </a-form-item>

          <Region v-model="formState.region" :regions-list="regionsList" />

          <div>
            <div class="mb-3 font-medium">Zones</div>
            <Zones
              v-model:primary-zone="formState.primaryZone"
              v-model:disaster-recovery-zone="formState.disasterRecoveryZone"
              :zone-list="zoneList"
            />
          </div>
          <BaseInfo v-model:name="formState.name" v-model:des="formState.des" />

          <BusiGroup v-model="formState.busiGroupId" :groups="groups" />

          <Memory v-model:maxMemoryMb="formState.maxMemoryMb" />
        </a-form>

        <div class="pb-16 pt-6">
          <a-button
            size="large"
            :loading="createLoading"
            type="primary"
            class="yi-primary-disabled w-24"
            @click="onSubmit"
          >
            Submit
          </a-button>
        </div>
      </ASpin>
    </section>
  </main>
</template>

<style lang="scss"></style>
