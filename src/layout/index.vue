<script setup lang="ts">
import IconCluster from '@/assets/icons/menu-cluster.svg?component'
import IconService from '@/assets/icons/menu-data-service.svg?component'
import SiderButtom from './components/Sider-Antd.vue'
import type { MenuClickEventHandler } from 'ant-design-vue/es/menu/src/interface'
const router = useRouter()

const selectedKeys = ref<string[]>([router.currentRoute.value.path.split('/')[1]])

watchEffect(() => (selectedKeys.value = [router.currentRoute.value.path.split('/')[1]]))

const collapsed = ref<boolean>(true)

const handelMenuChange: MenuClickEventHandler = ({ key }) => {
  selectedKeys.value = [key as any]
  router.push(`/${key}`)
}

const items = reactive([
  {
    key: 'cache',
    icon: () => h(IconService),
    label: 'Caches',
    title: 'Caches',
  },
  {
    key: 'cluster',
    icon: () => h(IconCluster),
    label: 'Cluster',
    title: 'Cluster',
  },
])

provide('collapsed', collapsed)
</script>

<template>
  <a-layout has-sider>
    <a-layout-sider
      v-model:collapsed="collapsed"
      :style="{
        overflow: 'hidden',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 999,
      }"
      :trigger="null"
      collapsible
      class="mt-sider px-1"
    >
      <div class="flex flex-col">
        <div flex="~ justify-center" class="my-4 h-8 gap-2 font-semibold text-lg">
          <img src="/montcache-dark.svg" alt="MontCache" class="size-6" />
          <h3 v-show="!collapsed">MontCache</h3>
        </div>
      </div>

      <div class="flex-1">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          :open-keys="['orgs', 'alert']"
          mode="inline"
          style="background: transparent; border-right: none"
          :items="items"
          @click="handelMenuChange"
        />
      </div>

      <SiderButtom />
    </a-layout-sider>

    <a-layout class="flex-1 ml-[58px]">
      <a-layout-content :style="{ overflow: 'initial', height: '100vh' }">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scoped>
.mt-sider {
  background-color: var(--sider-nav-bg);
  border-right: 1px solid var(--sider-nav-border);
  color: var(--page-text-color);
}

::v-deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
}

::v-deep(.ant-layout-sider-collapsed) {
  flex: 0 0 57px !important;
  max-width: 57px !important;
  min-width: 57px !important;
  width: 57px !important;
}
</style>
