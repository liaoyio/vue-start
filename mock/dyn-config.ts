import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/engula/dyn-config/item-type/list',
    method: 'get',
    response: () => {
      return {
        list: ['Regions', 'CloudProvider', 'InstanceType', 'InstanceFamily', 'InstanceSize', 'InstanceOs'],
      }
    },
  },
  {
    url: '/engula/dyn-config/list',
    method: 'get',
    response: () => {
      return {
        pageNum: 1,
        pageSize: 10,
        totalCount: 10,
        totalPage: 1,
        'list|2-10': [
          {
            'id|+1': 1,
            updatedDate: '@date',
            value: '@first',
            itemType: '@first',
            'orgId|+1': 788,
            region: '@region()',
            'cloudProvider|1': ['aliyun', 'aws', 'azure'],
          },
        ],
      }
    },
  },
  {
    url: '/engula/dyn-config/update',
    method: 'post',
    response: () => {
      return {
        id: 1007,
      }
    },
  },
  {
    url: '/engula/dyn-config/delete',
    method: 'delete',
    response: () => {
      return {
        id: 1007,
      }
    },
  },
] as MockMethod[]
