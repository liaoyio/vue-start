<script lang="ts" setup>
import { type FormInstance, type ModalProps, message } from 'ant-design-vue'
import { useOrgStore } from '@/store'
defineOptions({ name: 'AddProjectModal' })
type Props = { type: 'add' | 'update'; data?: any }

const orgs = useOrgStore()

const formRef = ref<FormInstance>()
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const emit = defineEmits(['ok'])

const initialData = reactive<Props>({
  type: 'add',
})

const formState = reactive({
  name: '',
  note: '',
})

const onOk = () => {
  // eslint-disable-next-line require-await
  formRef.value!.validateFields().then(async () => {
    loading.value = true
    if (initialData.type === 'add') {
      add()
    }
  })
}

const add = async () => {
  try {
    await addProject({ teamId: orgs.teamId!, ...toRaw(formState) })
    message.success('Create Success')
    emit('ok', { type: 'add' })
  } catch {
    message.error('Create Failed')
  } finally {
    close()
  }
}

const close = () => {
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
  loading.value = false
  visible.value = false
}

const setLoading = (value: boolean) => {
  loading.value = value
}

const open = ({ type, data }: Props) => {
  initialData.type = type
  if (type === 'update') {
    initialData.data = data
    formState.name = data.name
    formState.note = data.note
  } else {
    formState.name = ''
    formState.note = ''
    initialData.data = undefined
  }
  visible.value = true
}

const rules = {
  name: [
    { required: true, message: 'Please input project name' },
    {
      pattern: /^[A-Za-z][\w-]{2,19}$/,
      message: '4 to 20 digits, starting with a letter, letter, number, minus sign, underline',
    },
  ],
}
defineExpose({ open, close, setLoading })

const $bind = computed(() => {
  return {
    width: 618,
    centered: true,
    okText: 'Confirm',
    title: initialData.type === 'add' ? 'Create Project' : 'Edit Project ',
    okButtonProps: {
      size: 'large',
      loading: loading.value,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})
</script>

<template>
  <a-modal v-model:open="visible" v-bind="$bind" @ok="onOk" @cancel="close">
    <a-form ref="formRef" :rules="rules" :model="formState" autocomplete="off" layout="vertical" class="my-6">
      <a-form-item label="Project Name" name="name">
        <a-input v-model:value="formState.name" size="large" placeholder="Project-1" />
      </a-form-item>
      <a-form-item label="Note" name="note">
        <a-input v-model:value="formState.note" size="large" placeholder="Project note" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
