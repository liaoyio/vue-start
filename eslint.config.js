import { sxzz } from '@sxzz/eslint-config'

export default sxzz(
  [
    /* custom config */
    {
      ignores: ['dist/*', '.prettierrc.js', 'node_modules/*'],
    },
    {
      rules: {
        'import/no-default-export': 'off',
        'unicorn/filename-case': 'off',
        'no-duplicate-imports': 'off',
        'node/prefer-global/process': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        'no-restricted-syntax': 'off',
      },
    },
  ],
  {
    prettier: true,
    markdown: true,
    vue: true,
    unocss: false,
    sortKeys: true,
  },
)
