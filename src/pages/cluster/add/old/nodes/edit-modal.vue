<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance } from 'ant-design-vue'
import type { NodeGroup } from '@/types//byoc'

type Props = Partial<NodeGroup>

const editFormRef = ref<FormInstance>()
const open = ref<boolean>(false)
const formState = ref<Props>({})

const emit = defineEmits(['confirm'])

const handleOk = () => {
  editFormRef.value?.validateFields().then((values) => {
    emit('confirm', values)
    editFormRef.value?.resetFields()
    open.value = false
  })
}

const modalInit = (data: Props) => {
  open.value = true
  if (data) {
    formState.value = { ...data }
  }
}

const rules: Record<string, Rule[]> = {
  instanceNumber: [{ required: true, message: 'please input instance number' }],
}

defineExpose({ open, modalInit })
</script>

<template>
  <a-modal v-model:open="open" :width="600" @close="open = false">
    <a-form ref="editFormRef" :model="formState" layout="vertical" :rules="rules">
      <a-form-item label="Name" name="name">
        <a-input v-model:value="formState.name" disabled style="background-color: transparent" />
      </a-form-item>

      <a-form-item label="Zones" name="zoneList">
        <a-select v-model:value="formState.zoneList" mode="multiple" style="background-color: transparent" disabled />
      </a-form-item>

      <a-form-item label="Instance Number" name="instanceNumber">
        <a-input-number v-model:value="formState.instanceNumber" :min="1" :max="99" style="width: 100%" />
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex flex-row-reverse gap-4 py-2">
        <a-button key="submit" type="primary" @click="handleOk">OK</a-button>
        <a-button key="back" @click="open = false">Cancel</a-button>
      </div>
    </template>
  </a-modal>
</template>
