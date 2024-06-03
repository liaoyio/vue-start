import { cacheStore } from '@/store'
import CodePen from './_hljs'
import type { CacheDetail } from '@/api'

export default defineComponent({
  setup() {
    const store = cacheStore()
    const cache = inject<Ref<CacheDetail>>('mtCache')

    const code = computed(
      () => `docker run -it redis:alpine redis-cli -u redis://default:**********@${cache?.value?.host}:${store.port}`,
    )

    return () => (
      <div class="mt-1">
        <CodePen code={code.value} />
      </div>
    )
  },
})
