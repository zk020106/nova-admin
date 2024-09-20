// eslint.config.js
import antfu from '@antfu/eslint-config'

// https://github.com/antfu/eslint-config
export default antfu(
  {
    typescript: {
      overrides: {
        'ts/no-unused-expressions': ['error', { allowShortCircuit: true }],
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
    vue: {
      overrides: {
        'vue/no-unused-refs': 'off', // 暂时关闭，等待vue-lint的分支合并
        'vue/no-reserved-component-names': 'off',
        'vue/component-definition-name-casing': 'off',
      },
    },
  },
)
