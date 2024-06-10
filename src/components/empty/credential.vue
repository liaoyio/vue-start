<script setup lang="ts">
defineOptions({ name: 'EmptyCredential' })
</script>

<template>
  <a-empty
    image="/empty.svg"
    class="my-8"
    :image-style="{
      height: '90px',
      marginBottom: '8px',
      opacity: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }"
  >
    <template #description>
      <div class="flex flex-col gap-8 mt-8">
        <h3>No security credentials</h3>
        <div>
          <a-button
            type="primary"
            size="large"
            style="font-size: 14px"
            @click="$router.push({ name: 'OrgSecurityAdd' })"
          >
            Add credential
          </a-button>
        </div>
      </div>
    </template>
  </a-empty>
</template>
