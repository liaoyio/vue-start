<script lang="ts" setup>
import type { FormInstance, ModalProps } from 'ant-design-vue'
defineOptions({ name: 'AddProjectModal' })
type Props = { type: 'add' | 'update'; data?: any }

const formRef = ref<FormInstance>()
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const emit = defineEmits(['ok'])

const initialData = reactive<Props>({
  type: 'add',
})

const formState = reactive({
  projectName: '',
})

const onOk = () => {
  formRef.value!.validateFields().then(() => {
    // loading.value = true
    emit('ok', {
      type: initialData.type,
      data: {
        name: formState.projectName,
        id: initialData.data?.id,
      },
    })
  })
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
    formState.projectName = data.name
  } else {
    formState.projectName = ''
    initialData.data = undefined
  }
  visible.value = true
}

const rules = {
  projectName: [
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
      <a-form-item label="Project Name" name="projectName">
        <a-input v-model:value="formState.projectName" size="large" placeholder="Project-1" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
