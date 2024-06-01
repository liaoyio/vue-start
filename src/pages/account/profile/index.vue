<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form'

const formState = reactive({
  firstName: '',
  lastName: '',
  phoneNumber: '',
})

const onFinish = (values: any) => {
  console.log('Success:', values)
}

const rules: Record<string, Rule[]> = {
  firstName: [{ required: true, message: 'First Name is required', trigger: 'change' }],
  lastName: [{ required: true, message: 'Last Name is required', trigger: 'change' }],
}
</script>

<template>
  <a-form :model="formState" layout="vertical" class="w-100" :rules="rules" @finish="onFinish">
    <a-form-item label="First Name" name="firstName">
      <a-input v-model:value="formState.firstName" size="large" />
    </a-form-item>
    <a-form-item label="Last Name" name="lastName">
      <a-input v-model:value="formState.lastName" size="large" />
    </a-form-item>
    <a-form-item label="Phone Number">
      <a-input v-model:value="formState.phoneNumber" size="large" />
    </a-form-item>
    <a-form-item>
      <a-button html-type="submit" type="primary">Save</a-button>
    </a-form-item>
  </a-form>
</template>
