<script setup lang="ts">
import type { ItemType, MenuProps } from 'ant-design-vue'

const activeRoute = ref<string[]>(['overview'])

const items: ItemType[] = reactive([
  {
    key: 'overview',
    label: 'Overview',
  },
  {
    key: 'shards',
    label: 'Shards',
  },
  {
    key: 'connect',
    label: 'Connect',
  },
  {
    key: 'terminal',
    label: 'Terminal',
  },
  {
    key: 'metrics',
    label: 'Metrics',
  },
  {
    key: 'token',
    label: 'Tokens',
  },
])

const handleClick: MenuProps['onClick'] = ({ key }) => {
  activeRoute.value = [key as string]
  router.replace({ name: `Cache${titleCase(key as string)}` })
}

const router = useRouter()

// const route = useRoute()
// const id = route.params.id as any

/* 监听路由变化,切换子路由页面时保持tab选中状态 */
watch(
  () => router.currentRoute.value.path,
  ($new: string) => {
    const pathStr = $new.split('/').pop()
    activeRoute.value = [pathStr as string]
    // await store.setOneCache(id)
  },
  { immediate: true },
)

console.log('🪝 Setup --> 父路由 Setup \n')
onMounted(() => {
  console.log('🪝 onMounted --> 父路由初始化 \n')
})
/* 首字母大写 */
function titleCase(str: string | undefined) {
  if (!str) return
  return str.toLowerCase().replaceAll(/( |^)[a-z]/g, (L) => L.toUpperCase())
}
</script>

<template>
  <div class="size-full">
    <div class="flex h-full translate-x-0">
      <nav class="sub-nav">
        <div class="flex-initial font-700 overflow-hidden text-ellipsis whitespace-nowrap py-4 px-4.5 line-height-6">
          <span class="text-base"> Cluster 0 </span>
        </div>
        <div class="py-1 pl-1 pr-2 flex-1 overflow-y-auto">
          <a-menu
            id="sub-nav"
            v-model:selectedKeys="activeRoute"
            mode="inline"
            :items="items"
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
