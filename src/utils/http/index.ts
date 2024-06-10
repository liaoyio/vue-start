import Request from './interceptor'

const defaultConfig = {
  baseURL: '/engula',
  timeout: 10000,
  showLoading: true,
}

export const http = new Request({
  ...defaultConfig,
})
