import type { RouteRecordRaw } from 'vue-router'

/** 默认布局 */
const Layout = () => import('@/layout/index.vue')

/** 固定路由-静态路由 */
export const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/pages/z/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/z/error/404.vue'),
    meta: { hidden: true },
  },
  {
    path: '/403',
    component: () => import('@/pages/z/error/403.vue'),
    meta: { hidden: true },
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/mont-cache',
    meta: { hidden: false },
    children: [
      {
        path: '/mont-cache',
        component: () => import('@/pages/cache/index.vue'),
        name: 'MontCache',
      },
      {
        path: '/cluster',
        component: () => import('@/pages/cluster/index.vue'),
        name: 'Cluster',
      },
    ],
  },
]
