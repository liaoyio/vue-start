import { http } from '@/utils/http'

export const getItemTypeoptionList = () => {
  return http.get<{ list: string[] }>({
    url: `/dyn-config/item-type/list`,
  })
}

export interface DynConfigList {
  list: DynConfigItem[]
  pageNum: number
  totalCount: number
  totalPage: number
}

export interface DynConfigItem {
  cloudProvider: string
  id: number
  itemType: string
  /** 可以为空 */
  orgId?: number
  /** 可以为空 */
  region?: string
  updatedDate: number
  value: string
}

export interface DynConfigListQuery {
  pageNum?: number
  pageSize?: number
  /** 通过云厂商过滤 */
  cloudProvider?: string
  /** 通过 配置类型 过滤 */
  itemType?: string
  /** 通过 OrgId 过滤，暂时手工填写，不用下拉框 */
  orgIdTarget?: number
  /** 通过 region 过滤 */
  region?: string
}

export const getDynConfigList = async (params: DynConfigListQuery) => {
  return await http.get<DynConfigList>({
    url: '/dyn-config/list',
    params,
  })
}
export interface updateDynConfigBody {
  /** aws */
  cloudProvider: string
  /** 可选，修改时候必填 */
  id?: number
  /** 枚举类型，可选如下：controller_instance_type/proxy_instance_type/worker_instance_type/proxy_spot_percent */
  itemType: string
  orgIdTarget?: number
  region?: string
  value: string
}

export const updateDynConfig = (data: updateDynConfigBody) => {
  return http.post<{ id: number }>({
    url: '/dyn-config/update',
    data,
  })
}

export const deleteDynConfig = (id?: number) => {
  return http.delete<{ id: string }>({
    url: `/dyn-config/delete`,
    params: { id },
  })
}
