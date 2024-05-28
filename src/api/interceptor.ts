import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface HttpResponse<T = unknown> {
  status: number
  msg: string
  code: number
  data: T
}

if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = '/engula'
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response
    if (res.status !== 200 || res.statusText !== 'OK') {
      // Message.error({ content: 'Error', duration: 5 * 1000 })
      return Promise.reject(new Error('Error'))
    }
    return res
  },
  (error) => {
    // Message.error({ content: error.msg || 'Request Error', duration: 5 * 1000 })
    return Promise.reject(error)
  },
)
