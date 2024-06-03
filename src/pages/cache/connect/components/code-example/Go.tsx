import { cacheStore } from '@/store'
import CodePen from './_hljs'
import type { CacheDetail } from '@/api'

export default defineComponent({
  setup() {
    const store = cacheStore()
    const cache = inject<Ref<CacheDetail>>('mtCache')
    const jedis = computed(
      () =>
        `var ctx = context.Background()
func main() {
  		opt := redis.NewClient(&redis.Options{
  		Addr:	  "${cache?.value?.host}:${store.port}",
  		Password: "**********"
  })
  client := redis.NewClient(opt)

  client.Set(ctx, "foo", "bar", 0)
  val := client.Get(ctx, "foo").Val()
  print(val)
}`,
    )

    return () => (
      <div class="space-y-6 mt-1">
        <div>
          <p class="mb-3">
            Library:{' '}
            <a
              class="link hover:opacity-60"
              href="https://github.com/redis/go-redis"
              role="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="mr-0.5"> go-redis </span>

              <span>
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" class="icon_root !text-base">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                </svg>
              </span>
            </a>
          </p>
          <CodePen code={jedis.value} />
        </div>
      </div>
    )
  },
})
