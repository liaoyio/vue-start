import { http } from '@/utils/http'

export const xmtApi = (params: { byocCacheId: number | string; command: string }) =>
  http.get<any>({ url: '/command/exe', params })

export interface ClusterMetrics {
  /** 如果 rangeType == day, 用这个 */
  dayStr?: string
  /** 如果 rangeType == hour, 用这个 */
  hourStr?: string
  /** 如果 rangeType == year, 用这个 */
  monthStr?: string
  /** cache真正使用的内存合计 */
  cacheTotalRssMb: number
  /** 该集群所有instance的总内存容量 */
  nodeMemoryTotalMb: number
  /** pod申请的内存合计 */
  podRequiredMb: number
}

export type metricsParams = {
  eksClusterId: number
  /** * hour or day or month */
  rangeType?: string
  /** * 可选，默认当天。如果rangeType = hour，需要传入，eg: 2024-04-15 */
  targetDate?: string
  /** * 可选，默认当月。如果rangeType = day，需要传入，eg: 2024-04 */
  targetMonth?: string
  /** * 可选，默认当年。如果rangeType = month，需要传入，eg: 2024 */
  targetYear?: string
}

export const getK8sMetrics = (params: metricsParams & { picker?: any }) => {
  delete params.picker
  return http.get<ClusterMetrics[]>({
    url: '/byoc/metric/cluster/memory-required',
    params,
  })
}
