import type { MockMethod } from 'vite-plugin-mock'

// --> rangeType = "hour"
const byHour = [
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 00',
    podRequiredMb: 0,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 01',
    podRequiredMb: 0,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 02',
    podRequiredMb: 11864,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 03',
    podRequiredMb: 11864,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 04',
    podRequiredMb: 12526,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 05',
    podRequiredMb: 12526,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 06',
    podRequiredMb: 12526,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 07',
    podRequiredMb: 12526,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 08',
    podRequiredMb: 12526,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 09',
    podRequiredMb: 12526,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 10',
    podRequiredMb: 12526,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 11',
    podRequiredMb: 12526,
  },
  {
    nodeMemoryTotalMb: 63256,
    hourStr: '2024-04-17 12',
    podRequiredMb: 12526,
  },
]

// --> rangeType = "day"
const byDay = [
  {
    nodeMemoryTotalMb: 63256,
    dayStr: '2024-04-16',
    podRequiredMb: 2696.5333,
  },
  {
    nodeMemoryTotalMb: 63256,
    dayStr: '2024-04-17',
    podRequiredMb: 10497.0769,
  },
]

// rangeType = "month"
const byMonth = [
  {
    nodeMemoryTotalMb: 63256,
    monthStr: '2024-04',
    podRequiredMb: 6318.2143,
  },
]

export default [
  {
    url: '/engula/byoc/metric/cluster/memory-required',
    method: 'get',
    response: (res) => {
      if (res.query.rangeType === 'hour') {
        return byHour
      } else if (res.query.rangeType === 'day') {
        return byDay
      } else if (res.query.rangeType === 'month') {
        return byMonth
      } else {
        return byHour
      }
    },
  },
] as MockMethod[]
