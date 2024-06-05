<script setup lang="ts">
import { ref } from 'vue'
import type { ModalProps } from 'ant-design-vue'

const open = ref(false)
const loading = ref(false)
const verificationName = ref('')
const hasdel = ref(false)
let clusterInfo = reactive({ name: '', stackId: '' })

const emit = defineEmits(['on-delete'])

const handleOk = () => {
  loading.value = true
  setTimeout(async () => {
    const { stackId } = await delCluster({
      stackId: Number(clusterInfo.stackId),
    })
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('on-delete', clusterInfo)
    if (stackId >= 0) {
      open.value = false
    }
    loading.value = false
  }, 1000)
}

const setChildClusterInfo = (info: any) => (clusterInfo = { ...info })
const showModal = (show: boolean) => (open.value = show)
defineExpose({ setChildClusterInfo, showModal })

const handleInput = (e: any) => {
  hasdel.value = e.target.value === clusterInfo.name
}

const $bind = computed(() => {
  return {
    width: 720,
    closable: false,
    centered: true,
    okText: 'Delete',
    cancelText: 'Cancel',
    title: 'Delete Cluster',
    okButtonProps: {
      size: 'large',
      disabled: !hasdel.value,
      danger: true,
      loading: loading.value,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})
</script>

<template>
  <a-modal v-model:open="open" v-bind="$bind" @ok="handleOk">
    <div class="space-y-4">
      <div class="mb-6 mt-4">
        <p />
        <a-alert
          type="error"
          class="mt-2"
          message="All data will be deleted permanently, this action cannot be undone."
          :show-icon="false"
        />
      </div>
      <div class="rounded-lg pb-5 space-y-2">
        <p class="mb-2">
          Please type
          <code>{{ clusterInfo.name }}</code>
          to confirm.
        </p>
        <a-input
          v-model="verificationName"
          size="large"
          placeholder="enter the name of the Cache service"
          @input="handleInput"
        />
      </div>
    </div>
  </a-modal>
</template>

<style lang="scss"></style>
