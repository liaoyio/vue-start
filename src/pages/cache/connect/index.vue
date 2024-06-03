<script setup lang="ts">
import { useRequest } from 'vue-request'
import { CopyAble, Tooltip } from '@/components/tools'
import { cacheStore } from '@/store'
import CopyFullShell from './components/copy-full-shell.vue'
import { Docker, Go, Java, Node, Php, Python, Redis } from './components/code-example'

const { data, loading } = useRequest(cacheOne)
const store = cacheStore()
const port = computed(() => store.port as string)

const activeKey = ref('Redis')

const shell = computed(() => {
  return {
    code: `redis-cli -u redis://default:**********@${data.value?.host}:${port.value}`,
    full: `redis-cli -u redis://default:${data.value?.accessToken}@${data.value?.host}:${port.value}`,
  }
})

provide('mtCache', readonly(data))
</script>

<template>
  <main>
    <header class="mt-header my-4">
      <h3>Content</h3>
    </header>
    <section px="6" py="2" class="space-y-8">
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
              <div>Endpoint</div>
              <div>
                <CopyAble :text="data?.host">
                  <Tooltip :title="data?.host">
                    <span class="over_text">{{ data?.host }}</span>
                  </Tooltip>
                </CopyAble>
              </div>
            </li>
            <li>
              <div>Password</div>
              <CopyAble :text="data?.accessToken">
                <span class="font-500">•••••••••</span>
              </CopyAble>
            </li>
            <li>
              <div>Port</div>
              <div>
                <CopyAble :text="port">
                  <span class="font-500">{{ port }}</span>
                </CopyAble>
              </div>
            </li>
          </ul>
          <CopyFullShell :text="shell.full">
            <span class="font-500">{{ shell.code }}</span>
          </CopyFullShell>
        </div>
      </a-card>

      <a-card :loading="loading">
        <div>
          <h3>Connect to your cache service</h3>
          <!-- <p class="tips mt-2">Used to identify your organization on MontCache</p> -->
        </div>
        <!-- // Docker, Go, Java, Node, Php, Python, Redis -->
        <a-tabs v-model:activeKey="activeKey" size="middle" class="mt-3">
          <a-tab-pane key="Redis" tab="Redis Cli">
            <Redis />
          </a-tab-pane>
          <a-tab-pane key="Docker" tab="Docker">
            <Docker />
          </a-tab-pane>
          <a-tab-pane key="Node" tab="Node.js">
            <Node />
          </a-tab-pane>
          <a-tab-pane key="Php" tab="PHP">
            <Php />
          </a-tab-pane>
          <a-tab-pane key="Java" tab="Java">
            <Java />
          </a-tab-pane>
          <a-tab-pane key="Python" tab="Python">
            <Python />
          </a-tab-pane>
          <a-tab-pane key="Go" tab="Go">
            <Go />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.bento-card li {
  flex: 1;
  max-width: 33.3333%;

  div:nth-child(2) {
    font-size: 14px;
    margin-top: 8px;
    font-weight: 500;
    color: rgb(32, 45, 64);
    color: var(--tips-text-color);
  }
}

span.over_text {
  display: inline-block;
  width: 80%;
  /* 这是单行溢出显示...的样式 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep(.hljs) {
  border-radius: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
