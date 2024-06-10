import { number } from 'echarts'
import { http } from '@/utils/http'

type OrgStatus = 'active' | 'inactive'

export interface OrgItem {
  createdDate: string
  id: number
  name: string
  note: string
  status: OrgStatus
}

export interface OrgDetail {
  createdBy: string
  createdDate: string
  id: number
  /** 当前用户是否为该组织的owner */
  isTeamOwner: boolean
  name: string
  note: string
  uuid: string
}

export interface Member {
  activeDate: number
  email: string
  /** 时间戳 */
  inviteDate: number
  lastLoginDate: number
  /** owner or member */
  role: 'owner' | 'member'
  /**  0 pending 1 active -1 inactive */
  status: number
}

/** 获取组织列表 */
export const getOrgList = () => {
  return http.get<{ list: OrgItem[] }>({
    url: '/team/list',
  })
}

/** 获取组织详情 */
export const getOrgDeatil = (teamId?: number) => {
  return http.get<OrgDetail>({
    url: '/team/one',
    params: { teamId },
  })
}

type OQuery = {
  teamId?: number
  /** email模糊过滤的字符串 */
  q?: string
}

/** 获取组织下的成员列表 */
export const getOrgMembers = (params: OQuery) => {
  return http.get<{ list: Member[] }>({
    url: '/team/member/list',
    params,
  })
}

type addOrgBody = { name: string; note?: string }
type updateOrgBody = addOrgBody & { teamId: number }

/** 新增一个组织 */
export const addOrg = (data: addOrgBody) => {
  return http.put<{ id?: number }>({
    url: '/team/one',
    data,
  })
}

/** 更新组织 */
export const updateOrg = (data: updateOrgBody) => {
  return http.post<{ id?: number }>({
    url: '/team/name/update',
    data,
  })
}

type upOrgStarusBody = { teamId: number; status: OrgStatus }
type upOrgMemberStarusBody = upOrgStarusBody & { targetOrgId: number }

/** 更新组织状态 */
export const updateOrgStarus = (data: upOrgStarusBody) => {
  return http.post<{ status: OrgStatus }>({
    url: '/team/active-update',
    data,
  })
}

/** 更新组织成员状态 */
export const updateOrgMemberStarus = (data: upOrgMemberStarusBody) => {
  return http.post<{ status: OrgStatus }>({
    url: '/team/member/active-update',
    data,
  })
}

export interface Project {
  createdDate: number
  id: number
  name: string
  note: string
  uuid: string
}

export interface ProjectList {
  isTeamOwner: boolean
  list: Project[]
}

/** 获取项目列表 */
export const getProjects = (teamId: number) => {
  return http.get<ProjectList>({
    url: '/project/list',
    params: { teamId },
  })
}

/** 新增一个项目 */
export const addProject = (data: updateOrgBody) => {
  return http.put<{ busiGroupId: number }>({
    url: '/project/add',
    data,
  })
}

interface upProjectStarusBody {
  /** 项目id */
  busiGroupId: number
  status: OrgStatus
}
/** 更新项目状态 */
export const updateProjectStatus = (data: upProjectStarusBody) => {
  return http.post<{ status: OrgStatus }>({
    url: '/project/active-update',
    data,
  })
}

type PQuery = {
  busiGroupId?: number
  /** email模糊过滤的字符串 */
  q?: string
}

/** 获取项目成员列表 */
export const getProjectMembers = (params: PQuery) => {
  return http.get<{ list: Member[] }>({
    url: '/project/member/list',
    params,
  })
}

/** 获取组织角色枚举列表 */
export const getOrgRoleEnumList = () => {
  return http.get<{ list: string[] }>({ url: '/team/role/list' })
}

/** 获取项目角色枚举列表 */
export const getProjectRoleEnumList = () => {
  return http.get<{ list: string[] }>({ url: '/project/role/list' })
}

/** 切换组织 */
export const changeOrg = (teamId: number) => {
  return http.get<{ list: string[] }>({ url: '/team/current/change', params: { teamId } })
}
/** 切换项目 */
export const changeProject = (busiGroupId: number) => {
  return http.get<{ list: string[] }>({ url: '/project/current/change', params: { busiGroupId } })
}
