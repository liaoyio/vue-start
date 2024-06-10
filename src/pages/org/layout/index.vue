<script setup lang="ts">
import { ORG_SETTING_MENUS } from '@/utils/const'
import type { MenuProps } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()

const activeRoute = ref<string[]>(['OrgGeneral'])

const handleClick: MenuProps['onClick'] = ({ key }) => {
  activeRoute.value = [key as string]
  router.replace({ name: key as string })
}

watch(
  () => route.name,
  ($new) => {
    activeRoute.value = [$new as string]
  },
  { immediate: true },
)
</script>

<template>
  <div class="size-full">
    <div class="flex h-full translate-x-0">
      <nav class="sub-nav">
        <div class="flex-initial font-700 overflow-hidden text-ellipsis whitespace-nowrap py-4 px-4.5 line-height-6">
          <span class="text-base"> YoaiL's Org </span>
        </div>
        <div class="py-1 pl-1 pr-2 flex-1 overflow-y-auto">
          <a-menu
            id="sub-nav"
            v-model:selectedKeys="activeRoute"
            mode="inline"
            :items="ORG_SETTING_MENUS"
            class="bg-transparent !border-none"
            @click="handleClick"
          />
        </div>
      </nav>
      <main class="flex-1 w-screen overflow-y-auto pl-50">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-nav {
  top: 0;
  left: 0px;
  bottom: 0px;
  z-index: 100;
  height: 100%;
  width: 200px;
  position: fixed;
  box-sizing: border-box;
  display: flex;
  padding: 0px;
  flex-direction: column;
  background-color: var(--sider-nav-bg);
  border-right: 1px solid var(--sider-nav-border);
  overflow-y: hidden;
}

::v-deep(.ant-menu-item) {
  margin: 8px 6px;
}
</style>
