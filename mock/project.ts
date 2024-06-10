import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/engula/project/list',
    method: 'get',
    response: () => {
      return {
        'list|2-6': [
          {
            'id|+1': 1,
            uuid: '@guid',
            name: '@first',
            note: '@first',
            createdDate: '@date',
          },
        ],
        'isTeamOwner|1': [true, false],
      }
    },
  },
  {
    url: '/engula/project/add',
    method: 'put',
    response: () => {
      return {
        busiGroupId: 1007,
      }
    },
  },
  {
    url: '/engula/project/active-update',
    method: 'post',
    response: () => {
      return {
        'starus|1': ['active', 'inactive'],
      }
    },
  },
  {
    url: '/engula/project/member/list',
    method: 'get',
    response: () => {
      return {
        'list|2-6': [
          {
            email: '@email',
            'role|1': ['admin', 'member', 'owner'],
            'starus|1': [0, 1, -1],
            inviteDate: '@date',
            activeDate: '@date',
            lastLoginDate: '@date',
          },
        ],
      }
    },
  },
  {
    url: '/engula/project/role/list',
    method: 'get',
    response: () => {
      return {
        list: ['owner', 'member'],
      }
    },
  },
  {
    url: '/engula/project/current/change',
    method: 'get',
    response: () => {
      return {
        busiGroupId: 12,
      }
    },
  },
] as MockMethod[]
