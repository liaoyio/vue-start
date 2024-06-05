<script setup lang="tsx">
import { CheckCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue'

const props = defineProps({
  status: { type: Number },
  stackType: { type: Number },
  stackStatus: { type: Number },
})

/* const statusMap: Record<string, string> = {
  '0': 'Creating',
  '1': 'Running',
  '-1': 'Deleting',
  '-10': 'Terminated',
  '-100': 'Discarded'
} */

/**
 * stackStatus:
 ---- created(0), doing(1), success(10), fail(-1), error(-10)
 * stackType:
 ---- create(0), delete(-1), discard(-10), scale(10), upgrade(100)
 *
 */
const isCreated = computed(() => props.stackStatus === 0 || props.stackStatus === 1)
const isError = computed(() => props.stackStatus === -1 || props.stackStatus === -10)
const isSuccess = computed(() => props.stackStatus === 10)
</script>

<template>
  <div v-if="!status" class="text-[14px]">
    <template v-if="stackType === 0">
      <span v-if="isCreated" class="flex_1.5"> <IconLoadingLoop style="color: #0065fd" /> Creating </span>
      <span v-if="isSuccess" class="flex_c1.5">
        <CheckCircleOutlined style="color: #16a34a" />
        Running
      </span>
      <span v-if="isError" class="flex_c1.5">
        <ExclamationCircleFilled style="color: #ff4d4f" />
        Created Failed
      </span>
    </template>

    <template v-if="stackType === 10">
      <span v-if="isCreated" class="flex_c1.5"> <IconLoadingLoop style="color: #0065fd" /> scaling </span>
      <span v-if="isSuccess" class="flex_c1.5">
        <CheckCircleOutlined style="color: #16a34a" />
        Running
      </span>
      <span v-if="isError" class="flex_c1.5">
        <ExclamationCircleFilled style="color: #ff4d4f" />
        Scale Failed
      </span>
    </template>

    <template v-if="stackType === -1">
      <span v-if="isCreated" class="flex_c1.5 text-[#f16538]">
        <IconLoadingLoop style="color: #f16538" /> Deleting
      </span>
      <span v-if="isSuccess" class="flex_c text-[#ff4d4f]"> Deleted </span>
      <span v-if="isError" class="flex_c 1.5">
        <ExclamationCircleFilled style="color: #ff4d4f" />
        Delete Failed
      </span>
    </template>
  </div>

  <div v-else class="flex_c2">
    <span v-if="status === 0" class="flex_c1.5"> <IconLoadingLoop style="color: #0065fd" /> Creating </span>

    <span v-if="status === 1" class="flex_c1.5">
      <CheckCircleOutlined style="color: #16a34a" />
      Running
    </span>

    <span v-if="status === 20" class="flex_c1.5">
      <ExclamationCircleFilled style="color: #ff4d4f" />
      Limited
    </span>

    <span v-if="status === -1" class="flex_c1.5">
      <ExclamationCircleFilled style="color: #f16538" />
      Stopped
    </span>

    <span v-if="status === -10" class="flex_c1.5">
      <ExclamationCircleFilled style="color: #f16538" />
      Terminated
    </span>

    <span v-if="status === 100" class="flex_c1.5">
      <ExclamationCircleFilled style="color: #ff4d4f" />
      Reject
    </span>
  </div>
</template>
