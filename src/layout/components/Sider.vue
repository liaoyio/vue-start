<script setup lang="ts">
import bus from '@/utils/bus'
import ThemeSwitcher from './ThemeSwitcher.vue'
import type { CSSProperties } from 'vue'

const router = useRouter()
const goTo = (name: string) => router.push({ name })
const collapsed = inject<Ref<boolean>>('collapsed')

const onSwitchOrg = (orgId: number) => {
  console.log('发布订阅 -> switchOrg', orgId)
  bus.emit('switchOrg', orgId)
}

const overlayInnerStyle: CSSProperties = {
  marginLeft: '12px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 32px',
  padding: '8px',
}

onBeforeUnmount(() => {
  // 移除订阅推送
  console.log('移除订阅推送')
  bus.off('switchOrg')
})
</script>

<template>
  <a-popover trigger="click" placement="right" :arrow="false" :overlay-inner-style="overlayInnerStyle">
    <template #content>
      <div class="w-55">
        <div>
          <div class="text-[#bbbbbb] dark:text-[#707070] text-xs font-400 px-3 my-2">Projects (click to switch)</div>

          <menu-item class="px-3 text-link"> default project </menu-item>
          <a-divider class="my-2" />

          <menu-item class="px-3">
            <div class="flex_c2">
              <SvgIcon name="setting" size="14" />
              Project Settings
            </div>
          </menu-item>
        </div>
      </div>
    </template>
    <menu-item class="h-10 m-1" :class="collapsed ? 'flex_cc' : 'pl-6'">
      <SvgIcon name="menu-project" />
      <span v-show="!collapsed" class="ml-2.5">Projects</span>
    </menu-item>
  </a-popover>

  <a-popover trigger="click" placement="right" :arrow="false" :overlay-inner-style="overlayInnerStyle">
    <template #content>
      <div class="w-55">
        <div>
          <div class="text-[#bbbbbb] dark:text-[#707070] text-xs font-400 px-3 my-2">
            Organizations (click to switch)
          </div>

          <menu-item class="px-3 text-link" @click="onSwitchOrg(12)"> YoaiL's Org </menu-item>
          <a-divider class="my-2" />

          <menu-item class="px-3" @click="goTo('OrgSettings')">
            <div class="flex_c2">
              <SvgIcon name="setting" size="14" />
              <span> Organization Settings</span>
            </div>
          </menu-item>
        </div>
      </div>
    </template>
    <menu-item class="h-10 m-1" :class="collapsed ? 'flex_cc' : 'pl-6'">
      <SvgIcon name="menu-org" />
      <span v-show="!collapsed" class="ml-2.5">Organizations</span>
    </menu-item>
  </a-popover>

  <a-popover
    trigger="click"
    placement="right"
    :arrow="false"
    :overlay-inner-style="{
      ...overlayInnerStyle,
      marginBottom: '60px',
    }"
  >
    <template #content>
      <div class="w-55">
        <div class="flex flex-col items-center p-2 gap-y-1">
          <div class="font-600 text-lg">YoaiL</div>
          <div>2417276459@qq.com</div>
        </div>
        <a-divider class="my-2" />

        <menu-item class="px-3" @click="goTo('AccountSettings')">
          <div class="flex_c2">
            <SvgIcon name="setting" size="14" />
            Account Settings
          </div>
        </menu-item>
        <menu-item class="px-3">
          <div class="flex_c2">
            <SvgIcon name="logout" size="14" />
            Logout
          </div>
        </menu-item>
      </div>
    </template>

    <menu-item class="h-10 m-1" :class="collapsed ? 'flex_cc' : 'pl-6'">
      <SvgIcon name="menu-profile" />
      <span v-show="!collapsed" class="ml-2.5">Profile</span>
    </menu-item>
  </a-popover>

  <ThemeSwitcher />

  <menu-item
    v-if="false"
    class="h-10 m-1"
    :class="collapsed ? 'flex_cc' : 'pl-6'"
    @click="() => (collapsed = !collapsed)"
  >
    <SvgIcon :name="collapsed ? 'sider-menu-open' : 'sider-menu-close'" />
  </menu-item>
</template>

<style lang="scss"></style>
