module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard-with-typescript',
    'plugin:require-extensions/recommended'],
  plugins: ['require-extensions'],
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['*.js']
    },
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'script'
      }
    }

  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {}
}
