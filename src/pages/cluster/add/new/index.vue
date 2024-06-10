<script lang="ts" setup>
import { markRaw } from 'vue'
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { useRouteQuery } from '@vueuse/router'
import { useStorage } from '@vueuse/core'
import { BackHeader } from '@/components/ui'
import { StepBases, StepCheck, StepNodes } from './steps'
import type { ClusterBasic } from '@/types/byoc'

const current = useRouteQuery('step', '0', { transform: Number })
const query = useRouteQuery('eksClusterId', Number, { transform: Number })

const basic: Partial<ClusterBasic> = {}
const local = useStorage('mt-resources-basic-form-sate', basic)

const onCheck = (e: { eksClusterId: number }) => {
  query.value = e.eksClusterId
  current.value = 1
}

const onBasesFinish = (e: any) => {
  local.value = { ...e }
  current.value = 2
}

const onFinish = (e: any) => {
  if (e.stackId) {
    local.value = {}
  }
}

const steps = ['Security verification', 'Basic resource settings', 'Deploy Worker Node Groups']
const items = steps.map((it) => ({ title: useChangeCase(it, 'capitalCase').value }))

const componentName = computed(() => {
  switch (current.value) {
    case 0:
      return markRaw(h(StepCheck, { onFinish: onCheck }))
    case 1:
      return markRaw(h(StepBases, { onFinish: onBasesFinish }))
    case 2:
      return markRaw(h(StepNodes, { onFinish }))
    default:
      return markRaw(StepCheck)
  }
})
</script>

<template>
  <back-header title="Initialize Resources" />
  <section class="pb-12 pt-8 container md:px-10 mx-auto px-8">
    <a-steps :current="current" class="pb-8 pt-6" :items="items" :responsive="false" />
    <component :is="componentName" />
  </section>
</template>
