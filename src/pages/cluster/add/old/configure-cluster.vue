<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

import type { NewK8s } from './index.vue'
import type { SelectValue } from 'ant-design-vue/es/select'
import type { Rule } from 'ant-design-vue/es/form'
import type { Config } from '@/types/byoc'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Partial<Config> & { vpcIndex?: number }>,
  },
})

const $base = inject<NewK8s>('$base')

const supportUntilDate = computed(() => {
  if (!formData.value?.clusterVersion) return ''
  const release = $base?.versionList?.find((it) => it.version === formData.value?.clusterVersion)
  return dayjs(release?.supportUntilDate).format('YYYY-MM-DD')
})

const emit = defineEmits(['update:modelValue', 'next'])
const formData = useVModel(props, 'modelValue', emit)
const loading = ref(false)

const handleOnFinish = async () => {
  loading.value = true
  message.loading({ content: 'Updating...', key: 'scv', duration: 1.5 })
  try {
    const { eksClusterId } = await setClusterVpc($base?.config as Config)
    console.log(eksClusterId)
    emit('next', eksClusterId)
    message.success({ content: 'Success', key: 'scv', duration: 0.6 })
  } finally {
    loading.value = false
  }
}

const handleChange = (value: SelectValue) => {
  formData.value!.vpcId = $base?.vpcList[value as number].id
  formData.value!.vpcCidrBlock = $base?.vpcList[value as number].cidrBlock
}

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: 'Please input cluster name!' }],
  s3Bucket: [{ required: true, message: 'Please input s3 Bucket!' }],
  des: [{ required: false }],
  region: [{ required: true, message: 'Please select region', trigger: 'change' }],
  vpcIndex: [{ required: true, message: 'Please select vpc', trigger: 'change' }],
}

const tips: Record<string, string> = {
  region: 'Select region for your cluster.',
  CreateEKS: 'Create or customize a cluster from an existing cluster',
  'Secret EKS': 'If you choose an existing eks, this step will only create some nodegroups for memory type nodes.',
  'Cluster Name': 'Add a new name to the custom cluster.',
  'Select VPC':
    'We Suggest deploying the business and MontCache Server on the same VPC. The network is relatively easy to handle and has low latency.',
}
</script>

<template>
  <div>
    <h3 class="font-medium">Step2: Configure cluster.</h3>
    <p class="text-14px text-[#0009]">
      You can create a lot of MontCache Servers in a EKS cluster.The MontCache can be a master-slave architecture or a
      shared cluster architecture.
    </p>

    <a-form
      auto-complete="off"
      :rules="rules"
      class="pt-6"
      :model="formData"
      layout="vertical"
      @finish="handleOnFinish"
    >
      <a-form-item
        label="Kubernetes version"
        name="clusterVersion"
        :rules="[
          {
            required: true,
            message: 'Please select version',
            trigger: 'change',
          },
        ]"
      >
        <template #extra>
          <span v-show="formData!.clusterVersion">
            The supported versions and deadlines for Kubernetes are:
            <a href="https://kubernetes.io/releases/" target="_blank" class="!underline"> {{ supportUntilDate }}.</a>
          </span>
        </template>
        <a-select
          v-model:value="formData!.clusterVersion"
          placeholder="Select Version"
          style="width: 420px"
          :options="$base?.versionList"
          :field-names="{ label: 'version', value: 'version' }"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="Cluster Name" name="name">
        <a-input v-model:value="formData!.name" placeholder="Cluster Name." style="width: 420px" />
      </a-form-item>

      <a-form-item label="Description" name="des">
        <a-input v-model:value="formData!.des" placeholder="Description." style="width: 420px" />
      </a-form-item>

      <a-form-item label="Region" name="region">
        <a-select v-model:value="formData!.region" placeholder="Please select region" style="width: 420px">
          <a-select-option v-for="(item, index) in $base?.regions" :key="index" :value="item.name"
            >{{ item.des }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="VPC" name="vpcIndex" :help="tips['Select VPC']">
        <a-select
          v-model:value="formData!.vpcIndex"
          placeholder="Please select VPC"
          style="width: 420px"
          @change="handleChange"
        >
          <a-select-option v-for="(item, index) in $base?.vpcList" :key="item.id" :value="index">
            {{ item.name ? `${item.name}/` : item.name }}{{ item.id ? `${item.id}/` : item.id }}{{ item.cidrBlock }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="S3 Bucket" name="s3Bucket">
        <template #help>
          Enter the Amazon S3 bucket resource address to create a cluster,click open the
          <a href="https://s3.console.aws.amazon.com/s3/home" target="_blank"> S3 section.</a>.
        </template>
        <a-input v-model:value="formData!.s3Bucket" placeholder="Amazon s3 bucket." style="width: 420px" />
      </a-form-item>

      <!-- Service Access Source -->
      <a-form-item label="Cluster Endpoint Access" name="permissions">
        <template #help>
          <span v-if="formData!.subnetPrivateType === 10">
            The cluster endpoint is accessible from outside of your VPC. Worker node traffic to the endpoint will stay
            within your VPC.
          </span>
          <span v-else>
            The cluster endpoint is only accessible through your VPC. Worker node traffic to the endpoint will stay
            within your VPC.
          </span>
        </template>
        <a-radio-group v-model:value="formData!.subnetPrivateType" name="radioGroup">
          <a-radio :value="10">Public and private</a-radio>
          <a-radio :value="1">Private</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item>
        <a-space class="mt-8" size="large">
          <a-button type="primary" html-type="submit" :loading="loading">Next</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="scss">
::v-deep(.ant-form-show-help) {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
