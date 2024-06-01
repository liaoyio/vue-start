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
  {
    url: '/engula/byoc/cache/list',
    method: 'get',
    response: () => {
      return {
        pageNum: 2,
        pageSize: 10,
        totalCount: 11,
        'list|2-10': [
          {
            'id|+1': 1,
            uuid: '@guid()',
            name: '@first',
            eksClusterName: '@first',
            des: '@cparagraph(1, 3)',
            'cloudProvider|1': ['aliyun', 'aws', 'azure'],
            region: '@region()',
            'busiGroupId|+1': 2,
            'busiGroupName|1': ['yi-busi-group', 'liao-busi-group', 'mont-busi-group'],
            //created(0), running(1), not_ready(-1), terminated(-10)
            'status|1': [0, 1, -1, -10],
            shards: '@integer(1, 16)',
            'maxMemoryMb|1': [1024, 2048, 5012],
            'primaryZone|1': ['cn-chengdu-a', 'cn-chengdu-b', 'cn-chengdu-c', 'cn-chengdu-f'],
            'disasterRecoveryZone|1': ['cn-chengdu-a', 'cn-chengdu-b', 'cn-chengdu-c', 'cn-chengdu-f'],
            createdDate: '@date',
            updatedDate: '@date',
            supportType: '@date',
            mbRssTotal: '@natural(1, 6)',
            ramUsed: '@float(1, 90)',
            'version|1': ['1.28', '1.26', '2.01', '1.03', '1.11'],
          },
        ],
        totalPage: 9,
        end: 1,
        start: 0,
      }
    },
  },
  {
    url: '/engula/byoc/region-zone/list',
    method: 'get',
    response: () => {
      return {
        list: [
          {
            id: 2,
            name: 'eks-cluster-test',
            des: '2024/3/4 17:11:26',
            cloudProvider: 'aws',
            region: 'ap-southeast-1',
            stackId: 5,
            stackType: -1,
            stackStatus: 10,
            stackZones: ['ap-southeast-1a', 'ap-southeast-1b'],
          },
          {
            id: 5,
            name: 'testk8s',
            des: '2024/3/6 11:57:25',
            cloudProvider: 'aws',
            region: 'ap-southeast-1',
            stackId: 7,
            stackType: -1,
            stackStatus: 1,
            stackZones: ['ap-southeast-1a', 'ap-southeast-1b'],
          },
          {
            id: 7,
            name: 'local-kind',
            cloudProvider: 'aliyun',
            region: 'cn-beijing',
            stackId: 8,
            stackType: 0,
            stackStatus: 10,
            stackZones: ['cn-beijing-l', 'cn-beijing-k'],
          },
        ],
      }
    },
  },

  {
    url: '/engula/byoc/cache/add',
    method: 'put',
    response: () => {
      return {
        id: 13,
        accessToken: 'et ut fugiat ipsum Lorem',
      }
    },
  },
  {
    url: '/engula/byoc/cache/one',
    method: 'get',
    response: () => {
      return {
        one: {
          id: 2,
          uuid: '4fa5a3fc-e9b9-4ade-b111-ebcd5804d8de',
          name: 'test-yi',
          des: '',
          cloudProvider: 'aws',
          region: 'ap-southeast-1',
          busiGroupId: 10000,
          busiGroupName: 'yi-busi-group',
          status: 1,
          shards: 1,
          maxMemoryMb: 512,
          primaryZone: 'ap-southeast-1a',
          disasterRecoveryZone: 'ap-southeast-1b',
          createdDate: 1712811593000,
          updatedDate: 1712811593000,
          mbRssTotal: 9,
          'version|1': ['1.28', '1.26', '2.01', '1.03', '1.11'],
          ramUsed: '@float(1, 90)',
        },
        'shardInfoList|2-10': [
          {
            'shardIndex|+1': 1,
            mbRss: 9,
            'eachShardMemoryMb|1': [512, 128, 64, 32, 256],
            phase: 'Running',
            ramUsed: '@float(0.02, 0.9)',
            zone: 'ap-southeast-1a',
          },
        ],
        host: 'k8s-proxy-engulapr-3e99e46961-0cba5c16f842c588.elb.ap-southeast-1.amazonaws.com',
        accessToken: '58063133563403018403687457459114',
      }
    },
  },
  {
    url: '/engula/byoc/cache/rename',
    method: 'post',
    response: () => {
      return {
        id: 70,
        name: 'Cache Service Test-2023',
      }
    },
  },
  {
    url: '/engula/byoc/cache/one/shards/update',
    method: 'post',
    response: () => {
      return {
        id: 70,
        shards: 678,
      }
    },
  },
  {
    url: '/engula/byoc/cache/delete',
    method: 'delete',
    response: () => {
      return {
        id: 70,
      }
    },
  },
  {
    url: '/engula/command/exe',
    method: 'get',
    response: () => {
      return {
        ok: 100,
      }
    },
  },
] as MockMethod[]
