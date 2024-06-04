<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue'
import InviteByOrg from './invite.vue'
import InviteByProject from './invite-user.vue'
const { token } = theme.useToken()

const orgRef = ref<InstanceType<typeof InviteByOrg>>()
const projectRef = ref<InstanceType<typeof InviteByProject>>()

const onInvite = () => {
  if (filterState.by === 'By Project') {
    projectRef.value?.open('')
  } else {
    orgRef.value?.open()
  }
}
const filterState = reactive({
  by: 'By Organization',
  userName: '',
  projectName: 'default project',
})

const dataSource = ref([
  {
    id: 1,
    email: 'a2417276458@gmail.com',
    role: 'Organization Member',
    createAt: '2024-05-25 12:42:55',
    status: 'ACTIVE',
    lastLoginAt: '2024-05-25 12:42:55',
  },
  {
    id: 2,
    email: 'szy2012@gmail.com',
    role: 'Organization Billing Admin',
    createAt: '2024-05-25 12:42:55',
    status: 'ACTIVE',
    lastLoginAt: '2024-05-25 12:42:55',
  },
  {
    id: 3,
    email: 'liaoyi2016@163.com',
    role: 'Organization Member',
    createAt: '2024-05-25 12:42:55',
    status: 'PENDING',
    lastLoginAt: '2024-05-25 12:42:55',
  },
])

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
    dataIndex: 'createAt',
    key: 'createAt',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Last Login Time',
    dataIndex: 'lastLoginAt',
    key: 'lastLoginAt',
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
            :options="['By Organization', 'By Project']"
          />

          <a-select
            v-show="filterState.by === 'By Project'"
            v-model:value="filterState.projectName"
            size="large"
            class="w-[224px]"
          >
            <a-select-option v-for="it in ['default project']" :key="it" :value="it">{{ it }}</a-select-option>
            <template #suffixIcon>
              <SvgIcon name="select-suffix" />
            </template>
          </a-select>

          <a-input v-model:value="filterState.userName" size="large" class="w-[224px]" placeholder="Search User">
            <template #suffix>
              <SearchOutlined :style="{ color: token.colorIcon }" />
            </template>
          </a-input>
        </div>
      </div>

      <a-table :data-source="dataSource" :columns="columns" :pagination="{ hideOnSinglePage: true }">
        <template #bodyCell="{ column }">
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
