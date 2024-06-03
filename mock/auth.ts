import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/engula/auth0/user',
    method: 'get',
    response: () => {
      return {
        id: 211,
        nickname: 'a2417276459@gmail.com',
        picture: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        roles: ['admin'],
        feeType: 2,
        isVerified: true,
        canCreateCacheService: true,
        lastLoginTime: 1685097892000,
        isSubscription: false,
      }
    },
  },
  {
    url: '/engula/auth0/test-user-require',
    method: 'get',
    response: () => {
      return {
        cookieUuid: 'aa5481bb-f37c-4d52-9a42-dccfe2df1f52',
      }
    },
  },
] as MockMethod[]
