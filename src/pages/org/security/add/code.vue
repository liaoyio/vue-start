<script setup lang="ts">
import { CheckOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { useClipboard } from '@vueuse/core'

import 'highlight.js/styles/atom-one-dark.css'
import HljsVue from '@highlightjs/vue-plugin'
import hljs from 'highlight.js/lib/core'
import shell from 'highlight.js/lib/languages/bash'
import javascript from 'highlight.js/lib/languages/javascript'

const HljsVueComponent = HljsVue.component

hljs.registerLanguage('shell', shell)
hljs.registerLanguage('javascript', javascript)

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  showCopy: {
    type: Boolean,
    default: true,
  },
  copySource: {
    type: String,
  },
})
const source = computed(() => (props.copySource ? props.copySource : props.code))
const { copy, copied, isSupported } = useClipboard({ source })
</script>

<template>
  <div class="rounded-lg bg-[#282c34] p-4" v-bind="$attrs">
    <div class="code-view">
      <button v-if="isSupported && showCopy" type="button" class="copy-btn" @click="copy(code)">
        <CheckOutlined v-if="copied" class="text-white" />
        <CopyOutlined v-else class="text-white" />
      </button>
      <HljsVueComponent language="js" :code="code" style="border-radius: 0.5rem" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code-view {
  position: relative;

  &:hover .copy-btn {
    opacity: 1;
  }
}

.copy-btn {
  position: absolute;
  /* 一行
		top: -6px;
		right: -6px;
	*/
  top: 0;
  right: 0;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.4s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

::v-deep(pre code.hljs) {
  padding: 0;
}
</style>
