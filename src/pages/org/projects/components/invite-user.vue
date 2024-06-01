<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance, ModalProps } from 'ant-design-vue'
defineOptions({ name: 'AddProjectModal' })

enum ProjectRole {
  /** 项目拥有者 */
  ProjectOwner = 'Project Owner',
  /** 项目数据访问读写 */
  ProjectDataAccessReadWrite = 'Project Data Access Read-Write',
  /** 项目数据访问只读 */
  ProjectDataAccessReadOnly = 'Project Data Access Read-Only',
}

const roleList = ProjectRole

const formRef = ref<FormInstance>()
const visible = ref<boolean>(false)
const loading = ref<boolean>(false)
const emit = defineEmits(['ok'])

const formState = reactive({
  email: '',
  projectName: 'default project',
  role: 'Project Owner',
})

const onOk = () => {
  formRef.value!.validateFields().then(() => {
    // loading.value = true
    emit('ok')
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

const open = (data: any) => {
  formState.projectName = data.name
  visible.value = true
}

const rules: Record<string, Rule[]> = {
  projectName: [
    { required: true, message: 'Please input project name' },
    {
      pattern: /^[A-Za-z][\w-]{2,19}$/,
      message: '4 to 20 digits, starting with a letter, letter, number, minus sign, underline',
    },
  ],
  email: [
    { required: true, message: 'Please input email' },
    {
      type: 'email',
      message: 'Please input correct email',
    },
  ],
  role: [{ required: true, message: 'Please select role' }],
}

const $bind = computed(() => {
  return {
    width: 778,
    centered: true,
    okText: 'Confirm',
    title: 'Invite User',
    okButtonProps: {
      size: 'large',
      loading: loading.value,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})

defineExpose({ open, close, setLoading })
</script>

<template>
  <a-modal v-model:open="visible" v-bind="$bind" @ok="onOk" @cancel="close">
    <a-form ref="formRef" :rules="rules" :model="formState" autocomplete="off" layout="vertical" class="my-6">
      <a-form-item label="Email" name="email">
        <a-input
          v-model:value="formState.email"
          size="large"
          placeholder="Use ; to separate multiple email addresses"
        />
      </a-form-item>
      <div class="flex gap-4">
        <a-form-item label="Project" name="projectName" class="flex-1">
          <a-select v-model:value="formState.projectName" size="large" disabled>
            <a-select-option :value="formState.projectName">{{ formState.projectName }}</a-select-option>
            <template #suffixIcon>
              <SvgIcon name="select-suffix" />
            </template>
          </a-select>
        </a-form-item>
        <a-form-item label="Role" name="role" class="flex-1">
          <a-select v-model:value="formState.role" size="large">
            <a-select-option v-for="it in roleList" :key="it" :value="it">{{ it }}</a-select-option>
            <template #suffixIcon>
              <SvgIcon name="select-suffix" />
            </template>
          </a-select>
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>
