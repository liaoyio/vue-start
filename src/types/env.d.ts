/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
  /** 应用名称 */
  readonly VITE_APP_TITLE: string
  /** 环境 */
  readonly VITE_NODE_ENV: string
  /** 接口前缀 */
  readonly VITE_API_PREFIX: string
  /** 接口地址 */
  readonly VITE_API_URL: string
  /** 开发环境地址前缀 [ vite -> base ] (一般 '/' 或 './' 都可以) */
  readonly VITE_BASE: string
}

export interface ImportMeta {
  readonly env: ImportMetaEnv
}
