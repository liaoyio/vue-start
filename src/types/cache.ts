export interface FeeListOrg {
  detailList: Detail[]
  summaryList: Summary[]
}

export interface Summary {
  /* 实际fee */
  fee: number
  /** 抵扣fee */
  feeMatched: number
  /** 需要支付的 fee */
  feePay: number
  /** 是否已支付 */
  isPaid: boolean
  /* 月份 */
  monthStr: string
  /** 支付时间 */
  paidDate: number
}

export interface Detail {
  cacheServiceId: number
  cacheServiceName: string
  /** 月份 */
  monthStr: string
  monthStr_en?: string
  avgMb: number
  /** 实际fee */
  fee: number
  /** 抵扣fee */
  feeMatched: number
  /** 需要支付的 fee */
  feePay: number
}

export type FeeByDayParams = { cacheServiceId?: number; monthStr?: string } | undefined

export interface FeeByDayRes {
  cacheServiceId: number
  cacheServiceName: string
  dayStr: string
  /** 实际fee */
  fee: number
  /** 抵扣fee */
  feeMatched: number
  /** 需要支付的 fee */
  feePay: number
  /** 月份 */
  monthStr: string
}

export interface ECParams {
  engineType: string
  maxMemoryMb: number
  replicaZones: string
  configParams: {
    params: {
      primaries: number
      replicas: number
    }
  }
}

/** 权限: 只读 | 读写 */
type Mode = 'ro' | 'rw'

export interface UpdateToken {
  /**  缓存实例id */
  id: string | number
  /**  权限 */
  mode: Mode
}

export interface TokenItem {
  id: number
  cacheServiceId: number
  accessToken: string
  /**  权限 */
  mode: Mode
  createdDate: number
  updatedDate: number
  show?: boolean
}

/**  查看密钥-默认隐藏 */
export interface TokenList {
  /** assToken list */
  list: TokenItem[]
}

export interface AddToken {
  byocCacheId: number
  mode: Mode
}

export interface ChartParams {
  byocCacheId?: number
  /** timestamp, eg now, use js: new Date().getTime() / 1000 */
  end?: number
  /** 可选，当shards > 1时候，用下标从0开始。 */
  shardIndex?: number
  /** timestamp, eg 5min ago, use js: new Date().getTime() / 1000 - 5 * 60 */
  start: number
  /** fixed: eg. 15s or 1m or 5m */
  step?: string
}

// (number | string)[][]
export interface Metrics {
  /** 内存使用byte */
  memory_used_bytes: any[]
  /** keys数量  */
  db_keys: any[]
  /** 客户端命令数量 */
  client_commands_total: any[]
  /** 缓存命中率 */
  hit_rate: any[]
  /** bigKey 统计  */
  big_key_count: any[]
  /** hotKey 统计 */
  hot_key_count: any[]
  /** 慢查询统计 */
  slow_command_count: any[]
}

/* type BatchConvertType<T> = {
	[P in keyof T]: (T[P] & { name: string })[keyof T[P] & keyof { name: string }]
} */
export type FMetrics = { [P in keyof Metrics]: any }

export interface Cards {
  /** 费用 */
  fee: number | string
  readBytes: number | string
  storageBytes: number | string
  writeBytes: number | string
}

export interface ChartRes extends Metrics, Cards {
  [index: string]: any
}

export interface IUserInfo {
  /** 是否可以创建缓存服务 */
  canCreateCacheService: boolean
  /** 当无创建 canCreateCacheService为false时，弹出的提示 */
  createCacheServiceTips: string
  /** 0/1/2 free/pro/enterprise */
  feeType: 0 | 1 | 2
  id: number
  /** 该账户是否通过邮箱验证 */
  isVerified: boolean
  /** 最后一次登入时间  */
  lastLoginTime: number
  /** 用户昵称 */
  nickname: string
  /** 用户头像 */
  picture: string
  /** 用户角色 */
  roles: string[]
  /** 是否已经订阅 Stripe 信用卡 */
  isSubscription: boolean
}

export interface Cluster {
  /** 单分片内存。单位MB，GB需要*1024 */
  maxMemoryMb: number
  /** 分片数 */
  primaries: number
  /** 副本数 */
  replicas: number
  replicaZones: any
}

export type UpdateCluster = {
  id: number | string
} & Partial<Cluster>

export interface ListVersion {
  list: { version: number; steps: Step[] }
  currentVersion: number
}

export interface Step {
  id: number
  cacheServiceId: number
  version: number
  type: string
  /** 0 -> doing / 1 -> done */
  status: number
  extendParams: ExtendParams
  createdDate: number
  updatedDate: number
}

export interface ExtendParams {
  params: {
    primaries?: number
    oldPrimaries?: number
    replicas?: number
    oldReplicas?: number
  }
}

//==================== new

export interface CacheResult {
  pageNum: number
  pageSize: number
  totalCount: number
  list: CacheList[]
  totalPage: number
  end: number
  start: number
}

export interface CacheList {
  busiGroupId?: number
  busiGroupName?: string
  eksClusterName: string
  cloudProvider?: string
  createdDate?: number
  disasterRecoveryZone: string
  id?: number
  maxMemoryMb?: number
  mbRssTotal: number
  name?: string
  orgId?: number
  /** 当status = -1时候，tips提示 */
  phase: string
  primaryZone: string
  /** 内存使用率 */
  ramUsed: number
  region?: string
  shards?: number
  /** created(0), running(1), not_ready(-1), terminated(-10) */
  status?: number
  strategy?: IStrategy
  updatedDate?: number
}

interface IStrategy {
  kb: number
  qps: number
  maxConnect: number
}

export interface RegionZone {
  cloudProvider: string
  des: string
  id: number
  name: string
  region: string
  stackId: number
  stackStatus: number
  stackType: number
  stackZones: string[]
}

export type NewCacheBody = {
  /** 产品组id */
  busiGroupId: string
  /** 描述 */
  des?: string
  /** 云厂商 */
  cloudProvider: string
  /** 可用区域 */
  region: string
  /** 跨区域灾难恢复 */
  disasterRecoveryZone: string
  /** K8S 集群 ID */
  eksClusterId?: number
  /** 最大内存 (MB) */
  maxMemoryMb: number
  /** 名称 */
  name: string
  /** 主可用区 */
  primaryZone: string
  /** VPC */
  vpcId?: string
  vpcCidrBlock?: string
  vpcIndex?: number
}
//==================== new
