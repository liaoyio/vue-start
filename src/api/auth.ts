import { http } from '@/utils/http'

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

export interface IUsers {
  cacheServiceNumber: number
  userNumber: number
}

/** 获取测试用户 cookie */
export const getTestUserCookie = (cookieUuid: string) => {
  return http.get<{ cookieUuid: string }>({
    url: '/auth0/test-user-require',
    params: { cookieUuid },
  })
}

export const userInfo = () => {
  return http.get<IUserInfo>({
    url: '/auth0/user',
  })
}
