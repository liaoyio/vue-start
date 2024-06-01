import { http } from '@/utils/http'
import type * as Cache from '@/types/cache'
type Response<T> = { list: T[] }

/** 获取云厂商和区域列表 */
export const getRegionZoneList = async () => {
  return await http.get<Response<Cache.RegionZone>>({
    url: '/byoc/region-zone/list',
  })
}

export const getCacheList = (params?: {
  pageNum?: number
  keyword?: string
  cloudProvider?: string
  region?: string
  status?: string
  pageSize?: number
}) => {
  delete params!.pageSize
  return http.get<Cache.CacheResult>({
    url: '/byoc/cache/list',
    params: {
      ...params,
    },
  })
}

/** Add cache service */
export const addCacheService = (data: Cache.NewCacheBody) => {
  return http.put<{ id: number }>({
    url: '/byoc/cache/add',
    data,
  })
}

export type CacheDetail = {
  one: One
  shardInfoList: any[]
  host: string
  accessToken: string
}

export type One = {
  id: number
  uuid: string
  name: string
  des: string
  cloudProvider: string
  region: string
  busiGroupId: number
  busiGroupName: string
  status: number
  shards: number
  maxMemoryMb: number
  primaryZone: string
  disasterRecoveryZone: string
  createdDate: number
  updatedDate: number
  mbRssTotal: number
  ramUsed: number
  version?: string
}

/** get one cache detail */
export const cacheOne = (id: number) => {
  return http.get<CacheDetail>({
    url: '/byoc/cache/one',
    params: { id },
  })
}

type Rename = { id: number; name: string }

export const cacheRename = (data: Rename) => {
  return http.post<Rename>({
    url: '/byoc/cache/rename',
    data,
  })
}

/** delete cache */
export const deleteCache = (id: number) => {
  return http.delete<any>({
    url: '/byoc/cache/delete',
    params: { id },
  })
}

/** scale */
export const updateCacheShards = (data: { id: number; shards: number }) => {
  return http.post<{ id: number; shards: number }>({
    url: '/byoc/cache/one/shards/update',
    data,
  })
}

/** *  列表访问令牌z */
export const getTokenList = (byocCacheId?: number) => {
  return http.get<{ list: Cache.TokenItem[] }>({
    url: '/byoc/cache/access_token/list',
    params: { byocCacheId },
  })
}

/**
 *  添加访问令牌
 */
export const addToken = (data: Cache.AddToken) => {
  return http.put<{ accessToken: string; id: string }>({
    url: '/byoc/cache/access_token/add',
    data,
  })
}

/**
 * 删除访问令牌
 */
export const deleteToken = (id: number) => {
  return http.delete<any>({
    url: `/byoc/cache/access_token/delete`,
    params: { id },
  })
}

/**
 * 更新访问令牌
 */
export const updateToken = (params: Cache.UpdateToken) => {
  return http.post<any>({
    url: `/byoc/cache/access_token/mode/update`,
    params,
  })
}

/** 修改 Cluster 配置 */
export const updateClusterConfig = (data: Cache.UpdateCluster) => {
  return http.post<{ id?: number }>({
    url: `/cache_service/cluster/update`,
    data,
  })
}

export interface Policy {
  /** cache service id */
  id: number
  /** 下拉框选择：noeviction/allkeys-lru/allkeys-lfu/allkeys-random等 */
  value?: string | number
  key: 'maxmemory-policy' | 'maxmemory'
}

/** 更新 redis 内存驱逐策略 */
export const updateEvictionPolicy = (data: Policy) => {
  return http.post<any>({
    url: `/cache_service/config/update`,
    data,
  })
}
