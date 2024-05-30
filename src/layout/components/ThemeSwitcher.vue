<script setup lang="ts">
import { useAppStore } from '@/store'

const app = useAppStore()
const collapsed = inject<Ref<boolean>>('collapsed')

const switchTheme = (mode: 'light' | 'dark' | 'auto') => {
  app.themeswitcher(mode)
}

defineProps({ autoMode: { type: Boolean, default: false } })

const switchMode = () => {
  app.toggleTheme()
}
</script>

<template>
  <menu-item v-if="!autoMode" class="h-10 m-1" :class="collapsed ? 'flex_cc' : 'pl-6'" @click="switchMode">
    <SvgIcon :name="app.theme === 'dark' ? 'mode-dark' : 'mode-light'" />
  </menu-item>

  <template v-else>
    <menu-item v-if="collapsed" class="h-10 m-1" :class="collapsed ? 'flex_cc' : 'pl-6'">
      <SvgIcon :name="app.mode === 'auto' ? 'mode-system' : app.mode === 'dark' ? 'mode-dark' : 'mode-light'" />
    </menu-item>
    <div v-else class="switcher-box m-1">
      <div @click="switchTheme('light')">
        <span class="mode-icon" :class="[{ mark: app.mode === 'light' }]">
          <SvgIcon name="mode-light" />
        </span>
      </div>
      <div @click="switchTheme('auto')">
        <span class="mode-icon" :class="[{ mark: app.mode === 'auto' }]">
          <SvgIcon name="mode-system" />
        </span>
      </div>
      <div @click="switchTheme('dark')">
        <span class="mode-icon" :class="[{ mark: app.mode === 'dark' }]">
          <SvgIcon name="mode-dark" />
        </span>
      </div>
    </div>
  </template>
</template>

<style lang="scss">
.switcher-box {
  height: 40px;
  position: relative;
  display: inline-flex;
  width: auto;
  flex-direction: row;
  background-color: rgb(249, 249, 249);
  border-radius: 8px;
  overflow: hidden;
  padding: 4px;
  gap: 4px;

  & > div {
    width: 100%;
    flex: 1;
    cursor: pointer;
  }

  .mode-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .mark {
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.04) 0px 2px 4px;
    transition:
      transform 200ms ease 0s,
      width 100ms ease 0s;
    background-color: rgb(255, 255, 255);
  }
}

.dark .switcher-box {
  background-color: rgb(20, 21, 23);

  & div:first-child {
    border-right: 1px solid rgb(44, 46, 51);
  }

  .mark {
    box-shadow: none;
    background-color: rgb(44, 46, 51);
  }
}
</style>
