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
    redirect: '/cache',
    children: [
      {
        path: '/cache',
        component: () => import('@/pages/cache/index.vue'),
        name: 'Caches',
      },
      {
        path: '/cache/add',
        component: () => import('@/pages/cache/add/index.vue'),
        name: 'AddCache',
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
            path: 'shards',
            name: 'CacheShards',
            component: () => import('@/pages/cache/shards/index.vue'),
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
        path: '/cluster/details/:clusterId',
        name: 'ClusterDetail',
        component: () => import('@/pages/cluster/layout/index.vue'),
        redirect: { name: 'ClusterOverview' },
        children: [
          {
            path: 'overview',
            name: 'ClusterOverview',
            component: () => import('@/pages/cluster/over-view/index.vue'),
          },
          {
            path: 'node-group',
            name: 'NodeGroupsOverview',
            component: () => import('@/pages/cluster/node-groups/index.vue'),
            redirect: { name: 'Worker' },
            children: [
              {
                path: 'worker',
                name: 'Worker',
                component: () => import('@/pages/cluster/node-groups/works.vue'),
              },
              {
                path: 'proxy',
                name: 'Proxy',
                component: () => import('@/pages/cluster/node-groups/proxy.vue'),
              },
              {
                path: 'controller',
                name: 'Controller',
                component: () => import('@/pages/cluster/node-groups/controller.vue'),
              },
            ],
          },
          {
            path: 'metrics',
            name: 'ClusterMetrics',
            component: () => import('@/pages/cluster/metrics/index.vue'),
          },
        ],
      },
      {
        path: '/deploy',
        name: 'Logs',
        component: () => import('@/pages/cluster/logs/index.vue'),
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
          {
            path: 'security/add',
            name: 'OrgSecurityAdd',
            component: () => import('@/pages/org/security/add/index.vue'),
          },
          {
            path: 'config',
            name: 'OrgConfig',
            component: () => import('@/pages/org/config/index.vue'),
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
