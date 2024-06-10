import { defineStore } from 'pinia'
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { type OrgItem, type Project, getOrgList, getProjects } from '@/api'

type Options = { label: string; value: string }

type Orgs = {
  orgs: OrgItem[]
  projects: Project[]
  /** org id */
  teamId?: number
  /** project id */
  busiGroupId?: number
  /** 角色 */
  rules: { org: Options[]; project: Options[] }
}
export const useOrgStore = defineStore('userOrg', {
  state: (): Orgs => ({
    orgs: [],
    projects: [],
    rules: { org: [], project: [] },
  }),
  getters: {},
  actions: {
    async setOrgs() {
      const res = await getOrgList()
      this.orgs = res.list
      if (!this.teamId) {
        this.teamId = this.orgs[0].id
      }
      await this.setProjects()
    },
    async setProjects() {
      const res = await getProjects(this.teamId!)
      this.projects = res.list
    },
    async setRules() {
      const og = await getOrgRoleEnumList()
      const pr = await getProjectRoleEnumList()
      const useCase = (prefix = '', str: string) => useChangeCase(`${prefix} ${str}`, 'capitalCase').value
      const org = og.list.map((value) => ({ label: useCase(`Organization`, value), value }))
      const project = pr.list.map((value) => ({ label: useCase(`Project`, value), value }))

      this.rules = { org, project }
    },
    async setTeamId(id: number) {
      await changeOrg(id)
      this.teamId = id
    },
    async setProjectId(id: number) {
      await changeProject(id)
      this.busiGroupId = id
    },
  },
  persist: {
    paths: ['teamId', 'busiGroupId'],
  },
})
