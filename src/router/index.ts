import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

import { defaultRoutes } from '@/router/modules'
export const allRouters = [...defaultRoutes ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: allRouters,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})


export default router
