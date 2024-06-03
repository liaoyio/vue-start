import { http } from '@/utils/http'

export interface Credential {
  cloudProvider: string
  id: number
  isDefault: boolean
  name: string
  /** 如果是ak/sk的，此值不为空，eg: ***UAL5 */
  ak?: string
  /** 如果是代入角色模式的，此值不为空 */
  assumeRoleArn?: string
}

export const getCredentialList = () => {
  return http.get<{ list: Credential[] }>({
    url: `/byoc/credential/list`,
  })
}

export interface CredentialBody {
  ak?: string
  sk?: string
  /** ak/sk 或者 assumeRoleArn 填写其中一组 */
  assumeRoleArn?: string
  cloudProvider: string
  name: string
}

export const getCloudProvider = async () => {
  return await http.get<{ list: string[] }>({
    url: '/byoc/credential/cloud-provider/config/names',
  })
}

export const addCredential = (data: CredentialBody) => {
  return http.put<{ credentialId: number }>({
    url: '/byoc/credential/add',
    data,
  })
}

export const getCredentialShell = () => {
  return http.get<string>({
    url: `/byoc/credential/assume-role/shell/tpl`,
  })
}

export const checkCredentialhasInit = (credentialId: number) => {
  return http.put<{ eksClusterId: number }>({
    url: `/byoc/credential/init`,
    data: { credentialId },
  })
}
