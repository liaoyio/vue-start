<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import type { ModalProps } from 'ant-design-vue'

const formRef = ref()

const open = ref(false)
const loading = ref(false)

const formState = reactive({
  mode: null,
})

const resetForm = () => {
  formRef.value.resetFields()
}

defineExpose({ resetForm, open, loading })

const emit = defineEmits(['ok'])

const handleOk = () => {
  formRef.value!.validateFields().then(() => {
    emit('ok', formState.mode)
  })
}

const $bind = computed(() => {
  return {
    width: 618,
    centered: true,
    okText: 'Confirm',
    title: 'Add Access Token',
    destroyOnClose: true,
    okButtonProps: {
      size: 'large',
      loading: loading.value,
      disabled: !formState.mode,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})

const options = [
  { value: 'ro', label: 'Read Only' },
  { value: 'rw', label: 'Read & Write' },
]

const rules: Record<string, Rule[]> = {
  mode: [
    {
      required: true,
      message: 'Please select the Mode',
      trigger: 'change',
    },
  ],
}
</script>

<template>
  <a-button type="primary" @click="open = true">Add Token</a-button>
  <a-modal v-model:open="open" v-bind="$bind" @ok="handleOk" @cancel="open = false">
    <a-form ref="formRef" :model="formState" layout="vertical" :rules="rules" class="my-8">
      <a-form-item name="mode" label="Mode">
        <a-select v-model:value="formState.mode!" size="large" placeholder="Please select the Mode" :options="options">
          <template #suffixIcon>
            <SvgIcon name="select-suffix" />
          </template>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
