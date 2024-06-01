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
        path: '/cache/:id',
        name: 'CacheDetail',
        component: () => import('@/pages/cache/layout/index.vue'),
        redirect: { name: 'CacheOverview' },
        children: [
          {
            path: 'overview',
            name: 'CacheOverview',
            component: () => import('@/pages/cache/over-view/index.vue'),
          },
          {
            path: 'connect',
            name: 'CacheConnect',
            component: () => import('@/pages/cache/connect/index.vue'),
          },
          {
            path: 'metrics',
            name: 'CacheMetrics',
            component: () => import('@/pages/cache/metrics/index.vue'),
          },
          {
            path: 'terminal',
            name: 'CacheTerminal',
            component: () => import('@/pages/cache/terminal/index.vue'),
          },
          {
            path: 'token',
            name: 'CacheToken',
            component: () => import('@/pages/cache/token/index.vue'),
          },
        ],
      },
      {
        path: '/cluster',
        component: () => import('@/pages/cluster/index.vue'),
        name: 'Cluster',
      },
      {
        path: 'org-settings',
        name: 'OrgSettings',
        component: () => import('@/pages/org/layout/index.vue'),
        redirect: { name: 'OrgGeneral' },
        children: [
          {
            path: 'general',
            name: 'OrgGeneral',
            component: () => import('@/pages/org/general/index.vue'),
          },
          {
            path: 'projects',
            name: 'OrgProjects',
            component: () => import('@/pages/org/projects/index.vue'),
          },
          {
            path: 'users',
            name: 'OrgUsers',
            component: () => import('@/pages/org/users/index.vue'),
          },

          {
            path: 'resource',
            name: 'OrgResource',
            component: () => import('@/pages/org/resource/index.vue'),
          },
          {
            path: 'security',
            name: 'OrgSecurity',
            component: () => import('@/pages/org/security/index.vue'),
          },
        ],
      },
      {
        path: 'account',
        name: 'AccountSettings',
        component: () => import('@/pages/account/layout/index.vue'),
        redirect: { name: 'AccountProfole' },
        children: [
          {
            path: 'profile',
            name: 'AccountProfole',
            component: () => import('@/pages/account/profile/index.vue'),
          },
          {
            path: 'password',
            name: 'AccountPassword',
            component: () => import('@/pages/account/password/index.vue'),
          },
          {
            path: 'privacy',
            name: 'AccountPrivacy',
            component: () => import('@/pages/account/privacy/index.vue'),
          },
        ],
      },
    ],
  },
]
