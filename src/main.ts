import '@/api/interceptor'
import '@/styles/tailwind.scss'
import '@/styles/global.scss'

import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'virtual:svg-icons-register'

import i18n from './locale'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)

app.mount('#app')
