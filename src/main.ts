import { createApp } from 'vue'

import globalComponents from '@/components/global'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'

// https://unocss.dev/guide/style-reset#tailwind-compat
import '@unocss/reset/tailwind-compat.css'
import '@/styles/global.scss'

import i18n from './locale'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)
app.use(globalComponents)

app.mount('#app')
