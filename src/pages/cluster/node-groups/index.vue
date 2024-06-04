<script lang="ts" setup>
const activeRoute = ref('Worker')
const route = useRoute()
const router = useRouter()

watch(
  () => route.name,
  ($new) => {
    activeRoute.value = $new as string
  },
  { immediate: true },
)

const tabClick = (key: any) => {
  activeRoute.value = key as string
  router.push({ name: key as string })
}
</script>

<template>
  <main>
    <header class="mt-header my-2">
      <h3 class="block">Node Groups</h3>
    </header>
    <section px="6" py="2" class="flex flex-col gap-y-8">
      <a-tabs v-model:activeKey="activeRoute" @tab-click="tabClick">
        <a-tab-pane key="Worker" tab="Works" />
        <a-tab-pane key="Proxy" tab="Proxy" />
        <a-tab-pane key="Controller" tab="Controller" />
      </a-tabs>
      <router-view />
    </section>
  </main>
</template>
