import type SvgIcon from '@/components/svg-icon/index.vue'
import type MenuItem from '@/components/ui/menu/item.vue'

declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof SvgIcon
    MenuItem: typeof MenuItem
  }
}