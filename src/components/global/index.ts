import SvgIcon from './SvgIcon.vue'
import MenuItem from './Menu-Item.vue'

import type { App } from 'vue'

export default {
  install(Vue: App) {
    Vue.component('SvgIcon', SvgIcon)
    Vue.component('MenuItem', MenuItem)
  },
}
