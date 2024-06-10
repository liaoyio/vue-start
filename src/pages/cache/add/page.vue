<script lang="ts" setup>
import { h } from 'vue'
import { useRequest } from 'vue-request'
import { Modal, message } from 'ant-design-vue'
import { getRegionZoneList } from '@/api'
import { SuffixIcon, WarnCircle } from '@/components/icon'
import { CLOUDS_MAP, formatRegion } from '@/utils/const'
import { BackHeader, FormItemContainer } from '@/components/ui'
import { CACHE_RULES } from '@/utils/validate'
import type { FormInstance, SelectProps } from 'ant-design-vue'

const router = useRouter()
const formRef = ref<FormInstance>()
const createLoading = ref(false)

const formState = reactive({
  cloudProvider: 'aws',
  region: 'ap-southeast-1',
  disasterRecoveryZone: '',
  primaryZone: '',
  name: '',
  maxMemoryMb: 1,
  /** 0 -> standalone, 1 -> cluster */
  clusterMode: 1,
})

const { data } = useRequest(getRegionZoneList)

const clouds = computed(() => {
  const res = data.value?.list?.map((i) => i.cloudProvider)
  return [...new Set(res)]
})

const regions = computed(() => {
  const result = data.value?.list?.filter((i) => i.cloudProvider === formState.cloudProvider)
  const res = result?.map((i) => i.region)
  const options = [...new Set(res)].map((i) => formatRegion(i))
  return (options as SelectProps['options']) ?? []
})

const prZones = computed(() => {
  const result = data.value?.list?.filter((i) => i.region === formState.region)
  const res = result?.map((i) => i.stackZones)
  return [...new Set(res?.flat())]
})

const dzZones = computed(() => {
  return prZones.value?.filter((i) => i !== formState.primaryZone)
})

const onSubmit = () => {
  formRef.value?.validate().then(() => {
    console.log('formState', formState)
    if (formState.disasterRecoveryZone) {
      createCache()
    } else {
      Modal.confirm({
        title: 'No Disaster Recovery Zone selected!',
        icon: h(WarnCircle),
        content: 'Single availability zone, business will not have high availability.',
        onOk: () => {
          createCache()
        },
      })
    }
  })
}

const createCache = async () => {
  // WARNING: 如果同一个 region 创建了两个K8S集群， region 将不再唯一，所以反向搜索得到的集群id也不是唯一的，此时创建 Cache 所对应的 K8S 将不可控。
  const eksClusterId = data.value?.list?.find((i) => i.region === formState.region)?.id
  createLoading.value = true
  const params = { ...toRaw(formState), eksClusterId }
  params.maxMemoryMb = params.maxMemoryMb * 1024
  try {
    message.loading({ content: 'Creating...', key: 'add-cache' })
    await addCacheService(params as any)
    message.success({ content: 'Created Success!', key: 'add-cache', duration: 1.5 })
    createLoading.value = false
    router.push({ name: 'Caches' })
  } catch {
    message.error({ content: 'Failed to create cache service!', key: 'add-cache', duration: 1.5 })
  } finally {
    createLoading.value = false
  }
}
</script>

<template>
  <!-- MARK: 新版创建 Cache 页面 -->
  <BackHeader title="Create Cache Service" />
  <section px="6" class="pb-12 pt-8">
    <a-form ref="formRef" :model="formState" layout="vertical" size="large" :rules="CACHE_RULES" hide-required-mark>
      <a-card :body-style="{ padding: 0, backgroundColor: 'transparent' }">
        <FormItemContainer title="Basic Settings" sub-title="Modify your Cloud Provider, Region and zones.">
          <a-flex gap="middle">
            <a-form-item label="Cloud Provider" name="cloudProvider" class="flex-1">
              <a-select v-model:value="formState.cloudProvider" :suffix-icon="h(SuffixIcon)">
                <a-select-option v-for="item in clouds" :key="item" :value="item">
                  <span class="w-full flex_c gap-2">
                    <SvgIcon :name="`cloud-${item}`" class="size-5" />
                    <span class="text-center"> {{ CLOUDS_MAP[item] ?? item }} </span>
                  </span>
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Region" name="region" class="flex-1">
              <a-select v-model:value="formState.region" :suffix-icon="h(SuffixIcon)" :options="regions" />
            </a-form-item>
          </a-flex>

          <a-flex gap="middle">
            <a-form-item label="Primary Zone" name="primaryZone" class="flex-1">
              <a-select v-model:value="formState.primaryZone" :suffix-icon="h(SuffixIcon)">
                <a-select-option v-for="item in prZones" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="Disaster Recovery Zone" name="disasterRecoveryZone" class="flex-1">
              <a-select v-model:value="formState.disasterRecoveryZone" :suffix-icon="h(SuffixIcon)">
                <a-select-option v-for="item in dzZones" :key="item" :value="item">
                  {{ item }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-flex>
          <div class="stext-xs text-info-4">
            Disaster Recovery Zone: Backing up availability zones to support disaster recovery.
          </div>
        </FormItemContainer>

        <a-divider class="my-0" />

        <FormItemContainer title="Cache Name" sub-title="Change the name of your new cache service.">
          <a-form-item name="name">
            <a-input v-model:value="formState.name" autocomplete="off" />
          </a-form-item>
        </FormItemContainer>

        <a-divider class="my-0" />

        <FormItemContainer title="Memory" sub-title="Modify the maximum memory of your cache service.">
          <a-form-item name="maxMemoryMb">
            <a-input-number v-model:value="formState.maxMemoryMb" class="w-full" :min="1" :max="1024">
              <template #addonAfter> GB </template>
            </a-input-number>
          </a-form-item>
        </FormItemContainer>

        <a-divider class="my-0" />

        <FormItemContainer>
          <a-form-item name="clusterMode">
            <div class="flex_lr gap-4 mt-4">
              <div>
                <span>Enhanced Cluster Mode</span>
                <p class="text-info-4 text-xs">Advanced settings can only be used for Scalable Cluster.</p>
              </div>
              <a-switch v-model:checked="formState.clusterMode" :checked-value="1" :un-checked-value="0" />
            </div>
          </a-form-item>
        </FormItemContainer>
      </a-card>
    </a-form>
  </section>

  <footer class="mt-footer px-6 py-6 bg-white dark:bg-[#111] flex_c">
    <a-button
      type="primary"
      class="ml-auto !h-9 !flex items-center justify-center !text-sm min-w-24"
      size="large"
      @click="onSubmit"
      >Create</a-button
    >
  </footer>
</template>
