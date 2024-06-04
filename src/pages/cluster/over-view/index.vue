<script setup lang="ts">
import { useRequest } from 'vue-request'
import { formatDate } from '@/utils'
import OperatingButton from './components/operating-button.vue'

const route = useRoute()
const eksClusterId = route.params.clusterId as string

const { data, loading } = useRequest(getClusterById, {
  defaultParams: [Number(eksClusterId)],
})
</script>

<template>
  <main>
    <header class="mt-header my-2">
      <h3 class="block">Overview</h3>
      <OperatingButton :info="data" />
    </header>
    <section px="6" py="2" class="flex flex-col gap-y-8">
      <a-card :loading="loading">
        <div class="flex_lr">
          <div>
            <h3>Cluster Properties</h3>
            <!-- <p class="tips mt-2">Used to identify your organization on MontCache</p> -->
          </div>
        </div>
        <!-- Name	Cluster Name Busi Group -->
        <div class="flex flex-col gap-4 mt-8">
          <ul class="bento-card">
            <li>
              <div>Name</div>
              <div>{{ data?.name }}</div>
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
              <div>{{ formatDate(data?.createdDate) }}</div>
            </li>
          </ul>
          <ul class="bento-card">
            <li>
              <div>CloudProvider</div>
              <div>{{ data?.cloudProvider }}</div>
            </li>
            <li>
              <div>Region</div>
              <div>{{ data?.region }}</div>
            </li>

            <li>
              <div>Kubernetes Version</div>
              <div>{{ data?.clusterVersion }}</div>
            </li>
            <li>
              <div>Support Type</div>
              <div>{{ formatDate(data?.supportUntilDate, 'YYYY-MM-DD') }}</div>
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
