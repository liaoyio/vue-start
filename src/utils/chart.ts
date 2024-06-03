export function formatBytes(bytes: number): string {
  const _f3 = (num: number) =>
    num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  const _m = (num: number) => 1024 ** num

  if (!bytes || bytes == 0) return '0'
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < _m(2)) {
    return `${_f3(bytes / 1024)} KB`
  } else if (bytes < _m(3)) {
    return `${_f3(bytes / _m(2))} MB`
  } else if (bytes < _m(4)) {
    return `${_f3(bytes / _m(3))} GB`
  } else {
    // (bytes < _m(5))
    return `${_f3(bytes / _m(4))} TB`
  }
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(date: number | string) {
  const num = date ? Number(date) : 0
  // 判断是否为整数
  const isInteger = Number.parseInt(num.toString()) == Number.parseFloat(num.toString())
  const filterStr = (str: string) => str.replaceAll(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
  return isInteger ? filterStr(num.toString()) : filterStr(num.toFixed(3))
}
