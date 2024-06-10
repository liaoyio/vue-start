<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <div class="flex-1 overflow-x-hidden">
    <div class="overflow-x-hidden h-full">
      <div class="flex flex-wrap justify-start items-stretch absolute size-full">
        <div class="left bg-[#fdfdfd] dark:bg-[#171717]">
          <header class="!h-14 flex items-center">
            <h3>{{ title }}</h3>
          </header>
          <div class="box">
            <main>
              <slot />
            </main>
          </div>
        </div>
        <div class="right">
          <slot name="right" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.left {
  flex: 0 0 60%;
  max-width: 60%;
  max-height: 100%;
  overflow-y: auto;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding-right: 24px;
    padding-left: 24px;
    height: 56px;
  }

  .box {
    flex: 1;
    padding: 16px 24px 96px;

    main {
      margin-left: 20px;
      margin-right: 20px;
    }
  }
}

.right {
  flex: 0 0 40%;
  flex-shrink: 0;
  max-width: 40%;
  position: relative;
  background: rgb(249, 249, 249);

  padding: 24px 24px 80px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
