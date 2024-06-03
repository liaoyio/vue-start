<script setup lang="ts">
defineProps({
  text: { type: String, default: '' },
  hover: { type: Boolean, default: false },
})
</script>

<template>
  <UseClipboard v-slot="{ copy, copied, isSupported }" :source="text">
    <div class="group full-shell" @click="copy()">
      <div class="use-copy flex_cc">
        <slot />
        <a-tooltip
          v-if="isSupported"
          :title="copied ? 'Copied' : 'Copy'"
          class="opacity-100 link"
          color="#202d40"
          :overlay-inner-style="{ fontSize: '12px', color: '#fafafa' }"
        >
          <button class="copy">
            <SvgIcon v-if="copied" name="copy-copied" class="opacity-0 group-hover:opacity-100" />
            <SvgIcon v-else name="copy" class="opacity-0 group-hover:opacity-100" />
          </button>
        </a-tooltip>
      </div>
    </div>
  </UseClipboard>
</template>

<style lang="scss" scoped>
.use-copy {
  width: 100%;
  height: 20px;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
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

  svg {
    &:hover {
      opacity: 0.7;
    }

    transition: opacity 0.25s;
  }
}

.dark {
  .full-shell {
    background-color: rgba(243, 242, 242, 0.1);

    &:hover {
      background-color: rgba(235, 241, 251, 0.2);
    }
  }
}

.full-shell {
  @apply mt-6 py-4 md:-m-4;
  background-color: rgba(243, 242, 242, 0.3);
  margin-top: 12px !important;
  position: relative;
  cursor: pointer;
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;

  &:hover {
    background-color: rgba(235, 241, 251, 0.5);
  }

  span {
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
