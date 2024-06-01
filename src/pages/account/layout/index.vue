<script setup lang="ts">
const router = useRouter()
const activeKey = ref('AccountProfole')

const tabClick = (name: any) => {
  activeKey.value = name
  router.push({ name })
}
</script>

<template>
  <main class="relative flex-1 overflow-x-hidden">
    <header class="flex flex-row items-center justify-between gap-6 px-6 h-14">
      <h3>Account</h3>
    </header>
    <section class="px-6 pb-4">
      <a-tabs v-model:activeKey="activeKey" size="middle" @tab-click="tabClick">
        <a-tab-pane key="AccountProfole" tab="Profile" />
        <a-tab-pane key="AccountPassword" tab="Change Password" />
        <!-- <a-tab-pane key="AccountPrivacy" tab="Privacy" /> -->
      </a-tabs>
      <router-view />
    </section>
  </main>
</template>
