import js from '@eslint/js'
import globals from 'globals'
import solid from 'eslint-plugin-solid/configs/typescript'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] }, // ignore built files
  js.configs.recommended,                    // ESLint recommended rules for JS citeturn2view0
  tseslint.configs.recommended,              // ts-eslint recommended rules citeturn2view0
  {
    files: ['**/*.{ts,tsx}'],                // apply to TS and TSX files
    ...solid,                                // SolidJS-specific rules and settings citeturn1view0
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,             // browser globals
      parser: solid.languageOptions.parser,  // TypeScript parser from solid config
      parserOptions: {
        project: 'tsconfig.json'            // required for type-aware linting
      },
    },
  },
)
