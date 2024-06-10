import type SuffixIcon from '@/components/icon/suffix-icon.vue'
import type SvgIcon from '@/components/svg-icon/index.vue'
import type MenuItem from '@/components/global/item.vue'

declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof SvgIcon
    MenuItem: typeof MenuItem
    SuffixIcon: typeof SuffixIcon
  }
}
