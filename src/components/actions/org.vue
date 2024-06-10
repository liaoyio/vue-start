<script setup lang="ts">
import { EllipsisOutlined } from '@ant-design/icons-vue'
import { type ModalProps, type PopoverProps, message } from 'ant-design-vue'
import type { OrgDetail } from '@/api'
import type { CSSProperties } from 'vue'

const props = defineProps({ info: { type: Object as PropType<OrgDetail> } })

const formState = reactive({
  name: '',
  note: '',
})

const renameOpen = ref(false)
const formRef = ref()
const oldName = ref<string>('')
const renameLoading = ref(false)

const emits = defineEmits(['refresh'])

const onRenameOk = async () => {
  renameLoading.value = true
  const body = { teamId: props.info!.id, name: formState.name, note: formState.note }
  try {
    await updateOrg(body)
    emits('refresh')
    close()
    message.success({ content: 'Update Success!' })
  } catch {
    message.error({ content: 'Request Failed!' })
  } finally {
    renameLoading.value = false
  }
}

const showModal = () => {
  renameOpen.value = true
  formState.name = props.info?.name as string
  oldName.value = props.info?.name as string
}

const close = () => {
  formRef.value.resetFields()
  formRef.value.clearValidate()
  renameOpen.value = false
}

const overlayInnerStyle: CSSProperties = {
  marginLeft: '12px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 32px',
  padding: '8px',
  marginTop: '4px',
}

const $popover = computed(() => {
  return {
    overlayInnerStyle,
    placement: 'bottomRight',
    arrow: false,
    trigger: 'click',
  } as PopoverProps
})

const renameModal = computed(() => {
  return {
    width: 720,
    closable: false,
    centered: true,
    okText: 'Confirm',
    title: 'Modify',
    destroyOnClose: true,
    okButtonProps: {
      size: 'large',
      loading: renameLoading.value,
      disabled: !formState.name || formState.name === oldName.value,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})
</script>

<template>
  <a-popover v-bind="$popover">
    <template #content>
      <a-menu style="background: transparent; border-right: none" :selectable="false">
        <a-menu-item key="1" class="!flex !items-center" @click="showModal">
          <template #icon>
            <SvgIcon name="edit" size="18" />
          </template>
          Modify
        </a-menu-item>
      </a-menu>
    </template>
    <a-button class="flex_cc">
      <template #icon>
        <EllipsisOutlined style="font-size: 16px" />
      </template>
    </a-button>
  </a-popover>

  <a-modal :open="renameOpen" v-bind="renameModal" @ok="onRenameOk" @cancel="close">
    <a-form ref="formRef" :model="formState" name="basic" size="large" autocomplete="off" layout="vertical">
      <a-form-item label="Name" name="name" :rules="[{ required: true, message: 'Please input name!' }]">
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item label="Note" name="note">
        <a-input v-model:value="formState.note" />
      </a-form-item>
    </a-form>
    <p class="pt-3">Your connections and clients will not be affected by this change.</p>
  </a-modal>
</template>
