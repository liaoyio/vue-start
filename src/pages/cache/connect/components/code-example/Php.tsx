import { cacheStore } from '@/store'
import CodePen from './_hljs'
import type { CacheDetail } from '@/api'

export default defineComponent({
  setup() {
    const store = cacheStore()
    const cache = inject<Ref<CacheDetail>>('mtCache')
    const predis_code = computed(
      () => `$client = new PredisClient(
		[
			'host'   => '${cache?.value?.host}',
			'password' => **********,
			'port'   => '${store.port}',
			'scheme' => tcp,
		]
);

$client->set("foo", "bar");
print_r($client->get("foo"));`,
    )

    const phpredis_code = computed(
      () => `$redis = new Redis();
$redis->connect('${cache?.value?.host}', ${store.port});
$redis->auth('**********');

$redis->set("foo", "bar");
print_r($redis->get("foo"));`,
    )

    return () => (
      <div class="space-y-6 mt-1">
        <div>
          <p class="mb-3">
            Library:{' '}
            <a
              class="text-[#1677ff] hover:opacity-60"
              href="https://github.com/predis/predis"
              role="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="mr-0.5"> predis </span>
              <span>
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" class="icon_root !text-base">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                </svg>
              </span>
            </a>
          </p>
          <CodePen code={predis_code.value} />
        </div>

        <div>
          <p class="mb-3">
            Library:{' '}
            <a
              class="link hover:opacity-60"
              href="https://github.com/phpredis/phpredis"
              role="link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="mr-0.5"> phpredis </span>
              <span>
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" class="icon_root !text-base">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path>
                </svg>
              </span>
            </a>
          </p>
          <CodePen code={phpredis_code.value} />
        </div>
      </div>
    )
  },
})
