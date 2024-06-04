<script setup lang="ts">
import updateProjectModal from './components/undate.vue'
import inviteUserModal from './components/invite-user.vue'

const addRef = ref<InstanceType<typeof updateProjectModal>>()
const inviteRef = ref<InstanceType<typeof inviteUserModal>>()

const onUpdate = (data: any) => {
  console.log(data)
}

const onRename = (record: any) => {
  addRef.value?.open({ type: 'update', data: { name: record.name, id: record.id } })
}

const dataSource = ref([
  {
    id: 1,
    name: 'default project',
    createAt: '2024-05-25 12:42:55',
    clusterNum: 1,
    userNum: 1,
    cmek: 'Disabled',
  },
  {
    id: 2,
    name: 'Web project',
    createAt: '2024-05-21 08:42:55',
    clusterNum: 2,
    userNum: 3,
    cmek: '-',
  },
  {
    id: 3,
    name: 'dev project',
    createAt: '2024-05-20 11:42:55',
    clusterNum: 8,
    userNum: 2,
    cmek: 'Disabled',
  },
])

const columns = [
  {
    title: 'Project ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Project Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Creation Time',
    dataIndex: 'createAt',
    key: 'createAt',
  },
  {
    title: 'Caches',
    dataIndex: 'clusterNum',
    key: 'clusterNum',
  },
  {
    title: 'Users ',
    dataIndex: 'userNum',
    key: 'userNum',
  },
  {
    title: 'CMEK',
    dataIndex: 'cmek',
    key: 'cmek',
  },
  {
    title: 'Actions',
    key: 'action',
  },
]
</script>

<template>
  <main class="">
    <header class="mt-header my-4">
      <h3>Projects</h3>
      <a-button type="primary" @click="addRef?.open({ type: 'add' })">Create New Project</a-button>
    </header>
    <section px="6" py="2">
      <a-table :data-source="dataSource" :columns="columns" :pagination="{ hideOnSinglePage: true }">
        <template #bodyCell="{ column, record, text }">
          <template v-if="column.key === 'name'">
            <a class="ac-link" @click="$router.push({ name: 'MontCache' })">{{ text }}</a>
          </template>

          <template v-if="column.key === 'action'">
            <div class="flex gap-5">
              <a class="link" @click="onRename(record)">Rename</a>
              <a class="link" @click="inviteRef?.open(record)">Invite</a>
            </div>
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
