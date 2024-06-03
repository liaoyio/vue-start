<script setup lang="ts">
defineProps({
  text: { type: String, default: '' },
  hover: { type: Boolean, default: false },
})
</script>

<template>
  <div class="use-copy group">
    <slot />
    <UseClipboard v-slot="{ copy, copied, isSupported }" :source="text">
      <a-tooltip
        v-if="isSupported"
        :title="copied ? 'Copied' : 'Copy'"
        class="opacity-100 link"
        color="#202d40"
        :overlay-inner-style="{ fontSize: '12px', color: '#fafafa' }"
      >
        <button class="copy" @click="copy()">
          <SvgIcon v-if="copied" name="copy-copied" class="opacity-0 group-hover:opacity-100" />
          <SvgIcon v-else name="copy" class="opacity-0 group-hover:opacity-100" />
        </button>
      </a-tooltip>
    </UseClipboard>
  </div>
</template>

<style lang="scss" scoped>
.use-copy {
  width: 100%;
  height: 20px;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 1s ease-in;
}

.copy {
  width: 20px;
  height: 20px;
  line-height: 20px;
  background-color: transparent;
  display: inline-block;
  color: #1677ff;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  transition: opacity 0.8s;

  svg {
    &:hover {
      opacity: 0.7;
    }

    transition: opacity 0.25s;
  }
}
</style>
