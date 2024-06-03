<script setup lang="ts">
import { type Message, Terminal } from 'vue-web-terminal'
import { useRoute } from 'vue-router'
import { xmtApi } from '@/api'

// const { data, loading } = useRequest(cacheOne)
// const store = cacheStore()
// const port = computed(() => store.port as string)
const route = useRoute()

const initLog: Message[] = [
  {
    type: 'normal',
    content: "<span class='cmd-init-title'>Welcome to Montplex CLI.</span>",
  },
]

function onExecCmd(
  key: string,
  command: any,
  success: (arg0: { type: string; class?: string; tag?: string; content: any }) => void,
  failed: (arg0: string) => void,
) {
  if (key === 'fail') {
    failed('Something wrong!!!')
  } else {
    xmtApi({ byocCacheId: route.params.id as any, command }).then((res) => {
      success({
        type: 'success',
        class: 'success',
        tag: '',
        content: JSON.stringify(res),
      })
    })
  }
}
</script>

<template>
  <main>
    <header class="mt-header my-4">
      <h3>Terminal</h3>
    </header>
    <section px="6" py="2" class="">
      <div class="w-full flex flex-col rounded-lg bg-[#191b24] py-4 font-mono text-gray-100">
        <div id="tmi">
          <Terminal
            name="my-terminal"
            :show-header="false"
            title="liaoyi"
            context="➜"
            :init-log="initLog"
            @exec-cmd="onExecCmd"
          >
            <template #header>
              <div class="flex items-center justify-between" />
            </template>
          </Terminal>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
#tmi {
  font-family: 'Inter', sans-serif;
  width: 100%;
  height: 400px;

  .t-container {
    font-family: 'Inter', sans-serif;
    border-radius: 8px !important;
    box-shadow: none !important;
  }

  .t-disable-select > span:nth-child(2) {
    display: none;
  }

  .t-log-box {
    font-size: 16px !important;
    -webkit-margin-after: 4px;
    -webkit-margin-before: 4px;
  }

  .t-content-normal {
    font-size: 16px !important;
  }

  .t-cmd-line {
    font-size: 16px;

    .t-cmd-line-content {
      &::before {
        margin-right: 0;
      }

      font-size: 16px;
    }
  }

  .cmd-init-title {
    font-size: 16px;
    font-family: 'Inter', sans-serif;
    color: rgb(12, 166, 242);
  }

  .t-window .cursor {
    background-color: rgb(12, 166, 242);
    animation: cursor-flash 1.5s infinite;
    width: 3px !important;
    height: 100% !important;
    margin-top: 0 !important;
    margin-left: 4px !important;
  }

  .t-cmd-key {
    margin-left: 4px !important;
  }
}

::v-deep {
  .t-window {
    font-family: 'Inter', sans-serif !important;
  }
}
</style>
