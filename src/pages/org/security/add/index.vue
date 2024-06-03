<script setup lang="ts">
import { message } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { CloudProvider } from '@/components/form'
import { addCredential, getCloudProvider } from '@/api/credential'
import RadioAuthCard from './radio-auth-card.vue'
import CodeVue from './code.vue'
import type { RegionZone } from '@/types/cache'

const router = useRouter()
// configuration Center

const onFinish = async () => {
  if (formState.value.checkType === 1) {
    const { credentialId } = await addCredential({
      cloudProvider: formState.value.cloudProvider,
      name: formState.value.name,
      ak: formState.value.ak,
      sk: formState.value.sk,
    })
    if (credentialId) {
      message.success('Add Success')
      router.replace({ name: 'OrgSecurity' })
    }
  } else {
    const { credentialId } = await addCredential({
      cloudProvider: formState.value.cloudProvider,
      name: formState.value.name,
      assumeRoleArn: formState.value.assumeRoleArn,
    })
    if (credentialId) {
      message.success('Add Success')
      router.replace({ name: 'OrgSecurity' })
    }
  }
}

type TState = {
  spinning: boolean
  clouds: { label: string; value: string }[]
  fullData: { [key: string]: any }
  initialData: RegionZone[]
}

const options = [
  {
    value: 1,
    label: 'AK/SK (Access keys)',
    info: 'Access keys are long-term credentials for an IAM user or the AWS account root use.',
  },
  {
    value: 2,
    label: 'Cross-account access using roles(recommended)',
    info: 'A cross-account IAM role is an IAM role that includes a trust policy that allows IAM principals in another AWS account to assume the role.',
  },
]

const state = reactive<TState>({
  spinning: false,
  clouds: [],
  fullData: {},
  initialData: [],
})

const formState = ref({
  name: '',
  cloudProvider: 'aws',
  checkType: 1,
  ak: '',
  sk: '',
  assumeRoleArn: '',
})

const { data: shell } = useRequest(getCredentialShell)

onMounted(async () => {
  state.spinning = true
  try {
    const { list } = await getCloudProvider()
    const clouds = list.map((value) => ({ label: getcloudLabel(value), value }))
    /** 根据 26 英文字母倒序排序 */
    state.clouds = clouds.sort((a, b) => b.label.localeCompare(a.label))
  } catch {
    message.error('Failed to get cloud provider')
  } finally {
    state.spinning = false
  }
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
</script>

<template>
  <main>
    <header class="mt-header py-6 bg-white dark:bg-[#111] my-2">
      <h3>Add Credential</h3>
    </header>
    <section px="6" py="2">
      <div class="flex flex-col pb-20">
        <a-form size="large" layout="vertical" autocomplete="off" :model="formState" @finish="onFinish">
          <a-form-item name="cloudProvider" label="Cloud Provider">
            <CloudProvider v-model="formState.cloudProvider" :clouds="state.clouds" />
          </a-form-item>

          <a-form-item name="checkType" label="Choose authentication method">
            <RadioAuthCard v-model:value="formState.checkType" :options="options" />
          </a-form-item>

          <a-form-item name="name" :rules="[{ required: true, message: 'Please input name!' }]" label="Name">
            <a-input v-model:value="formState.name" placeholder="Please input name" />
          </a-form-item>

          <div v-if="formState.checkType === 1">
            <h3 class="font-medium mb-1">Check Policy Access Keys :</h3>
            <p class="mb-3 text-info-4">
              You must provide an AK/SK of AWS account. And it must has some policies.As follows:
              <a class="link hover:underline" target="_blank" href="https://eksctl.io/usage/minimum-iam-policies/"
                >View Policies</a
              >
            </p>
            <a-form-item
              name="ak"
              :rules="[{ required: true, message: 'Please input access key id!' }]"
              label="AccessKeyId"
            >
              <a-input-password v-model:value="formState.ak" placeholder="Please enter the access key id" />
            </a-form-item>
            <a-form-item
              name="sk"
              :rules="[{ required: true, message: 'Please input secret key!' }]"
              label="Secret Key"
            >
              <a-input-password v-model:value="formState.sk" placeholder="Please enter the secret key" />
            </a-form-item>

            <a-form-item>
              <a-button class="mt-6" type="primary" html-type="submit"> Submit </a-button>
            </a-form-item>
          </div>

          <div v-if="formState.checkType === 2" class="flex flex-col gap-6">
            <div>
              <h3 class="font-medium">1. Cross-account access using roles.</h3>
              <p class="mb-4 mt-1 pl-3 text-14px text-info-4">
                Copy the following content and execute it from the command line. To create a role that supports trust.
              </p>
              <CodeVue
                :code="shell ?? ''"
                style="max-height: 240px; overflow-y: auto; margin-left: 12px; overflow-x: hidden"
              />
            </div>

            <div>
              <h3 class="font-medium">2.Set role arn</h3>
              <p class="mt-1 pl-3 text-14px text-info-4">
                Fill in the results of the above execution in the space below and set security credentials.
              </p>
              <div class="ml-3 mt-4">
                <a-input v-model:value="formState.assumeRoleArn" placeholder="enter your role arn." />
              </div>
            </div>
            <a-form-item>
              <a-button class="ml-3 mt-2" type="primary" html-type="submit"> Submit </a-button>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </section>
  </main>
</template>
