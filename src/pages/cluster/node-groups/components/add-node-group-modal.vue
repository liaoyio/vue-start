<script lang="ts" setup>
import { ref } from 'vue'
import { InstanceType } from '@/types/byoc'
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance, ModalProps } from 'ant-design-vue'

type Params = { eksClusterId: number | string; region: string; type?: string }

type State = {
  nodeGroupName?: string
  zone?: string
  instanceNumber?: number
}

const open = ref<boolean>(false)
const editFormRef = ref<FormInstance>()

const formState = reactive<State>({
  instanceNumber: 1,
})

const zones = ref<string[]>()
let params = reactive<Params>({ eksClusterId: '', region: '' })
const emit = defineEmits(['confirm'])

const handleOk = () => {
  editFormRef.value?.validateFields().then((values) => {
    if (params.type === 'work') {
      emit('confirm', { ...values, isNewNodeGroup: true, isWorker: true })
    }
    if (params.type === 'proxy') {
      emit('confirm', { ...values, isNewNodeGroup: true, isProxy: true })
    }
    editFormRef.value?.resetFields()
    open.value = false
  })
}

const initZones = async () => {
  const { eksClusterId, region } = params
  const res = await getZones({ eksClusterId, region })
  if (res.list.length) {
    zones.value = res.list.map((it) => it.name) ?? []
  }
}

const modalInit = async (state: any) => {
  params = { ...state }
  open.value = true
  await initZones()
}

const rules: Record<string, Rule[]> = {
  nodeGroupName: [{ required: true, message: 'Please enter node group name.' }],
  instanceNumber: [{ required: false, message: 'please enter num' }],
  zone: [{ required: true, message: 'Please choose the zones' }],
}

defineExpose({ open, modalInit })

const $bind = computed(() => {
  return {
    width: 720,
    closable: false,
    centered: true,
    okText: 'Confirm',
    title: 'Add Node Group',
    okButtonProps: {
      size: 'large',
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})
</script>

<template>
  <a-modal v-model:open="open" v-bind="$bind" @ok="handleOk" @close="open = false">
    <a-form ref="editFormRef" size="large" class="mt-3 mb-8" :model="formState" layout="vertical" :rules="rules">
      <a-form-item label="Node Group Name" name="nodeGroupName">
        <a-input v-model:value="formState.nodeGroupName" placeholder="Node Group Name." />
      </a-form-item>

      <a-form-item label="Zone" name="zone">
        <a-select v-model:value="formState.zone" placeholder="Please select zone.">
          <a-select-option v-for="(item, index) in zones" :key="index" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="Instance Number"
        name="instanceNumber"
        :rules="[{ required: true, message: 'Please input current nodes' }]"
      >
        <a-input-number v-model:value="formState.instanceNumber" :min="1" :max="100" style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
