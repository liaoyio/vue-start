import Request from './interceptor'

const defaultConfig = {
  // https://dev.montplex.com
  baseURL: '/engula',
  timeout: 10000,
  showLoading: true,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
}

export const http = new Request({
  ...defaultConfig,
})
