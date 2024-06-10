<script setup lang="ts">
import { h } from 'vue'
import { useRequest } from 'vue-request'
import { notification } from 'ant-design-vue'
import { SuffixIcon } from '@/components/icon'
import { FormItemContainer } from '@/components/ui'
import { EmptyCredential } from '@/components/empty'

const checkLoading = ref(false)

const { data, loading } = useRequest(getCredentialList, {
  onSuccess: (res) => {
    if (res?.list?.length > 0) {
      const isDefault = res.list.find((item) => item.isDefault)
      if (isDefault) {
        formCheckState.credentialId = isDefault.id
      } else {
        formCheckState.credentialId = res.list[0].id
      }
    }
  },
})

const scList = computed(() => data.value?.list || [])
const formCheckState = reactive<{ credentialId?: number }>({})

const emit = defineEmits(['finish'])

const onCheck = (values: any) => {
  checkLoading.value = true
  checkCredentialhasInit(values.credentialId)
    .then(({ eksClusterId }) => {
      if (!eksClusterId) {
        return notification.error({
          message: 'Security credential verification failed.',
          description: 'Please check the security credential and try again.',
        })
      }
      emit('finish', { eksClusterId })
    })
    .finally(() => {
      checkLoading.value = false
    })
}

const options = computed(() => {
  if (!scList.value.length) return []
  return scList.value.map((item) => ({
    ...item,
    value: item.id,
    label: item.name,
  }))
})
</script>

<template>
  <a-card :body-style="{ backgroundColor: 'transparent' }" :loading="loading">
    <a-form
      v-if="options.length"
      :model="formCheckState"
      layout="vertical"
      class=""
      size="large"
      hide-required-mark
      @finish="onCheck"
    >
      <FormItemContainer
        title="Choose a Security Credentials"
        sub-title="Start your journey on Montplex Cache service."
      >
        <a-form-item name="credentialId">
          <a-select
            v-model:value="formCheckState.credentialId"
            :suffix-icon="h(SuffixIcon)"
            class="w-full"
            :options="options"
          >
            <template #optionLabel="item">
              <span v-if="item.label">{{ item?.label }}</span>
            </template>
            <template #option="item">
              <div class="flex flex-col gap-2 relative">
                <div class="font-medium">{{ item.name }}</div>
                <p class="text-info-4 !text-xs !font-normal mb-1">
                  Type: {{ item.assumeRoleArn ? 'Role Arn' : 'AK/SK' }}
                </p>
                <SvgIcon :name="`cloud-${item.cloudProvider}`" class="size-5 absolute right-0" />
              </div>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button :loading="checkLoading" type="primary" class="!h-8 !py-0 w-30 mt-4" html-type="submit"
            >Next</a-button
          >
        </a-form-item>
      </FormItemContainer>
    </a-form>
    <EmptyCredential v-else />
  </a-card>
</template>
