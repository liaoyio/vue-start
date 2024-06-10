<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue'
import { useDebounceFn } from '@vueuse/core'
import { useOrgStore } from '@/store'

import InviteByOrg from './invite.vue'
import InviteByProject from './invite-user.vue'
import type { Member } from '@/api/org'

const filterState = reactive({
  by: 1,
  q: '',
  /** 项目 id */
  busiGroupId: undefined,
})

const { token } = theme.useToken()
const orgs = useOrgStore()

const orgRef = ref<InstanceType<typeof InviteByOrg>>()
const projectRef = ref<InstanceType<typeof InviteByProject>>()

const dataSource = ref<Member[]>([])

const initDataSource = async () => {
  if (filterState.by === 1) {
    const { list } = await getOrgMembers({ teamId: orgs.teamId!, q: filterState.q })
    dataSource.value = list
  } else {
    const { list } = await getProjectMembers({
      busiGroupId: filterState.busiGroupId ?? orgs.busiGroupId!,
      q: filterState.q,
    })
    dataSource.value = list
  }
}

const debouncedFn = useDebounceFn(() => {
  initDataSource()
}, 500)

const handleInput = () => {
  debouncedFn()
}

const changeBy = () => {
  initDataSource()
}

const onInvite = () => {
  if (filterState.by === 2) {
    projectRef.value?.open('')
  } else {
    orgRef.value?.open()
  }
}

initDataSource()
console.log('dataSource', dataSource)
const options = [
  { value: 1, payload: { title: 'By Organization' } },
  { value: 2, payload: { title: 'By Project' } },
]

const columns = [
  {
    title: 'User',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Invite Time',
    dataIndex: 'inviteDate',
    key: 'inviteDate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Last Login Time',
    dataIndex: 'lastLoginDate',
    key: 'lastLoginDate',
  },
  {
    title: 'Actions',
    key: 'action',
  },
]
</script>

<template>
  <main class="pb-6">
    <header class="mt-header my-4">
      <h3>Users</h3>
      <a-button type="primary" @click="onInvite">Invite</a-button>
    </header>
    <section px="6" py="2">
      <div class="mb-6">
        <div class="flex gap-3">
          <a-segmented
            v-model:value="filterState.by"
            style="font-size: 14px"
            size="large"
            class="w-[300px]"
            block
            :options="options"
            @change="changeBy"
          >
            <template #label="{ payload }">
              {{ payload.title }}
            </template>
          </a-segmented>

          <a-select
            v-show="filterState.by === 2"
            v-model:value="filterState.busiGroupId"
            size="large"
            class="w-[224px]"
          >
            <a-select-option v-for="it in orgs.projects" :key="it.id" :value="it.id">{{ it.name }}</a-select-option>
            <template #suffixIcon>
              <SvgIcon name="select-suffix" />
            </template>
          </a-select>

          <a-input
            v-model:value="filterState.q"
            size="large"
            class="w-[224px]"
            placeholder="Search User"
            @input="handleInput"
          >
            <template #suffix>
              <SearchOutlined :style="{ color: token.colorIcon }" />
            </template>
          </a-input>
        </div>
      </div>

      <a-table :data-source="dataSource" :columns="columns" :pagination="{ hideOnSinglePage: true }">
        <template #bodyCell="{ column, text }">
          <template v-if="column.key === 'status'">
            <div>
              {{ text === 1 ? 'ACTIVE' : 'INACTIVE' }}
            </div>
          </template>

          <template v-if="column.key === 'action'">
            <div class="flex gap-5">
              <span>-</span>
            </div>
          </template>
        </template>
      </a-table>
    </section>
  </main>
  <InviteByOrg ref="orgRef" />
  <InviteByProject ref="projectRef" />
</template>

<style lang="scss"></style>
