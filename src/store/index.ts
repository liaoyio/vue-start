import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export * from './modules/app'
export * from './modules/cache'
export * from './modules/user'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
