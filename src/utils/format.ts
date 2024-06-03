import dayjs from 'dayjs'
/**
 * @param timeStamp 时间戳
 * @returns 'YYYY-MM-DD' 年月日
 */
export function formatDate(timeStamp?: string | number, type = 'YYYY-MM-DD HH:mm:ss') {
  if (!timeStamp) return
  return dayjs(timeStamp).format(type)
}

export function filterOptions(res?: Array<any>, key?: string) {
  if (!res || res.length === 0) return []
  if (key) {
    return res.map((it) => (it[key] ? { label: it[key], value: it[key] } : []))
  }
  return res.map((value) => ({ label: value, value })) ?? []
}
