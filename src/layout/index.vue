<script setup lang="ts">
import { h } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { useAppStore } from '@/store'

import type { SelectProps } from 'ant-design-vue'

const app = useAppStore()

const value1 = ref<number>(0)
const value2 = ref<[number, number]>([20, 50])
const disabled = ref<boolean>(false)
const checked = ref<boolean>(false)

const marks = ref<Record<number, any>>({
  0: '0°C',
  26: '26°C',
  37: '37°C',
  100: {
    style: {
      color: '#f50',
    },
    label: '100°C',
  },
})
const popupScroll = () => {
  console.log('popupScroll')
}
const size = ref<SelectProps['size']>('middle')
const value_1 = ref('a1')
const value_2 = ref(['a1', 'b2'])
const value_3 = ref(['a1', 'b2'])
const options = [...Array.from({ length: 25 })].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))
</script>

<template>
  <div class="container px-7 mx-auto">
    <button class="border-none w-full bg-transparent cursor-pointer text-inherit" @click="app.toggleTheme">
      <i inline-flex i="dark:ep-moon ep-sunny" />
    </button>

    <div class="size-25 flex justify-center items-center rounded c-white bg-sky dark:bg-sky-6 el-7 el-op-100" />
    <div
      class="size-25 flex justify-center items-center rounded animated animated-bounce-in c-white bg-sky dark:bg-sky-6"
    >
      Animated
    </div>

    <a-space wrap>
      <a-button type="primary">Primary Button</a-button>
      <a-button>Default Button</a-button>
      <a-button type="dashed">Dashed Button</a-button>
      <a-button type="text">Text Button</a-button>
      <a-button type="link">Link Button</a-button>
    </a-space>

    <a-space direction="vertical">
      <a-space warp>
        <a-tooltip title="search">
          <a-button type="primary" shape="circle" :icon="h(SearchOutlined)" />
        </a-tooltip>
        <a-button type="primary" shape="circle">A</a-button>
        <a-button type="primary" :icon="h(SearchOutlined)">Search</a-button>
        <a-tooltip title="search">
          <a-button shape="circle" :icon="h(SearchOutlined)" />
        </a-tooltip>
        <a-button :icon="h(SearchOutlined)">Search</a-button>
      </a-space>
      <a-space warp>
        <a-tooltip title="search">
          <a-button shape="circle" :icon="h(SearchOutlined)" />
        </a-tooltip>
        <a-button :icon="h(SearchOutlined)">Search</a-button>
        <a-tooltip title="search">
          <a-button type="dashed" shape="circle" :icon="h(SearchOutlined)" />
        </a-tooltip>
        <a-button type="dashed" :icon="h(SearchOutlined)">Search</a-button>
        <a-button :icon="h(SearchOutlined)" href="https://www.google.com" />
      </a-space>
    </a-space>

    <div>
      <a-slider id="test" v-model:value="value1" :disabled="disabled" />
      <a-slider v-model:value="value2" range :disabled="disabled" />
      Disabled:
      <a-switch v-model:checked="disabled" size="small" />
      <a-slider v-model:value="value1" :marks="marks">
        <template #mark="{ label, point }">
          <template v-if="point === 100">
            <strong>{{ label }}</strong>
          </template>
          <template v-else>{{ label }}</template>
        </template>
      </a-slider>
    </div>

    <div>
      <a-switch v-model:checked="checked" />
      <a-radio-group v-model:value="size">
        <a-radio-button value="large">Large</a-radio-button>
        <a-radio-button value="middle">Middle</a-radio-button>
        <a-radio-button value="small">Small</a-radio-button>
      </a-radio-group>

      <br />
      <br />
      <a-space direction="vertical">
        <a-select v-model:value="value_1" :size="size" style="width: 200px" :options="options" />
        <a-select
          v-model:value="value_2"
          :options="options"
          mode="multiple"
          :size="size"
          placeholder="Please select"
          style="width: 200px"
          @popup-scroll="popupScroll"
        />
        <a-select
          v-model:value="value_3"
          :options="options"
          mode="tags"
          :size="size"
          placeholder="Please select"
          style="width: 200px"
        />
      </a-space>
    </div>
  </div>
</template>
