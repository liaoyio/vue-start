const CACHE = ['Overview', 'Connect', 'Terminal', 'Metrics', 'Tokens']

/** 构造菜单工具函数 */
export const formatMenus = (menus: string[], prefix?: string) => {
  return menus.map((label) => {
    const key = prefix ? `${prefix}${label}` : label
    return { key, label }
  })
}

export const CACHE_MENUS = formatMenus(CACHE, 'Cache')

export const ORG_SETTING_MENUS = [
  { key: 'OrgGeneral', label: 'General' },
  { key: 'OrgProjects', label: 'Projects' },
  { key: 'OrgUsers', label: 'Users' },
  { key: 'OrgResourceManage', label: 'Resource Manage' },
  { key: 'OrgSecurity', label: 'Security' },
  { key: 'OrgConfig', label: 'Configuration' },
]
