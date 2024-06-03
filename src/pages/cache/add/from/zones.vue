<script setup lang="ts">
import { useVModels } from '@vueuse/core'

const props = defineProps<{
  primaryZone?: string
  disasterRecoveryZone?: string
  zoneList: string[]
}>()

const diffZones = computed(() => props.zoneList?.filter((it) => primaryZone?.value !== it))

const emit = defineEmits(['update:primaryZone', 'update:disasterRecoveryZone'])
const { primaryZone, disasterRecoveryZone } = useVModels(props, emit)

watch(
  () => primaryZone?.value,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      // disasterRecoveryZone.value = diffZones.value?.[0]
      disasterRecoveryZone!.value = ''
    }
  },
)
</script>

<template>
  <a-form-item label="Primary Zone" name="primaryZone" :rules="[{ required: true, message: 'Please select zone!' }]">
    <a-select v-model:value="primaryZone" size="large" style="width: 560px" placeholder="Please Select Primary Zone.">
      <a-select-option v-for="(item, index) in zoneList" :key="index" :value="item">
        {{ item }}
      </a-select-option>
    </a-select>
  </a-form-item>

  <!-- :rules="[{ required: true, message: 'Please select DR zone!' }]" -->
  <a-form-item
    label="DR Zone"
    name="disasterRecoveryZone"
    help="Select backup availability zones to support disaster recovery."
  >
    <a-select
      v-model:value="disasterRecoveryZone"
      size="large"
      style="width: 560px"
      placeholder="Please Select DR Zone."
      :rules="[{ required: false }]"
    >
      <a-select-option v-for="(item, index) in diffZones" :key="index" :value="item">
        {{ item }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>

<style lang="scss" scoped>
::v-deep(.ant-select-selector) {
  width: 560px;
  // height: 36px !important;
  // line-height: 36px !important;
  border-radius: 8px;
}
</style>
