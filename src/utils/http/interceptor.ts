import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { Modal, message, notification } from 'ant-design-vue'
import Cookies from 'js-cookie'

function showTost(msg: unknown) {
  if (typeof msg === 'string') {
    if (msg.length <= 15) {
      message.error(msg)
    } else if (msg.length < 100) {
      notification.error({
        message: 'Request error',
        duration: 1.8,
        description: msg,
      })
    } else {
      message.error('Request error')
    }
  } else {
    message.error('Request error')
  }
}

const countDown = () => {
  let secondsToGo = 5
  const modal = Modal.warning({
    title: 'Authentication Failed',
    content: `The user account has expired and will jump to the login page in ${secondsToGo} seconds.`,
    onOk() {
      const BASE_URL = import.meta.env.VITE_API_URL
      Cookies.remove('Auth-Token')
      Cookies.remove('Auth-Test-User')
      window.location.replace(`${BASE_URL}/engula/auth0/login`)
    },
  })
  const interval = setInterval(() => {
    secondsToGo -= 1
    modal.update({
      content: `The user account has expired and will jump to the login page in ${secondsToGo} seconds.`,
    })
  }, 1000)
  setTimeout(() => {
    clearInterval(interval)
    modal.destroy()
    const BASE_URL = import.meta.env.VITE_API_URL
    Cookies.remove('Auth-Token')
    Cookies.remove('Auth-Test-User')
    window.location.replace(`${BASE_URL}/engula/auth0/login`)
  }, secondsToGo * 1000)
}

// 定义传入的拦截器接口，并且都是可以可选的。
interface IRequestInterceptors<T = AxiosResponse> {
  // 请求成功时的拦截器
  requestSuccessInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  // 请求失败时的拦截器
  requestErrorInterceptor?: (err: any) => any
  // 响应成功时的拦截器
  responseSuccessInterceptor?: (res: T) => T
  // 响应失败时的拦截器
  responseErrorInterceptor?: (err: any) => any
}

interface IRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  // 每个request实例可以不传入拦截器
  interceptors?: IRequestInterceptors<T>
  toast?: boolean
}

interface IResponseData extends AxiosResponse {
  config: IRequestConfig
}

/** 接口返回数据格式 */
/* interface ApiRes<T> {
	error?: { message: string }
	data: T
}*/

class Request {
  instance: AxiosInstance
  toast?: boolean

  constructor(config: IRequestConfig) {
    this.instance = axios.create(config)

    // 创建实例请求拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessInterceptor,
      config.interceptors?.requestErrorInterceptor,
    )

    // 创建实例响应拦截器
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessInterceptor,
      config.interceptors?.responseErrorInterceptor,
    )

    /** 请求拦截器 */
    this.instance.interceptors.request.use(
      (config: IRequestConfig) => config,
      (error) => Promise.reject(error),
    )
    /**  响应拦截器 */
    this.instance.interceptors.response.use(
      (response: IResponseData) => {
        if (response.status !== 200) {
          if (!this.toast) {
            showTost(response.data)
          }
          return Promise.reject(new Error('Error'))
        }
        // 30X
        return response.data
      },
      (error) => {
        if ([301, 302].includes(error.response?.status)) {
          countDown()
        } else if ((error.response?.data || error?.response?.status !== 200) && !this.toast) {
          showTost(error.response.data)
        }
        return Promise.reject(error)
      },
    )
  }
  /** 通用请求工具函数 */
  request<T>(config: IRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 创建单个请求的请求拦截器
      if (config.interceptors?.requestSuccessInterceptor) {
        // 直接调用，然后将处理后的config返回
        config = config.interceptors.requestSuccessInterceptor(config)
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 调用传入的响应拦截器 [单个请求对返回数据的处理]
          if (config.interceptors?.responseSuccessInterceptor) {
            res = config.interceptors.responseSuccessInterceptor(res)
          }
          resolve(res)
        })
        .catch((error) => reject(error))
    })
  }

  get<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }

  post<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }

  delete<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }

  patch<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }

  put<T>(config: IRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' })
  }
}

export default Request
