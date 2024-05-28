import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [{ flex_c: 'flex items-center' }, { flex_cc: 'flex items-center justify-center' }],
  theme: {
    colors: {},
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [presetUno(), presetAttributify(), presetIcons({ scale: 1.2, warn: true })],
  rules: [],
})
