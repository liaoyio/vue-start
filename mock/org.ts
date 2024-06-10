import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/engula/team/list',
    method: 'get',
    response: () => {
      return {
        'list|1-3': [
          {
            'id|+1': 1,
            note: '@first',
            name: '@first',
            'starus|1': ['active', 'inactive'],
            createdDate: '@date',
          },
        ],
      }
    },
  },
  {
    url: '/engula/team/add',
    method: 'put',
    response: () => {
      return {
        id: 1007,
      }
    },
  },
  {
    url: '/engula/team/name/update',
    method: 'post',
    response: () => {
      return {
        id: 1009,
      }
    },
  },
  {
    url: '/engula/team/member/active-update',
    method: 'post',
    response: () => {
      return {
        'starus|1': ['active', 'inactive'],
      }
    },
  },
  {
    url: '/engula/team/active-update',
    method: 'post',
    response: () => {
      return {
        'starus|1': ['active', 'inactive'],
      }
    },
  },
  {
    url: '/engula/team/member/list',
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
    url: '/engula/team/one',
    method: 'get',
    response: () => {
      return {
        'id|+1': 1,
        uuid: '@guid',
        name: '@first',
        note: '@first',
        createdBy: '@date',
        'isTeamOwner|1': [true, false],
        createdDate: '@date',
      }
    },
  },
  {
    url: '/engula/team/role/list',
    method: 'get',
    response: () => {
      return {
        list: ['owner', 'member'],
      }
    },
  },
  {
    url: '/engula/team/current/change',
    method: 'get',
    response: () => {
      return {
        busiGroupId: 12,
      }
    },
  },
] as MockMethod[]
