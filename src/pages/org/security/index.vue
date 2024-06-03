<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { useRequest } from 'vue-request'
import { getCredentialList } from '@/api/credential'

const { data, loading } = useRequest(getCredentialList)

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Cloud Provider',
    dataIndex: 'cloudProvider',
    key: 'cloudProvider',
  },
  {
    title: 'Ak / Assume RoleArn',
    dataIndex: 'ak',
    key: 'ak',
  },
  {
    title: 'Creation Time',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  // {
  //   title: 'Actions',
  //   key: 'action',
  // },
]
</script>

<template>
  <main>
    <header class="mt-header my-4">
      <h3>Security Credentials</h3>
      <a-button
        :disabled="loading"
        type="primary"
        class="items-center !flex"
        @click="$router.push({ name: 'OrgSecurityAdd' })"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        Add Credentials
      </a-button>
    </header>
    <section px="6" py="2">
      <a-table :loading="loading" :data-source="data?.list" :columns="columns" :pagination="{ hideOnSinglePage: true }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'ak'">
            <span> {{ record.ak ? record.ak : record.assumeRoleArn }} </span>
          </template>
        </template>
      </a-table>
    </section>
  </main>
</template>

<style lang="scss"></style>
