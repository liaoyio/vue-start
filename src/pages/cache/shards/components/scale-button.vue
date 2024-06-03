<script lang="ts" setup>
import { type ModalProps, message } from 'ant-design-vue'
import type { CacheDetail } from '@/api'

const loading = ref<boolean>(false)
const open = ref<boolean>(false)
const setModal = (value: boolean) => (open.value = value)

const cache = inject<Ref<CacheDetail>>('mtCache')
const totalMemory = computed(() => {
  if (cache?.value?.one.maxMemoryMb && shards.value) {
    return cache.value.one.maxMemoryMb * shards.value
  }
})

const shards = ref<number>()

const emit = defineEmits(['refresh'])

const handleCacheScale = async () => {
  if (!shards.value) return message.error('Please select the expected shards')
  loading.value = true

  try {
    await updateCacheShards({
      id: cache?.value?.one.id as number,
      shards: shards.value,
    })
    setTimeout(() => {
      message.success('Cache scaled successfully')
      emit('refresh')
      setModal(false)
    }, 400)
  } catch {
    message.error('Failed to scale cache')
  } finally {
    loading.value = false
  }
}

const options = computed(() => {
  const _shards = cache?.value?.one?.shards ?? 0
  if (_shards === 0 || _shards === 1) {
    return [{ value: 2 }]
  }
  return [{ value: _shards / 2 }, { value: _shards * 2 }]
})

const showScaleModal = () => {
  setModal(true)
}

const $bind = computed(() => {
  return {
    width: 720,
    closable: false,
    centered: true,
    okText: 'Confirm',
    title: 'Cache Scale',
    okButtonProps: {
      size: 'large',
      loading: loading.value,
      disabled: !shards.value,
    },
    cancelButtonProps: {
      size: 'large',
    },
  } as ModalProps
})
</script>

<template>
  <div>
    <a-button type="primary" :disabled="!cache?.one?.shards" @click="showScaleModal"> Scale </a-button>
    <a-modal v-model:open="open" v-bind="$bind" @ok="handleCacheScale">
      <a-card :body-style="{ padding: '12px' }" class="mt-6">
        <div class="font-500 pl-2">Basic Information</div>
        <a-divider dashed class="my-4" />

        <ul class="basic-box">
          <li>
            <h4>Name</h4>
            <p>{{ cache?.one.name }}</p>
          </li>
          <li>
            <h4>Resource</h4>
            <p>{{ cache?.one.busiGroupName }}</p>
          </li>
          <li>
            <h4>Organization Name</h4>
            <p>{{ cache?.one.busiGroupName }}</p>
          </li>
          <li>
            <h4>Total Memory</h4>
            <p>{{ cache?.one.maxMemoryMb }} MB</p>
          </li>
          <li>
            <h4>Used Memory</h4>
            <p>{{ cache?.one.mbRssTotal }} MB</p>
          </li>
          <li>
            <h4>Current Shards</h4>
            <p>{{ cache?.one.shards ?? cache?.shardInfoList?.length ?? 0 }}</p>
          </li>
        </ul>
      </a-card>

      <div class="my-6">
        <div class="font-500 pl-2">Configure the expected number of Shards.</div>

        <div class="flex flex-col gap-3 pb-4 pl-2 mt-4">
          <a-select
            v-model:value="shards"
            size="large"
            :options="options"
            :field-names="{ label: 'value', value: 'value' }"
          />
        </div>
        <div v-if="shards || totalMemory" class="pl-2">
          <span>TotalMemory:</span>
          <span>{{ totalMemory }} MB</span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.basic-box {
  display: flex;
  flex-wrap: wrap;

  li {
    flex-shrink: 0;
    flex: 0 0 33.3333%;
    padding: 8px;
    max-width: 33.3333%;

    h4 {
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 4px;
    }

    p {
      margin-top: 8px;
      opacity: 0.8;
      font-size: 14px;
    }
  }
}
</style>
