<script setup lang="ts">
import { type ModalProps, message } from 'ant-design-vue'
import type { Cluster } from '@/types/byoc'

const delOpen = ref(false)
const delLoading = ref(false)
const verificationName = ref('')

const router = useRouter()

const props = defineProps({ info: { type: Object as PropType<Cluster> } })

const onDelOk = async () => {
  delLoading.value = true
  try {
    message.loading({ content: 'Loading...', key: 'delcluster' })
    const res = await delCluster({ stackId: props.info?.stackId as number })
    if (String(res.stackId)) {
      message.success({ content: 'cluster deleted!', key: 'delcluster', duration: 1.5 })
      router.replace({
        name: 'Logs',
        query: { stackId: res.stackId, type: 'delete' },
      })
    }
  } catch {
    message.error('Delete failed')
  } finally {
    delLoading.value = false
  }
}

const hasdel = ref(false)
const handleInput = (e: any) => (hasdel.value = e.target.value === props.info?.name)

/* const overlayInnerStyle: CSSProperties = {
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
 */
const deleteModal = computed(() => {
  return {
    width: 720,
    closable: false,
    centered: true,
    okText: 'I understand, delete it.',
    title: 'Delete Cache Service',
    destroyOnClose: true,
    okButtonProps: {
      size: 'large',
      disabled: !hasdel.value,
      loading: delLoading.value,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})
</script>

<template>
  <a-button type="primary" class="flex_c2" danger @click="delOpen = true">
    <template #icon>
      <SvgIcon name="delete-tools" size="14" />
    </template>
    Delete
  </a-button>

  <a-modal :open="delOpen" v-bind="deleteModal" @ok="onDelOk" @cancel="delOpen = false">
    <div class="space-y-4 mt-6 mb-4">
      <div class="mb-6 mt-4">
        <a-alert
          type="error"
          class="mt-2"
          message="Data recovery is not supported after deletion, and this operation cannot be undone."
          :show-icon="false"
        />
      </div>
      <div class="rounded-lg pb-5 space-y-2">
        <div class="mb-2">
          To confirm, type
          <code class="c" dir="ltr">
            {{ info?.name }}
          </code>
          in the box below.
        </div>
        <a-input v-model="verificationName" size="large" @input="handleInput" />
      </div>
    </div>
  </a-modal>
</template>
