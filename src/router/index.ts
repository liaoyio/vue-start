import { createRouter, createWebHistory } from 'vue-router'
import { useNProgress } from '@vueuse/integrations/useNProgress'
import { useCookies } from '@vueuse/integrations/useCookies'
import { defaultRoutes } from '@/router/modules'
import { useOrgStore, userStore } from '@/store'

export const allRouters = [...defaultRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRouters,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// https://vueuse.org/integrations/useNProgress/
const { start, done } = useNProgress()

router.beforeEach(() => {
  start()

  const store = userStore()
  const org = useOrgStore()
  const cookies = useCookies(['Auth-Token'])

  store.setUserInfo()
  org.setOrgs()

  const ENV = import.meta.env.VITE_NODE_ENV
  const BASE_URL = import.meta.env.VITE_API_URL
  if (ENV !== 'development' && !cookies.get('Auth-Token')) {
    window.location.replace(`${BASE_URL}/engula/auth0/login`)
  }
})

router.afterEach(() => done(true))

export default router
