import { http } from '@/utils/http'
import type * as BYOC from '@/types/byoc'

type Response<T> = { list: T[] }

export const getClusterList = () => {
  return http.get<Response<BYOC.Cluster>>({
    url: '/byoc/eks/cluster/list',
  })
}

export const getClusterById = (eksClusterId: number) => {
  return http.get<BYOC.Cluster>({
    url: '/byoc/eks/cluster/one',
    params: {
      eksClusterId,
    },
  })
}
export const initRegions = (params: { eksClusterId?: number }) => {
  return http.get<Response<BYOC.Region>>({
    url: '/byoc/option/region/list',
    params,
  })
}

export const getZones = (params: { eksClusterId?: number | string; region?: string }) => {
  return http.get<Response<BYOC.Zone>>({
    url: '/byoc/option/zone/list',
    params,
  })
}

type instanceRes = {
  instanceTypePrefix: string
  instanceTypeList: BYOC.InstanceType[]
}

export const getInstanceTypeList = (params: {
  /** 是否是controller node group */
  isController?: boolean
  /** 可用区域 */
  region?: string
}) => {
  return http.get<Response<instanceRes>>({
    url: '/byoc/option/instance-type/list',
    params,
  })
}

export type EksVersion = {
  id?: number
  cloudProvider?: string
  version?: string
  tips?: string
  /** 版本支持截止时间 */
  supportUntilDate?: number
  updatedDate?: number
}

export const getEksVersionList = (cloudProvider?: string) => {
  return http.get<{ list: EksVersion[] }>({
    url: '/byoc/option/eks-version/list',
    params: { cloudProvider },
  })
}

/** 验证 ek、sk */
export const credentialInit = (data: { ak: string; sk: string }) => {
  return http.put<{ eksClusterId: number }>({
    url: '/byoc/credential/init',
    data,
  })
}

export const initVpcList = (params: { eksClusterId?: number; region?: string }) => {
  return http.get<Response<BYOC.VPC>>({
    url: '/byoc/option/vpc/list',
    params,
  })
}

/** config cluster vpc */
export const setClusterVpc = (params: BYOC.Config & { vpcIndex?: number }) => {
  const data = { ...params }
  delete data.vpcIndex
  return http.post<{ eksClusterId: number }>({
    url: '/byoc/eks/cluster/config/vpc',
    data,
  })
}

/** config cluster node group */
export const setClusterNodeGroup = (data: BYOC.ConfigBody) => {
  return http.post<{ stackId: number }>({
    url: '/byoc/eks/cluster/config/node-group',
    data,
  })
}

/** cluster deploy */
export const clusterDeploy = (params: { stackId: number }) => {
  return http.get<{ stackId: number }>({
    url: '/byoc/eks/cluster/deploy',
    params,
  })
}

/** delete cluster */
export const delCluster = (params: { stackId: number }) => {
  return http.delete<{ stackId: number }>({
    url: '/byoc/eks/cluster/delete',
    params,
  })
}

export const getLogs = (params: { lastId: number; stackId: number }) => {
  return http.get<BYOC.StepLogs>({
    url: '/byoc/stack/step/log/list',
    toast: false,
    params,
  })
}

export interface NodeGroups {
  /** node cache pod数量（因为有proxy） */
  cachePodsRequested: number
  /** cpu可以分配的数量（用来tips） */
  cpuAvailableMi: number
  /** cpu请求比例，eg. 0.3 */
  cpuRequestedRate: number
  /** eks 版本 */
  eksVersion: string
  /** 如果status是Scaling，会有这个值，表示Scale之后的值 */
  expectInstanceNumber: number
  instanceNumber: number
  /** 机型 ，未开启 spot 时为单机型 */
  instanceType: string
  /** 机型列表 ，开启 spot 时为数组 */
  instanceTypeList: string[]
  /** 最小机型数 */
  maxSize: number
  /** 内存可以分配的数量（用来tips） */
  memoryAvailableMb: number
  /** 内存请求比例，eg. 0.3 */
  memoryRequestedRate: number
  /** 最大机型数 */
  minSize: number
  name: string
  /** pod申请cpu的数量（用来tips）*/
  podRequiredCpuMi: number
  /** pod申请内存的数量（用来tips） */
  podRequiredMb: number
  /**  node可以分配的pod数量（用来tips） */
  podsAvailable: number
  /** node已经分配的pod数量（用来tips） */
  podsRequested: number
  /** node pod数量比例，eg. 0.3 */
  podsRequestedRate: number
  /** spot 实例机型数量 */
  spotInstanceNumber: number
  /** 开启 spot 实例百分比 */
  spotPercentIn100: number
  /** 如果status是Creating/Scaling，stackId会>0，根据这个跳转到日志页面 */
  stackId: string
  /** Creating/Scaling/Ready */
  status: string
  /** 可用区 */
  zone: string
}

export const getEksNodeGroupResourceList = (params: {
  eksClusterId: number
  isWorker?: boolean
  isProxy?: boolean
  isController?: boolean
}) => {
  return http.get<{
    list: NodeGroups[]
  }>({
    url: '/byoc/eks-node-group/list',
    params,
  })
}

export interface ScaleBody {
  /** 集群id */
  eksClusterId: number
  /** 机型数量 */
  instanceNumber: number
  /** * 可选，如果是新创建，必须填写，controller node group */
  isController: boolean
  /** * 可选，如果是新创建就填写true */
  isNewNodeGroup: boolean
  /** * 可选，如果是新创建，必须填写，proxy node group */
  isProxy: boolean
  /** * 可选，如果是新创建，必须填写，worker node group */
  isWorker: boolean
  /** * 如果新创建controller node group，nodeGroupName固定为controller20240101100000这样的格式 */
  nodeGroupName: string
  /** * 可选，如果是新创建，而且isWorker=true，则必须填写 */
  zone: string
}

export const scaleUpNodeGroup = (data: ScaleBody) => {
  return http.post<{ stackId: number }>({
    url: '/byoc/eks-node-group/scale-up',
    data,
  })
}
/** 删除 nodegroup */
export const deleteNodeGroup = (params: { eksClusterId?: number; nodeGroupName?: string }) => {
  return http.delete<{
    stackId: number
  }>({
    url: '/byoc/eks-node-group/delete',
    params,
  })
}
