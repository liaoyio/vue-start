import { http } from '@/utils/http'
import type { ChartParams, ChartRes, FeeByDayParams, FeeByDayRes, FeeListOrg } from '@/types/cache'

/** query metrics */
export const getChart = (params: ChartParams) => {
  return http.get<ChartRes>({
    url: `/byoc/metric/query`,
    params: {
      ...params,
      end: Date.now() / 1000,
    },
  })
}

export interface HotKeyParams {
  /** 必填 */
  cacheServiceId?: number
  /** 可选，填写true */
  viewBigKeys?: boolean
  /** 可选，填写true*/
  viewHotKeys?: boolean
  /** 可选，填写true */
  viewSlowLog?: boolean
}

export interface HotKeyRes {
  avg: number
  bgroup: string
  bid: string
  checkMillis: number
  checkThreshold: number
  count: number
  key: string
  max: number
  times: number
}

/** show Hot/Big Key view  */
export const getHotHey = (params: HotKeyParams) => {
  return http.get<HotKeyRes>({
    url: '/metric/big_hot_slow',
    params,
  })
}

/** Get Fee Org list */
export const getFeeOrgList = () => {
  return http.get<FeeListOrg>({
    url: '/fee/org/list',
  })
}

/** Get Fee list by day */
export const getFeeListByDay = (params: FeeByDayParams) => {
  return http.get<FeeByDayRes[]>({
    url: '/fee/org/detail-list-by-day',
    params,
  })
}
