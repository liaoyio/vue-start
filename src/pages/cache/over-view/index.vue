<script setup lang="ts">
import { useRequest } from 'vue-request'
import { formatDate } from '@/utils'
import OperatingButton from './components/operating-button.vue'

const { data, loading } = useRequest(cacheOne)
</script>

<template>
  <main>
    <header class="mt-header my-2">
      <h3 class="block">General</h3>
      <OperatingButton :info="data" />
    </header>
    <section px="6" py="2" class="flex flex-col gap-y-8">
      <a-card :loading="loading">
        <div class="flex_lr">
          <div>
            <h3>MontCache Information</h3>
            <!-- <p class="tips mt-2">Used to identify your organization on MontCache</p> -->
          </div>
        </div>
        <!-- Name	Cluster Name Busi Group -->
        <div class="flex flex-col gap-4 mt-8">
          <ul class="bento-card">
            <li>
              <div>Name</div>
              <div>{{ data?.one.name }}</div>
            </li>
            <li>
              <div>Resource</div>
              <div>Cluster-yi</div>
            </li>
            <li>
              <div>Organization Name</div>
              <div>
                <div>Yoail'Org</div>
              </div>
            </li>
            <li>
              <div>Creation Time</div>
              <div>{{ formatDate(data?.one.createdDate) }}</div>
            </li>
          </ul>
          <ul class="bento-card">
            <li>
              <div>CloudProvider</div>
              <div>{{ data?.one.cloudProvider }}</div>
            </li>
            <li>
              <div>Region</div>
              <div>{{ data?.one.region }}</div>
            </li>

            <li>
              <div>Version</div>
              <div>{{ data?.one.version }}</div>
            </li>
          </ul>
        </div>
      </a-card>
    </section>
  </main>
</template>

<style lang="scss">
.bento-card li {
  div:nth-child(2) {
    font-size: 14px;
    margin-top: 8px;
    font-weight: 500;
    color: rgb(32, 45, 64);
    color: var(--tips-text-color);
  }
}
</style>
