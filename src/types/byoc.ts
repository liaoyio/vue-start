/** region list  */
export interface Region {
  des: string
  name: string
}

/** get zone list by region */
export interface Zone {
  name: string
  state: string
}

/** get instance type list by prefix */
export interface InstanceType {
  /** CPU 架构: x86 or x86_64 */
  architecture: string
  /** vCPU: xx vCPUs */
  cpuVCore: number
  /** 物理机型号名称 */
  instanceType: string
  /** Memory: 128.0 GiB  */
  memGB: number
}

export interface Response<T> {
  list: T[]
}

// get vpc list
export interface VPC {
  cidrBlock: string
  id: string
  name?: string
}

// config cluster vpc
export interface Config {
  version?: string
  eksClusterId?: number
  name: string
  des: string
  region: string
  vpcId: string
  s3Bucket: string
  vpcCidrBlock: string
  clusterVersion: string
  /** CIDR 已废弃  */
  // subnetCidrBlock: string
  /** 10 -> public, 1 -> private, 0 -> private with nat */
  subnetPrivateType: 10 | 1 | 0
  vpcIndex?: number
}

// config cluster node group
export interface ConfigBody {
  eksClusterId: number
  /** 节点组列表 */
  nodeGroupList: NodeGroup[]
  /** 根据已选 zones 动态获取的可用CIDR 列表 */
  // subnetCidrBlockListForZones: string[]
}

/** 节点组 */
export interface NodeGroup {
  /** controller or worker1/worker2 */
  name: string
  /** 机器数量 */
  instanceNumber: number
  /** 可用区 */
  zoneList: string[]
  enableSpot?: boolean
  /** spot比例，eg: 20 */
  spotPercentIn100?: number
  /** 使用机型 */
  instanceType?: string
  /** 传递多个机型，如果spotPercentIn100 > 0，必须填写 */
  instanceTypeList?: string[]
}

// get stack step log list
export interface StepLogs {
  /** 滚动日志，下次请求入参 */
  lastId: number
  list: LogItem[]
  /** created(0), doing(1), success(10), fail(-1), error(-10) */
  status: number
  /** 是否终止log输出轮训 */
  isBreak: boolean
  /** eks cluster集群是否已经删除 */
  isEksClusterDeleted: boolean
  /** 删除集群时无法删除的依赖资源列表 */
  failedResourceList: {
    /** 资源类型 */
    type: string
    id: string
  }[]
}

export interface LogItem {
  /** 时间戳 */
  agentCreatedDate: string
  step: string
  /** info(0), begin(1), success(10), fail(-1), error(-10) */
  type: number
  message?: string
  createdDate: string
}

export type Bases = {
  /** 通过验证 AK/SK后返回的集群id */
  eksClusterId?: number
  /** 通过 eksClusterId 获取的region列表 */
  regions: Region[]
  /** 通过 eksClusterId & region 获取的 vpc 列表 */
  vpcList: VPC[]
  /** 通过 eksClusterId & region 获取的 zones 列表 */
  zones: string[]
  /** 当前新建集群表单中已经选择的 region */
  currentRegion: string
}

export type stackType = 0 | -1 | -10 | 10 | 100
export type stackStatus = 0 | 1 | 10 | -1 | -10

export interface Cluster {
  id: number
  name?: string
  des?: string
  cloudProvider?: string
  region?: string
  vpcId?: string
  vpcCidrBlock?: string
  subnetPrivateType?: number
  createdDate?: number
  updatedDate?: number
  /** 集群版本(k8s) */
  clusterVersion?: string
  /** 版本支持到期时间 */
  supportUntilDate?: number
  /** create(0), delete(-1), discard(-10), scale(10), upgrade(100) */
  stackType?: stackType
  /** created(0), doing(1), success(10), fail(-1), error(-10) */
  stackStatus?: stackStatus
  /** 用来删除 */
  stackId: number
  instanceRamGb?: number
  /** 当前集群的 cache 数量 */
  byocCacheNumber?: number
  mbRssTotal?: number
  /** worker节点的 cache pod 内存使用率，小数，不是百分比。*/
  ramUsed?: number
}

export interface Zones {
  cidrBlock: string
  subnetId: string
  zone: string
  instanceNum: number
}

export type NewK8s = {
  spinning: boolean
  stepsCurrent: number
  check: { ak: string; sk: string }
  config: Partial<Config>
  nodes: {
    clusterVersion: string
    zones: string[]
    nodeGroupList: NodeGroup[]
  }
}
