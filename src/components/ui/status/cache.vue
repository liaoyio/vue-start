<script setup lang="tsx">
import { CheckCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue'
import { LoadingLoop } from '@/components/icon'
defineProps({ status: { type: Number } })
</script>

<template>
  <!-- created(0), running(1), not_ready(-1), terminated(-10) -->
  <div class="flex items-center gap-2">
    <span v-if="status === 0" class="flex_c gap-1.5"> <LoadingLoop /> Creating </span>

    <span v-if="status === 1" class="flex_c gap-1.5">
      <CheckCircleOutlined style="color: #16a34a" />
      Running
    </span>

    <span v-if="status === -1" class="flex_c gap-1.5">
      <ExclamationCircleFilled style="color: #f16538" />
      Not Ready
    </span>

    <span v-if="status === -10" class="flex_c gap-1.5">
      <ExclamationCircleFilled style="color: #f16538" />
      Terminated
    </span>
  </div>
</template>
