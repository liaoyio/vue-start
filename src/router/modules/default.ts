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
    redirect: '/home',
    meta: { hidden: false },
    children: [
      {
        path: '/home',
        component: () => import('@/pages/home/index.vue'),
        name: 'Home',
        meta: { title: '首页', icon: 'icon-dashboard', affix: true, hidden: false },
      },
    ],
  },
]
