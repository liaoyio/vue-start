<script setup lang="ts">
import { type FormInstance, type ModalProps, notification } from 'ant-design-vue'
import viewLogsButton from './view-logs-button.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ScaleBody } from '@/api/byoc'

const formRef = ref<FormInstance>()
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const oldState = ref<Partial<ScaleBody>>({})

const emit = defineEmits<{
  (event: 'ok', stackId: number): void
}>()

const formState = ref<Partial<ScaleBody>>({
  instanceNumber: 1,
})

const onOk = () => {
  formRef.value!.validateFields().then(async () => {
    loading.value = true
    try {
      // console.log(formState.value)
      const { stackId } = await scaleUpNodeGroup(formState.value as ScaleBody)
      if (stackId) {
        notification.success({
          message: 'Success',
          description: 'Node group scaling is in progress.',
          btn: () =>
            h(viewLogsButton, {
              onOk: () => {
                handleViewLogs(stackId)
                notification.close('scale')
              },
            }),
          key: 'scale',
        })
        emit('ok', stackId)
        close()
      }
    } catch {
      loading.value = false
    }
  })
}

const router = useRouter()

const handleViewLogs = (stackId: number) => {
  if (!stackId) return
  router.push({ name: 'Logs', query: { stackId, type: 'scale' } })
}

const close = () => {
  loading.value = false
  formState.value.nodeGroupName = ''
  visible.value = false
}

const setLoading = (value: boolean) => {
  loading.value = value
}

const open = (state: any) => {
  visible.value = true
  formState.value = { ...state, instanceNumber: 1 }
  oldState.value = { ...state }
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
}

defineExpose({ open, close, setLoading })

const rules: Record<string, Rule[]> = {
  instanceNumber: [{ required: true, message: 'Please input current nodes' }],
}

const $bind = computed(() => {
  return {
    width: 720,
    closable: false,
    centered: true,
    okText: 'Confirm',
    title: 'Scale Node Group',
    okButtonProps: {
      size: 'large',
      loading: loading.value,
      disabled: oldState.value.instanceNumber === formState.value.instanceNumber,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})
</script>

<template>
  <a-modal v-model:open="visible" v-bind="$bind" @ok="onOk" @cancel="close">
    <a-form
      ref="formRef"
      size="large"
      :rules="rules"
      :model="formState"
      autocomplete="off"
      layout="vertical"
      class="mt-4"
    >
      <a-form-item label="Node Group Name">
        <a-input
          id="error"
          v-model:value="formState.nodeGroupName"
          placeholder="Node Group Name."
          disabled
          style="background: transparent"
        />
      </a-form-item>

      <a-form-item label="Instance Number" name="instanceNumber">
        <a-input-number v-model:value="formState.instanceNumber" :min="1" :max="100" style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
