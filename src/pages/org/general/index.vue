<script setup lang="ts">
import { list } from '@/components/ui/time-zone/data'
const utcValue = ref('')
</script>

<template>
  <main>
    <header class="mt-header my-4">
      <h3>General</h3>
    </header>
    <section px="6" py="2">
      <a-card>
        <div class="flex_lr">
          <div>
            <h3>Organization Information</h3>
            <p class="tips mt-2">Used to identify your organization on MontCache</p>
          </div>
          <div>
            <a-button type="primary">Update</a-button>
          </div>
        </div>

        <ul class="bento-card mt-8">
          <li>
            <div>Organization ID</div>
            <div>1372813089209229826</div>
          </li>
          <li>
            <div>Creation Time</div>
            <div>2024-05-25 12:42:55</div>
          </li>
          <li class="flex-50">
            <div>Organization Name *</div>
            <div>
              <a-input class="!w-full" size="large" placeholder="Organization Name" />
            </div>
          </li>
        </ul>
      </a-card>

      <a-card class="mt-6">
        <div class="flex_lr">
          <div>
            <h3>Time Zone</h3>
          </div>
          <div>
            <a-button type="primary">Update</a-button>
          </div>
        </div>

        <div class="flex_lr mt-8">
          <a-select v-model="utcValue" size="large" filterable class="w-80">
            <template v-for="item in list" :key="item.value">
              <a-select-option :label="item.value" :value="item.value" />
            </template>
          </a-select>
          <div class="flex items-center gap-1">
            <p class="tips-8">Current Time:</p>
            <p class="tips">2024-05-30 16:24:55 UTC±00:00</p>
          </div>
        </div>
      </a-card>
    </section>
  </main>
</template>

<style lang="scss">
.bento-card li {
  &:last-child {
    flex: 0 0 50%;
    max-width: 50%;
  }

  div:nth-child(2) {
    margin-top: 16px;
    line-height: 40px;
    color: var(--tips-text-color);
  }
}
</style>
