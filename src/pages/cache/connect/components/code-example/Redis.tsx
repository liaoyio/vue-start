import { Alert } from 'ant-design-vue'
import { cacheStore } from '@/store'
import CodePen from './_hljs'
import type { CacheDetail } from '@/api'

export default defineComponent({
  setup() {
    const store = cacheStore()
    const cache = inject<Ref<CacheDetail>>('mtCache')

    const code = computed(() => `redis-cli -u redis://default:**********@${cache?.value.host}:${store.port}`)

    return () => (
      <div class="space-y-6 mt-1">
        <CodePen code={code.value} />
        <Alert
          message={
            <div>
              redis-cli supports TLS starting with version 6. If you are using version 5 or earlier, you should use{' '}
              <a class="link" href="https://www.stunnel.org/" role="link" target="_blank" rel="noopener noreferrer">
                <span class="mr-0.5">Stunnel</span>
                <span>
                  <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" class="icon_root !text-base">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                  </svg>
                </span>
              </a>
              to establish a secure connection to the TLS enabled database{' '}
              <a
                class="link"
                href="https://www.digitalocean.com/community/tutorials/how-to-connect-to-managed-redis-over-tls-with-stunnel-and-redis-cli"
                role="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" class="icon_root !text-base">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                  </svg>
                </span>
              </a>
            </div>
          }
          type="warning"
        ></Alert>
      </div>
    )
  },
})
