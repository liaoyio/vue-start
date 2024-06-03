import { type UnwrapRef, ref } from 'vue'
import useLoading from './loading'
import type { AxiosResponse } from 'axios'

// use to fetch list
// Don't use async function. It doesn't work in async function.
// Use the bind function to add parameters
// example: useRequest(api.bind(null, {}))

/** 接口返回数据格式 */
interface ApiRes<T> {
  data: T
}

export function useRequest<T>(
  api: () => Promise<AxiosResponse<ApiRes<T>>>,
  defaultValue = [] as unknown as T,
  isLoading = true,
) {
  const { loading, setLoading } = useLoading(isLoading)
  const response = ref<T>(defaultValue)
  api()
    .then((res) => {
      response.value = res.data as unknown as UnwrapRef<T>
    })
    .finally(() => {
      setLoading(false)
    })
  return { loading, response }
}
