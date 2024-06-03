<script setup lang="ts">
import { type FormInstance, type ModalProps, message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { updateDynConfigBody } from '@/api/dyn-config'
import type { Ref } from 'vue'

type Options = { label: any; value: any }[]

const op = inject<
  Ref<{
    cloudProviderOptions: Options[]
    itemTypeOptions: Options[]
    regionZoneOptions: Options[]
  }>
>('options')

const modal = reactive({
  open: false,
  loading: false,
  type: 'create' as 'create' | 'update',
})

const formRef = ref<FormInstance>()
const formState = ref<Partial<updateDynConfigBody>>({})

const emit = defineEmits(['ok', 'open'])

const onOk = () => {
  formRef.value!.validateFields().then(async () => {
    modal.loading = true
    try {
      await updateDynConfig(formState.value as updateDynConfigBody)
      message.success(`Item ${modal.type === 'create' ? 'created' : ' updated'} successfully`)
      emit('ok')
      close()
    } catch {
      message.error(`Failed to ${modal.type === 'create' ? 'create' : 'update'} item`)
    } finally {
      modal.loading = false
    }
  })
}

const close = () => {
  modal.loading = false
  formState.value = {}
  modal.open = false
}

const open = (state?: any) => {
  modal.open = true
  if (state) {
    const { cloudProvider, itemType, region, orgId: orgIdTarget, value } = state
    formState.value = { cloudProvider, itemType, region, orgIdTarget, value }
    modal.type = 'update'
  } else {
    modal.type = 'create'
  }

  formRef.value?.resetFields()
  formRef.value?.clearValidate()
}

defineExpose({ open, close })

const $bind = computed(() => {
  return {
    width: 720,
    closable: false,
    centered: true,
    okText: 'Confirm',
    title: 'Add Item',
    okButtonProps: {
      size: 'large',
      loading: modal.loading,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})

const rules: Record<string, Rule[]> = {
  cloudProvider: [{ required: true, message: 'Please select cloud provider' }],
  itemType: [{ required: true, message: 'Please select item type' }],
  value: [{ required: true, message: 'Please enter value' }],
}
</script>

<template>
  <a-modal v-model:open="modal.open" v-bind="$bind" @ok="onOk" @cancel="close">
    <a-form
      ref="formRef"
      size="large"
      :rules="rules"
      :model="formState"
      autocomplete="off"
      layout="vertical"
      class="mt-4"
    >
      <a-form-item label="Item Type" name="itemType">
        <a-select
          v-model:value="formState.itemType"
          placeholder="Select Item Type"
          allow-clear
          :disabled="modal.type === 'update'"
          :options="op?.itemTypeOptions"
        />
      </a-form-item>

      <a-form-item label="Cloud Provider" name="cloudProvider">
        <a-select
          v-model:value="formState.cloudProvider"
          placeholder="Select Cloud Provider"
          allow-clear
          :disabled="modal.type === 'update'"
          :options="op?.cloudProviderOptions"
        />
      </a-form-item>

      <a-form-item label="Region" name="region">
        <a-input
          v-model:value="formState.region"
          placeholder="Region."
          style="background-color: transparent"
          :disabled="modal.type === 'update'"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="OrgId" name="orgIdTarget">
        <a-input
          v-model:value="formState.orgIdTarget"
          type="number"
          :disabled="modal.type === 'update'"
          placeholder="OrgId."
        />
      </a-form-item>

      <a-form-item label="Value" name="value">
        <a-textarea v-model:value="formState.value" placeholder="value." />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
::v-deep(.ant-form-show-help) {
  margin-top: 10px;
}

::v-deep(.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  background: transparent;
}

::v-deep(.ant-input[disabled]) {
  background: transparent;
}
</style>
