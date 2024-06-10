<script setup lang="ts">
import { useRequest } from 'vue-request'
import { formatDate } from '@/utils'
import ActionButton from '@/components/actions/org.vue'
import { useOrgStore } from '@/store'

const orgs = useOrgStore()

const { data, loading, refresh } = useRequest(getOrgDeatil, {
  defaultParams: [orgs.teamId],
})
</script>

<template>
  <main>
    <header class="mt-header my-4">
      <h3>General</h3>
      <ActionButton v-if="data?.isTeamOwner" :info="data" @refresh="refresh" />
    </header>
    <section px="6" py="2">
      <a-card :loading="loading">
        <div class="flex_lr">
          <div>
            <h3>Organization Information</h3>
            <p class="tips mt-2">Used to identify your organization on Montplex service</p>
          </div>
        </div>

        <ul class="bento-card mt-8">
          <li>
            <div>Organization ID</div>
            <div>{{ data?.uuid }}</div>
          </li>
          <li>
            <div>Creation Time</div>
            <div>{{ formatDate(data?.createdDate) }}</div>
          </li>
          <li class="flex-50">
            <div>Organization Name</div>
            <div>
              {{ data?.name }}
            </div>
          </li>
        </ul>
      </a-card>
    </section>
  </main>
</template>

<style lang="scss">
.bento-card li {
  flex: 0 0 33.3%;
  max-width: 33.33%;

  div:nth-child(2) {
    margin-top: 16px;
    line-height: 40px;
    color: var(--tips-text-color);
  }
}
</style>
