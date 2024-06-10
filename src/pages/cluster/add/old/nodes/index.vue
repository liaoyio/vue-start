<script setup lang="tsx">
import { useVModel } from '@vueuse/core'
import FromTable from './table.vue'
import type { NewK8s } from '../index.vue'
import type { ConfigBody } from '@/types/byoc'

const props = defineProps({
  modelValue: {
    type: Object as PropType<NewK8s['nodes']>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'next', 'prev'])
const state = useVModel(props, 'modelValue', emit)
const loading = ref(false)

const $base = inject<NewK8s>('$base')

const router = useRouter()

const onFinish = async () => {
  loading.value = true
  // state.value.nodeGroupList.forEach((it: any) => delete it.enableSpot)
  const body: ConfigBody = {
    // clusterVersion: state.value.clusterVersion as string, // 集群版本号
    eksClusterId: $base?.eksClusterId as number, // 集群ID
    nodeGroupList: state.value.nodeGroupList,
  }
  try {
    const { stackId } = await setClusterNodeGroup(body)
    if (!stackId) return
    const { stackId: id } = await clusterDeploy({ stackId })
    if (!id) return
    router.replace({ name: 'Logs', query: { stackId } })
    loading.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h3 class="font-medium">Step3: Deploy Worker Node Groups.</h3>
    <a-form class="pt-6" :model="state" layout="vertical" @finish="onFinish">
      <a-form-item
        label="Zones"
        name="zones"
        help="Select the list of available zones that need to be deployed, and by default, 3 available zones will be created."
        :rules="[{ required: true, message: 'Please select zones', trigger: 'change' }]"
      >
        <a-select v-model:value="state.zones" mode="multiple" placeholder="Please select zones" style="width: 420px">
          <a-select-option v-for="(item, index) in $base?.zones" :key="index" :value="item"
            >{{ item }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <FromTable v-model="state.nodeGroupList" />

      <div class="flex flex-col gap-2 pt-6">
        <p>
          <a-tag class="font-medium">controller</a-tag>: To achieve high availability at the availability zone level,
          you need to select three or more availability zones. It has some control components.
        </p>

        <p><a-tag class="font-medium">work(*)</a-tag>: Work nodes are used for caches.</p>
      </div>
      <a-divider />

      <a-form-item>
        <a-space class="mt-6" size="large">
          <a-button type="primary" html-type="submit" :loading="loading">Submit</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.cell_dived {
  position: relative;

  &::before {
    position: absolute;
    top: 50%;
    inset-inline-end: 0;
    width: 1px;
    height: 1.6em;
    background-color: #f0f0f0;
    transform: translateY(-50%);
    transition: background-color 0.2s;
    content: '';
  }
}

::v-deep(.ant-form-show-help) {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>
