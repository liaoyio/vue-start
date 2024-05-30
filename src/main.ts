import '@/api/interceptor'
import { createApp } from 'vue'

import globalComponents from '@/components'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import '@/styles/global.scss'

// https://unocss.dev/guide/style-reset#tailwind-compat
import '@unocss/reset/tailwind-compat.css'

import i18n from './locale'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)
app.use(globalComponents)

app.mount('#app')
