<script setup lang="ts">
import { useAppStore } from '@/store'
import type { CSSProperties } from 'vue'

const app = useAppStore()

const collapsed = inject<Ref<boolean>>('collapsed')

const overlayInnerStyle: CSSProperties = {
  marginLeft: '5px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 32px',
  padding: '8px',
}
</script>

<template>
  <a-menu :nz-tooltip-title="null" style="background: transparent; border-right: none" :selectable="false">
    <a-popover trigger="click" placement="right" :arrow="false" :overlay-inner-style="overlayInnerStyle">
      <template #content>
        <div class="w-55 font-300">
          <div>
            <div class="text-[#bbbbbb] dark:text-[#707070] text-xs font-400 px-3 my-2">Projects (click to switch)</div>

            <menu-item class="px-3 text-link"> default project </menu-item>
            <a-divider class="my-2" />

            <menu-item class="px-3">
              <div class="flex items-center gap-2 font-300">
                <SvgIcon name="setting" size="14" />
                Project Settings
              </div>
            </menu-item>
          </div>
        </div>
      </template>
      <a-menu-item key="1">
        <template #icon>
          <SvgIcon name="menu-project" />
        </template>
        Projects
      </a-menu-item>
    </a-popover>

    <a-popover trigger="click" placement="right" :arrow="false" class="ml-3" :overlay-inner-style="overlayInnerStyle">
      <template #content>
        <div class="w-55 font-300">
          <div>
            <div class="text-[#bbbbbb] dark:text-[#707070] text-xs font-400 px-3 my-2">
              Organizations (click to switch)
            </div>

            <menu-item class="px-3 text-link"> YoaiL's Org </menu-item>
            <a-divider class="my-2" />

            <menu-item class="px-3">
              <div class="flex items-center gap-2 font-300">
                <SvgIcon name="setting" size="14" />
                Organization Settings
              </div>
            </menu-item>
          </div>
        </div>
      </template>
      <a-menu-item key="2">
        <template #icon>
          <SvgIcon name="menu-org" />
        </template>
        Organizations
      </a-menu-item>
    </a-popover>

    <a-popover trigger="click" placement="right" :arrow="false" :overlay-inner-style="overlayInnerStyle">
      <template #content>
        <div class="w-55 font-300">
          <div class="flex flex-col items-center p-2 gap-y-1">
            <div class="font-600 text-lg">YoaiL</div>
            <div>2417276459@qq.com</div>
          </div>
          <a-divider class="my-2" />

          <menu-item class="px-3">
            <div class="flex items-center gap-2 font-300">
              <SvgIcon name="setting" size="14" />
              Account Settings
            </div>
          </menu-item>
          <menu-item class="px-3">
            <div class="flex items-center gap-2 font-300">
              <SvgIcon name="logout" size="14" />
              Logout
            </div>
          </menu-item>
        </div>
      </template>

      <a-menu-item key="3">
        <template #icon>
          <SvgIcon name="menu-profile" />
        </template>
        Profile
      </a-menu-item>
    </a-popover>

    <a-menu-item key="4">
      <template #icon>
        <SvgIcon :name="app.mode === 'auto' ? 'mode-system' : app.mode === 'dark' ? 'mode-dark' : 'mode-light'" />
      </template>
      Mode
    </a-menu-item>
    <a-menu-item key="5" @click="() => (collapsed = !collapsed)">
      <template #icon>
        <SvgIcon :name="collapsed ? 'sider-menu-open' : 'sider-menu-close'" />
      </template>
      {{ collapsed ? 'Click to expand menu' : 'Click the collapse menu' }}
    </a-menu-item>
  </a-menu>
</template>