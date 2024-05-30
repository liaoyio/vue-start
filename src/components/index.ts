import SvgIcon from './svg-icon/index.vue'
import MenuItem from './ui/menu/item.vue'
import type { App } from 'vue'

export default {
  install(Vue: App) {
    Vue.component('SvgIcon', SvgIcon)
    Vue.component('MenuItem', MenuItem)
  },
}
