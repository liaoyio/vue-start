import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

// https://github.com/MoomFE/unocss-preset-extra
import { presetExtra } from 'unocss-preset-extra'

export default defineConfig({
  shortcuts: [
    { flex_c: 'flex items-center' },
    { 'flex_c1.5': 'flex items-center gap-2' },
    { flex_c2: 'flex items-center gap-2' },
    { flex_cc: 'flex_c justify-center' },
    { flex_lr: 'flex_c justify-between' },
  ],
  theme: {
    colors: {
      link: 'rgb(12, 166, 242)',
      primary: 'var(--primary-color)',
      'info-4': 'var(--info-4-color)',
    },
    extend: {
      textShadow: {
        sm: 'rgba(255, 255, 255, 0.35) 1px 1px 12px',
      },
    },
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [presetUno(), presetAttributify(), presetIcons({ scale: 1.2, warn: true }), presetExtra()],
  rules: [],
})
