<script setup lang="ts">
import { useRequest } from 'vue-request'
import { useOrgStore } from '@/store'
import { formatDate } from '@/utils'
import { PROJECT_COLUMNS } from '@/utils/const'
import updateProjectModal from './components/update.vue'
import inviteUserModal from './components/invite-user.vue'

const columns = ref(PROJECT_COLUMNS)

const addRef = ref<InstanceType<typeof updateProjectModal>>()
const inviteRef = ref<InstanceType<typeof inviteUserModal>>()

const orgs = useOrgStore()

const { data, refresh } = useRequest(getProjects, {
  defaultParams: [orgs.teamId!],
})

const onUpdate = () => {
  refresh()
}

const onRename = (record: any) => {
  addRef.value?.open({ type: 'update', data: { name: record.name, id: record.id } })
}
</script>

<template>
  <main class="">
    <header class="mt-header my-4">
      <h3>Projects</h3>
      <a-button v-if="data?.isTeamOwner" type="primary" @click="addRef?.open({ type: 'add' })"
        >Create New Project</a-button
      >
    </header>
    <section px="6" py="2">
      <!--
      <div class="text-[#555555] dark:text-[#c6c6c6]">
      You do not belong to any project.<br />Please contact your
      <a class="ac-link" href="/org-settings/users">administrator</a> to give you access.
    </div>
     -->
      <a-table :data-source="data?.list" :columns="columns" :pagination="{ hideOnSinglePage: true }">
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'name'">
            <a class="ac-link" @click="$router.push({ name: 'MontCache' })">{{ text }}</a>
          </template>

          <template v-if="column.key === 'note'">
            <Tooltip :title="text">
              <span class="over_text">{{ text }}</span>
            </Tooltip>
          </template>

          <template v-if="column.key === 'createdDate'">
            <Tooltip :title="text">
              <span class="over_text">{{ formatDate(text) }}</span>
            </Tooltip>
          </template>

          <template v-if="column.key === 'actions'">
            <div v-if="data?.isTeamOwner" class="flex gap-5">
              <a v-if="false" class="link" @click="onRename(record)">Rename</a>
              <a class="link" @click="inviteRef?.open(record)">Invite</a>
            </div>
            <div v-else class="">-</div>
          </template>
        </template>
      </a-table>
    </section>
  </main>
  <!-- Update Project -->
  <updateProjectModal ref="addRef" @ok="onUpdate" />
  <!-- Invite User -->
  <inviteUserModal ref="inviteRef" />
</template>

<style lang="scss">
span.over_text {
  display: inline-block;
  width: 80%;
  /* 这是单行溢出显示...的样式 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
