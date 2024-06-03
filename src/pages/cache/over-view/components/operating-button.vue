<script setup lang="ts">
import { EllipsisOutlined } from '@ant-design/icons-vue'
import { type ModalProps, type PopoverProps, message } from 'ant-design-vue'
import type { CacheDetail } from '@/api'
import type { CSSProperties } from 'vue'

const renameOpen = ref(false)
const delOpen = ref(false)
const name = ref<string>('')
const oldName = ref<string>('')
const verificationName = ref<string>('')
const renameLoading = ref(false)
const delLoading = ref(false)

const route = useRoute()
const router = useRouter()

const props = defineProps({ info: { type: Object as PropType<CacheDetail> } })

const onRenameOk = async () => {
  renameLoading.value = true
  const body = { id: route.params.id as any, name: name.value }
  try {
    message.loading({ content: 'Loading...', key: 'rename' })
    await cacheRename(body)
    close()
    message.success({ content: 'Rename Success!', key: 'rename', duration: 1.5 })
  } catch {
    message.error({ content: 'Rename Failed!', key: 'rename', duration: 1.5 })
  } finally {
    renameLoading.value = false
  }
}

const onDelOk = async () => {
  delLoading.value = true
  try {
    message.loading({ content: 'Loading...', key: 'delcache' })
    const res = await deleteCache(props.info?.one.id as number)
    if (res.id) {
      setTimeout(() => {
        router.replace({ name: 'MontCache' })
        message.success({ content: 'cache deleted!', key: 'delcache', duration: 1.5 })
      }, 600)
    }
  } catch {
    message.error({ content: 'Failed to delete cache!', key: 'delcache', duration: 1.5 })
  } finally {
    delLoading.value = false
  }
}

const showModal = () => {
  renameOpen.value = true
  name.value = props.info?.one.name as string
  oldName.value = props.info?.one.name as string
}

const close = () => {
  renameOpen.value = false
  name.value = ''
  oldName.value = ''
}

const hasdel = ref(false)
const handleInput = (e: any) => (hasdel.value = e.target.value === props.info?.one.name)

defineExpose({ showModal })

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
    title: 'Rename',
    destroyOnClose: true,
    okButtonProps: {
      size: 'large',
      loading: renameLoading.value,
      disabled: !name.value || name.value === oldName.value,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})

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
  <a-popover v-bind="$popover">
    <template #content>
      <a-menu style="background: transparent; border-right: none" :selectable="false">
        <a-menu-item key="1" class="!flex !items-center" @click="showModal">
          <template #icon>
            <SvgIcon name="edit" size="18" />
          </template>
          Rename
        </a-menu-item>
        <a-menu-item key="2" class="!flex !items-center" @click="delOpen = true">
          <template #icon>
            <SvgIcon name="delete-tools" size="18" />
          </template>
          Delete
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
    <div class="my-5">
      <span class="font-500">Name</span>
      <a-input v-model:value="name" size="large" placeholder="Please enter the cache name" class="mt-2" />
      <p class="pt-3">Your connections and clients will not be affected by this change.</p>
    </div>
  </a-modal>

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
            {{ info?.one.name }}
          </code>
          in the box below.
        </div>
        <a-input v-model="verificationName" size="large" @input="handleInput" />
      </div>
    </div>
  </a-modal>
</template>
