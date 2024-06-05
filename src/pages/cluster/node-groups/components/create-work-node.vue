<script lang="ts" setup>
import { ref } from 'vue'
import { InstanceType } from '@/types/byoc'
import { MultipleSelect } from '@/components/tools'
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance } from 'ant-design-vue'

type Params = { eksClusterId: number | string; region: string }

type State = {
  nodeGroupName?: string
  zone?: string
  instanceNumber?: number
  spotPercentIn100?: number
  instanceType?: string
  instanceTypeList?: string[]
}

const open = ref<boolean>(false)
const enableSpot = ref<boolean>(false)
const editFormRef = ref<FormInstance>()

const formState = reactive<State>({
  instanceNumber: 1,
  instanceType: '',
  instanceTypeList: [],
})

const zones = ref<string[]>()
const params = reactive<Params>({ eksClusterId: '', region: '' })
const emit = defineEmits(['confirm'])

const handleOk = () => {
  editFormRef.value?.validateFields().then((values) => {
    emit('confirm', {
      ...values,
      isNewNodeGroup: true,
      isWorker: true,
    })
    editFormRef.value?.resetFields()
    open.value = false
  })
}

const initZones = async () => {
  const res = await getZones(params)
  if (res.list.length) {
    zones.value = res.list.map((it) => it.name) ?? []
  }
}

const modalInit = async ({ clusterId, region }: any) => {
  params.eksClusterId = clusterId
  params.region = region
  open.value = true
  await initZones()
}

const rules: Record<string, Rule[]> = {
  nodeGroupName: [{ required: true, message: 'Please enter node group name.' }],
  instanceNumber: [{ required: false, message: 'please enter num' }],
  instanceType: [{ required: true, message: 'please choose instanceType' }],
  instanceTypeList: [
    { required: true, message: 'please choose instanceType' },
    { type: 'array', min: 1, message: 'please choose instanceType' },
  ],
  zone: [{ required: true, message: 'Please choose the zones' }],
}

const marks = ref<Record<number, any>>({
  0: '0',
  5: '5%',
  10: '10%',
  15: '15%',
  20: '20%',
})

defineExpose({ open, modalInit })
</script>

<template>
  <a-drawer
    v-model:open="open"
    name="form_in_drawer"
    :body-style="{ paddingBottom: '80px' }"
    :width="750"
    :footer-style="{ textAlign: 'right' }"
    @close="open = false"
  >
    <a-form ref="editFormRef" size="large" :model="formState" layout="vertical" :rules="rules">
      <a-form-item label="Node Group Name" name="nodeGroupName">
        <a-input v-model:value="formState.nodeGroupName" placeholder="Node Group Name." />
      </a-form-item>

      <a-form-item label="Zone" name="zone">
        <a-select v-model:value="formState.zone" placeholder="Please select zone.">
          <a-select-option v-for="(item, index) in zones" :key="index" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="Instance Number"
        name="instanceNumber"
        :rules="[{ required: true, message: 'Please input current nodes' }]"
      >
        <a-input-number v-model:value="formState.instanceNumber" :min="1" :max="100" style="width: 100%" />
      </a-form-item>

      <a-form-item label="Enable Spot" class="pb-6">
        <template #help>
          <span>enable spot hybrid instances to run your cluster at a lower cost.</span>
        </template>
        <a-switch v-model:checked="enableSpot" class="mb-2" />
      </a-form-item>

      <template v-if="enableSpot">
        <a-form-item
          label="Spot max percentage"
          name="spotPercentIn100"
          :rules="[{ required: enableSpot, message: 'Must be greater than 0' }]"
        >
          <a-slider
            v-model:value="formState.spotPercentIn100"
            :min="0"
            :max="20"
            :marks="marks"
            :tip-formatter="(value: String) => `${value}%`"
            :step="1"
            style="width: 96%; margin-bottom: 24px"
          />
        </a-form-item>

        <a-form-item label="Instance Type" name="instanceTypeList">
          <MultipleSelect v-model="formState.instanceTypeList" :region="params.region" :multiple="true" />
        </a-form-item>
      </template>

      <a-form-item v-else label="Instance Type" name="instanceType">
        <MultipleSelect v-model="formState.instanceType" :region="params.region" />
      </a-form-item>
    </a-form>

    <template #footer>
      <div class="flex flex-row-reverse gap-4 py-4">
        <a-button key="submit" size="large" type="primary" @click="handleOk">OK</a-button>
        <a-button key="back" size="large" @click="open = val">Cancel</a-button>
      </div>
    </template>
  </a-drawer>
</template>

<style lang="scss" scoped>
::v-deep(.ant-collapse-header) {
  padding: 10px !important;
  background: #f7f9fe;
  border-radius: 6px !important;
}

::v-deep(.ant-collapse-content-box) {
  padding: 12px 0 !important;
}

#yi-r-groups {
  .ant-radio-group {
    margin: -4px;

    .yi-r-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-width: 120px;
      min-height: 45px;
      margin: 6px;
      padding: 0px 8px;
      color: rgb(32, 45, 64);
      border: 1px solid rgb(223, 229, 240);
      border-radius: 8px;
      padding: 12px;

      &:not(.ant-radio-button-wrapper-disabled):hover {
        color: rgb(76, 87, 108);
        background-color: rgb(247, 249, 254);
      }

      &.ant-radio-button-wrapper:not(:first-child)::before {
        display: hidden !important;
        background-color: transparent;
        padding-block: 0 !important;
      }

      &.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
        border-color: rgb(0, 101, 253);
      }

      &.ant-radio-button-wrapper-checked {
        color: rgb(0, 101, 253);
        background-color: rgb(255, 255, 255);
      }
    }
  }
}
</style>
