<script setup lang="ts">
import { useCookies } from '@vueuse/integrations/useCookies'
import { useAppStore, useOrgStore, userStore } from '@/store'
import type { CSSProperties } from 'vue'

const app = useAppStore()
const store = userStore()
const org = useOrgStore()

const switchMode = () => {
  app.toggleTheme()
}

const onOrgSwitch = (teamId: number) => {
  org.setTeamId(teamId)
}

const user = computed(() => store?.getInfo)
const orgs = computed(() => org.orgs)

const isEmail = computed(() => {
  const res =
    /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Z\\a-z-]+\.)+[A-Za-z]{2,}))$/
  return user.value?.nickname && res.test(user.value?.nickname)
})

const collapsed = inject<Ref<boolean>>('collapsed')

const overlayInnerStyle: CSSProperties = {
  marginLeft: '5px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 8px 32px',
  padding: '8px',
}

const router = useRouter()
const goTo = (name: string) => router.push({ name })
const cookies = useCookies(['Auth-Token', 'Auth-Test-User'])

const logout = () => {
  store.user = null
  localStorage.removeItem('user')
  cookies.remove('Auth-Token')
  cookies.remove('Auth-Test-User')
  if (import.meta.env.MODE === 'development') {
    router.push({ path: '/', replace: true })
  } else {
    window.location.replace(`${import.meta.env.VITE_API_URL}/engula/auth0/logout`)
  }
}
</script>

<template>
  <a-menu :nz-tooltip-title="null" style="background: transparent; border-right: none" :selectable="false">
    <a-popover trigger="click" placement="right" :arrow="false" :overlay-inner-style="overlayInnerStyle">
      <template #content>
        <div class="w-55">
          <div>
            <div class="text-[#bbbbbb] dark:text-[#707070] text-xs font-400 px-3 my-2">Projects (click to switch)</div>
            <menu-item class="px-3 text-link"> default project </menu-item>
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
        <div class="w-55">
          <div>
            <div class="text-[#bbbbbb] dark:text-[#707070] text-xs font-400 px-3 my-2">
              Organizations (click to switch)
            </div>

            <menu-item
              v-for="it in orgs"
              :key="it.id"
              :selected="it.id === org.teamId"
              class="px-3 text-link"
              @click="onOrgSwitch(it.id)"
            >
              {{ it.name }}
            </menu-item>
            <a-divider class="my-2" />

            <menu-item class="px-3" @click="$router.push({ name: 'OrgSettings' })">
              <div class="flex_c2">
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
        <div class="w-55">
          <div class="flex flex-col items-center p-2 gap-y-1">
            <div v-if="!isEmail" class="font-600 text-lg">{{ user?.nickname }}</div>
            <div v-else>{{ user?.nickname }}</div>
          </div>
          <a-divider class="my-2" />

          <menu-item class="px-3" @click="goTo('AccountSettings')">
            <div class="flex_c2">
              <SvgIcon name="setting" size="14" />
              Account Settings
            </div>
          </menu-item>
          <menu-item class="px-3" @click="logout">
            <div class="flex_c2">
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

    <a-menu-item key="4" @click="switchMode">
      <template #title>
        <span>{{ app.theme === 'dark' ? 'Switch Dark' : 'Switch Light' }}</span>
      </template>
      <template #icon>
        <SvgIcon :name="app.theme === 'dark' ? 'mode-dark' : 'mode-light'" />
      </template>
      {{ app.theme === 'dark' ? 'Dark' : 'Light' }}
    </a-menu-item>
    <a-menu-item key="5" @click="() => (collapsed = !collapsed)">
      <template #icon>
        <SvgIcon :name="collapsed ? 'sider-menu-open' : 'sider-menu-close'" />
      </template>
      <template #title>
        <span> {{ collapsed ? 'Click to expand menu' : 'Click the collapse menu' }}</span>
      </template>
      Collapse
    </a-menu-item>
  </a-menu>
</template>
