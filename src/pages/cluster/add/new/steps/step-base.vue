<script setup lang="ts">
import { h } from 'vue'
import { useRouteQuery } from '@vueuse/router'
import { message } from 'ant-design-vue'
import { useStorage } from '@vueuse/core'
import { LoadingLoop, SuffixIcon } from '@/components/icon'
import { FormItemContainer } from '@/components/ui'
import { formatDate } from '@/utils'
import { CLUSTER_BASE_RULES } from '@/utils/validate'
import type { EksVersion } from '@/api'

import type { Region, VPC } from '@/types/byoc'

defineProps({ eksClusterId: Number })

const loading = ref(false)
const nextLoading = ref(false)

const regionList = ref<Region[]>([])
const versionList = ref<EksVersion[]>([])

const query = useRouteQuery('eksClusterId', Number, { transform: Number })

const InitFn = async () => {
  loading.value = true
  try {
    const rg = await initRegions({ eksClusterId: query.value })
    const vs = await getEksVersionList()
    regionList.value = rg.list ?? []
    versionList.value = vs.list ?? []
    if (versionList.value.length > 0) {
      formState.value.clusterVersion = versionList.value.at(-1)!.version
    }
  } catch {
    message.error('Failed to get the region list')
  } finally {
    loading.value = false
  }
}

InitFn()

type FormState = {
  name?: string
  region?: string
  clusterVersion?: string
  s3Bucket?: string
  vpcId?: string
  /** 10 -> public, 1 -> private, 0 -> private with nat */
  subnetPrivateType?: 0 | 10 | 1
}

const theDefault: FormState = {
  name: '',
  region: '',
  clusterVersion: '',
  s3Bucket: '',
  vpcId: '',
}

const formState = useStorage('mt-resources-basic-form-sate', theDefault)

// const formState = reactive<FormState>({})

const emit = defineEmits(['finish'])

const onFinish = (values: any) => {
  emit('finish', {
    ...values,
    eksClusterId: query.value,
    vpcCidrBlock: vpcList.value.find((it) => it.id === values.vpcId)?.cidrBlock,
  })
}

watch(
  () => formState.value.region,
  async ($new, $old) => {
    if ($new !== $old) {
      await regionChangeInitVpcList()
    }
  },
)

type VpcItem = VPC & { label: string; value: string }

const vpcList = ref<VpcItem[]>([])
const vpcLoading = ref(false)

async function regionChangeInitVpcList() {
  vpcLoading.value = true
  try {
    const { list } = await initVpcList({ eksClusterId: query.value, region: formState.value.region })
    vpcList.value = list.map((it) => ({ ...it, label: it.cidrBlock, value: it.id })) ?? []
    formState.value.vpcId = vpcList.value.at(0)?.id ?? ''
  } catch {
    message.error('Failed to get the VPC list')
  } finally {
    vpcLoading.value = false
  }
}

const supportUntilDate = computed(() => {
  if (!formState.value?.clusterVersion) return ''
  const release = versionList.value.find((it) => it.version === formState.value.clusterVersion)
  return formatDate(release?.supportUntilDate, 'YYYY-MM-DD')
})
</script>

<template>
  <a-card :body-style="{ padding: 0, backgroundColor: 'transparent' }" :loading="loading">
    <a-form :model="formState" layout="vertical" size="large" :rules="CLUSTER_BASE_RULES" @finish="onFinish">
      <FormItemContainer class="!p-12" title="Basic Settings" sub-title="Modify your region,VPC, and S3 Bucket.">
        <a-flex gap="middle">
          <a-form-item label="Kubernetes Version" class="flex-1" name="clusterVersion">
            <template #extra>
              <span class="pt-2">
                The supported versions and deadlines for Kubernetes are:
                <a class="link hover:underline" href="https://kubernetes.io/releases/" target="_blank">
                  {{ supportUntilDate }}</a
                >.
              </span>
            </template>
            <a-select v-model:value="formState.clusterVersion" :suffix-icon="h(SuffixIcon)">
              <a-select-option v-for="item in versionList" :key="item.id" :value="item.id">
                {{ item.version }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Region" class="flex-1" name="region">
            <a-select v-model:value="formState.region" :suffix-icon="h(SuffixIcon)">
              <a-select-option v-for="(it, index) in regionList" :key="index" :value="it.name">
                {{ it.des }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-flex>

        <a-form-item label="VPC" name="vpcId">
          <template #help>
            <p class="text-[13px] my-2">
              We Suggest deploying the project and Montplex server on the same VPC. The network is relatively easy to
              handle and has low latency.
            </p>
          </template>
          <a-select v-model:value="formState.vpcId" :options="vpcList" :disabled="vpcLoading">
            <template #suffixIcon>
              <LoadingLoop v-if="vpcLoading" />
              <SuffixIcon v-else />
            </template>
            <template #optionLabel="item">
              <span v-if="item.label">{{ item.cidrBlock }}</span>
            </template>
            <template #option="item">
              <div class="flex flex-col gap-2 mb-2">
                <div class="font-medium">{{ item.name }}</div>
                <div class="flex_lr">
                  <span class="text-info-4 !text-xs !font-normal">ID: {{ item.id }}</span>
                  <span class="text-info-4 !text-xs !font-normal">CIDR: {{ item.cidrBlock }}</span>
                </div>
              </div>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="S3 Bucket" class="pt-4" name="s3Bucket">
          <a-input v-model:value="formState.s3Bucket" autocomplete="off" />
          <template #help>
            <p class="text-[13px] my-2">
              Enter the Amazon S3 bucket resource address to create a cluster,click open the
              <a class="link hover:underline" href="https://s3.console.aws.amazon.com/s3/home" target="_blank">
                S3 section</a
              >.
            </p>
          </template>
        </a-form-item>
      </FormItemContainer>

      <a-divider class="my-0" />

      <FormItemContainer class="!px-12 !pt-8" title="Resources Name" sub-title="Change the name of your new resources.">
        <a-form-item name="name">
          <a-input v-model:value="formState.name" autocomplete="off" />
        </a-form-item>
      </FormItemContainer>

      <div class="px-12 -mt-5 pb-8">
        <a-form-item>
          <a-button :loading="nextLoading" type="primary" class="!h-8 !py-0 w-30 mt-4" html-type="submit"
            >Next</a-button
          >
        </a-form-item>
      </div>

      <!-- MARK: 暂时隐藏 subnetPrivateType 功能 -->
      <template v-if="false">
        <a-divider class="my-0" />
        <div p="x-12 t-8 b-12">
          <a-form-item label="Cluster Endpoint Access" name="permissions">
            <template #help>
              <span v-if="formState.subnetPrivateType === 10" class="!text-xs">
                The cluster endpoint is accessible from outside of your VPC. Worker node traffic to the endpoint will
                stay within your VPC.
              </span>
              <span v-else class="!text-[13px]">
                The cluster endpoint is only accessible through your VPC. Worker node traffic to the endpoint will stay
                within your VPC.
              </span>
            </template>
            <a-radio-group v-model:value="formState.subnetPrivateType" name="radioGroup">
              <a-radio :value="10" class="mr-12">Public and private</a-radio>
              <a-radio :value="1">Private</a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
      </template>
    </a-form>
  </a-card>
</template>
