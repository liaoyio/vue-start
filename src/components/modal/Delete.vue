<script lang="ts" setup>
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  type: { type: String, default: 'del-cache' },
})

const open = ref<boolean>(false)
const loading = ref<boolean>(false)
defineEmits(['onDel'])

const setModal = (value: boolean) => (open.value = value)
const setLoading = (value: boolean) => (loading.value = value)
defineExpose({ setModal, setLoading })

const titleText = computed(() => {
  switch (props.type) {
    case 'del-cache':
      return 'Are you sure to delete the cache service?'
    case 'del-cluster':
      return 'Are you sure to delete the cluster?'
    default:
      return props.title
  }
})
</script>

<template>
  <a-modal v-model:open="open" :closable="false">
    <template #title>
      <span class="flex items-center gap-1.5">
        <ExclamationCircleFilled :style="{ color: 'rgb(242, 80, 80)', fontSize: '20px' }" />
        {{ titleText }}
      </span>
    </template>
    <div class="content">
      <template v-if="type">
        <p v-if="type === 'del-cache'">
          All resources and cached data of the cluster will be deleted, and the current warehouse and stored data will
          also be deleted. Are you sure you want to delete it?
        </p>
        <p v-if="type === 'del-cluster'">
          All resources and cached data of the cluster will be deleted, and the current warehouse and stored data will
          also be deleted. Are you sure you want to delete it?
        </p>
      </template>
      <slot v-else name="content" />
    </div>
    <template #footer>
      <a-button key="back" @click="open = false">Cancel</a-button>
      <a-button key="submit" :loading="loading" type="primary" danger>OK</a-button>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped>
.content {
  padding-left: 26px;
  padding-top: 2px;
  line-height: 22px;
}
</style>
