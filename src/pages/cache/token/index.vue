<script setup lang="ts">
import { Modal, message } from 'ant-design-vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import { createVNode } from 'vue'
import { useRequest } from 'vue-request'
import { NotFoundToken } from '@/components/empty'
import Item from './components/token-item'
import AddTokenButton from './components/add-token-button.vue'
import UpdateTokenModal from './components/update-token.vue'
import type { TokenItem } from '@/types/cache'

const addRef = ref<InstanceType<typeof AddTokenButton>>()
const editRef = ref<InstanceType<typeof UpdateTokenModal>>()

const route = useRoute()
const id = route.params.id as any

const { data, loading, refresh } = useRequest(getTokenList, {
  defaultParams: [id],
})

const tokenList = computed(() => {
  const list = data.value?.list.map((v) => ({
    ...v,
    show: false,
  }))
  return list as TokenItem[]
})

const delLoading = ref(false)

const hcAddOk = async (mode: 'rw' | 'ro') => {
  addRef.value?.resetForm()
  addRef.value!.loading = true
  try {
    await addToken({ byocCacheId: id, mode })
    message.success('Add Success')
    addRef.value!.open = false
    refresh()
  } catch {
    message.error('Add Failed')
  } finally {
    addRef.value!.loading = false
  }
}

const onUpdateToken = async (state: any) => {
  editRef.value!.loading = true
  try {
    await updateToken(toRaw(state))
    editRef.value!.open = false
    refresh()
    message.success('Update success', 1.5)
  } catch {
    message.error('Update failed')
  } finally {
    editRef.value!.loading = false
  }
}

const onDelete = (e: TokenItem) => {
  if (tokenList && tokenList.value?.length === 1) {
    return message.error('At least one token is required')
  }
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete ?',
      icon: createVNode(ExclamationCircleFilled),
      okText: 'delete',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      onOk() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          delLoading.value = true
          message.loading({ content: 'Deleting...', key: 'del' })
          try {
            const res = await deleteToken(e.id)
            if (res.ok) {
              resolve('ok')
            } else {
              reject('failed')
            }
            message.success({ content: 'Successfully deleted', key: 'del', duration: 1.5 })
            refresh()
          } catch {
            message.error({ content: 'Failed to delete', key: 'del', duration: 1.5 })
          } finally {
            delLoading.value = false
          }
        })
      },
    })
  }
  showDeleteConfirm()
}

const onUpdate = (e: TokenItem) => {
  console.log(e)
  editRef.value!.state! = { mode: e.mode, id: e.id }
  editRef.value!.open = true
}

const hcCreate = () => {
  addRef.value!.open = true
}
</script>

<template>
  <main>
    <header class="mt-header my-4">
      <h3>Token</h3>
      <div>
        <AddTokenButton ref="addRef" @ok="hcAddOk" />
      </div>
    </header>
    <section px="6" py="2" class="">
      <div v-if="loading" class="flex flex-col gap-8">
        <a-skeleton active />
        <a-skeleton active />
      </div>

      <template v-else>
        <div v-if="tokenList && tokenList?.length" class="flex flex-col gap-y-6">
          <Item v-for="item in tokenList" :key="item.id" :item="item" @on-delete="onDelete" @on-edit="onUpdate" />
        </div>
        <NotFoundToken v-else @btn-click="hcCreate" />
      </template>

      <UpdateTokenModal ref="editRef" @ok="onUpdateToken" />
    </section>
  </main>
</template>

<style lang="scss"></style>
