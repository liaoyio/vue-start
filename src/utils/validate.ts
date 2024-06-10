/** 群集名称必须是 4~32个字符，并且只能包括数字、小写或大写字母、下划线、以及连字符。第一个字符必须是字母，最后一个字符必须是字母或数字 */
import type { Rule } from 'ant-design-vue/es/form'

const regex_name = /^[A-Za-z][\w-]{2,30}[\dA-Za-z]$/

export const regexName = [
  { required: true, message: 'Please input name' },
  {
    pattern: regex_name,
    message:
      'name must be 4-32 characters long and can include numbers, letters, underscores (_), and hyphens (-). The first character must be a letter, and the last character must be a letter or number.',
  },
]

export const CACHE_RULES: Record<string, Rule[]> = {
  name: regexName,
  cloudProvider: [{ required: true, message: 'Please select cloud provider', trigger: 'change' }],
  region: [{ required: true, message: 'Please select region', trigger: 'change' }],
  primaryZone: [{ required: true, message: 'Please select primary zone', trigger: 'change' }],
  maxMemoryMb: [{ required: true, message: 'Please input max memory', trigger: 'change' }],
}
export const CLUSTER_BASE_RULES: Record<string, Rule[]> = {
  clusterVersion: [{ required: true, message: 'Please select version', trigger: 'change' }],
  name: regexName,
  region: [{ required: true, message: 'Please select region', trigger: 'change' }],
  s3Bucket: [{ required: true, message: 'Please input s3 Bucket!' }],
  vpcId: [{ required: true, message: 'Please select vpc', trigger: 'change' }],
}
