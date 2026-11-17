// @ts-check
import jsdoc from 'eslint-plugin-jsdoc';
import withNuxt from './.nuxt/eslint.config.mjs';
import { commentStyle } from './eslint/comment-style.mjs';

// Rules from @nuxt/eslint's Vue presets that only warn. Raised to errors.
const warnOnlyVueRules = [
  'vue/attribute-hyphenation',
  'vue/attributes-order',
  'vue/component-definition-name-casing',
  'vue/first-attribute-linebreak',
  'vue/html-closing-bracket-newline',
  'vue/html-closing-bracket-spacing',
  'vue/html-end-tags',
  'vue/html-self-closing',
  'vue/mustache-interpolation-spacing',
  'vue/no-lone-template',
  'vue/no-multi-spaces',
  'vue/no-multiple-slot-args',
  'vue/no-required-prop-with-default',
  'vue/no-spaces-around-equal-signs-in-attribute',
  'vue/no-template-shadow',
  'vue/order-in-components',
  'vue/prop-name-casing',
  'vue/require-explicit-emits',
  'vue/require-prop-types',
  'vue/this-in-template',
  'vue/v-bind-style',
  'vue/v-on-event-hyphenation',
  'vue/v-on-style',
  'vue/v-slot-style'
];

// Code reads top to bottom rather than left to right.
export default withNuxt({
  name: 'portfolio/vertical-code',
  plugins: {
    portfolio: {
      rules: { 'comment-style': commentStyle }
    }
  },
  rules: {
    'portfolio/comment-style': 'error',
    'curly': ['error', 'all'],
    '@stylistic/brace-style': ['error', 'stroustrup', { allowSingleLine: false }],
    '@stylistic/max-len': ['error', {
      code: 100,
      comments: 80,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true
    }],
    '@stylistic/object-curly-newline': ['error', {
      ObjectExpression: {
        multiline: true,
        minProperties: 2,
        consistent: true
      },
      ObjectPattern: {
        multiline: true,
        consistent: true
      },
      ImportDeclaration: {
        multiline: true,
        consistent: true
      },
      ExportDeclaration: {
        multiline: true,
        consistent: true
      }
    }],
    '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
    '@stylistic/function-call-argument-newline': ['error', 'consistent'],
    '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],
    '@stylistic/array-bracket-newline': ['error', 'consistent'],
    '@stylistic/array-element-newline': ['error', 'consistent'],
    '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }]
  }
}, {
  // The docblock rule in AGENTS.md. @param, @returns and @throws stay optional,
  // because they should only be used when they add information.
  name: 'portfolio/docblocks',
  files: [
    'server/**/*.ts',
    'app/composables/**/*.ts',
    'app/utils/**/*.ts'
  ],
  plugins: { jsdoc },
  rules: {
    'jsdoc/require-jsdoc': ['error', {
      // A fixer would insert empty docblocks that document nothing.
      enableFixer: false,
      require: { FunctionDeclaration: false },
      contexts: [
        'ExportNamedDeclaration[declaration.type=/^(FunctionDeclaration|TSDeclareFunction|VariableDeclaration|TSInterfaceDeclaration|ClassDeclaration|TSEnumDeclaration|TSModuleDeclaration)$/]',
        'ExportDefaultDeclaration'
      ]
    }],
    // An `export { a }` list has no place for a docblock, so exports are
    // declared where they're defined. Re-exports and type lists are exempt.
    'no-restricted-syntax': ['error', {
      selector: 'ExportNamedDeclaration[declaration=null][source=null][exportKind="value"]',
      message: 'Export where it is declared, such as `export const a`, so it can have a docblock.'
    }],
    'jsdoc/no-types': 'error',
    'jsdoc/require-description': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-param-names': 'error'
  }
}, {
  // Vue standards on top of the rules above.
  name: 'portfolio/vue',
  files: ['**/*.vue'],
  plugins: { jsdoc },
  rules: {
    // Rules that @nuxt/eslint only warns about. Lint passes or fails.
    ...Object.fromEntries(warnOnlyVueRules.map(rule => [rule, 'error'])),
    'vue/component-api-style': ['error', ['script-setup']],
    'vue/block-lang': ['error', {
      script: { lang: 'ts' }
    }],
    'vue/block-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: { max: 1 },
      multiline: { max: 1 }
    }],
    'vue/define-props-declaration': ['error', 'type-based'],
    'vue/define-emits-declaration': ['error', 'type-based'],
    // Nuxt auto-imports components, so ESLint can't see them registered.
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      registeredComponentsOnly: false
    }],
    'vue/no-static-inline-styles': ['error', { allowBinding: false }],
    // Markdown is rendered with <ContentRenderer>, never from a string.
    'vue/no-v-html': 'error',
    'vue/max-template-depth': ['error', { maxDepth: 8 }],
    'vue/max-lines-per-block': ['error', {
      script: 150,
      template: 150,
      style: 50,
      skipBlankLines: true
    }],
    // vue/max-len also covers the template, so it replaces the general rule.
    // Long attribute values, such as Tailwind classes, are exempt like
    // long strings.
    '@stylistic/max-len': 'off',
    'vue/max-len': ['error', {
      code: 100,
      template: 100,
      comments: 80,
      ignoreUrls: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreRegExpLiterals: true,
      ignoreHTMLAttributeValues: true
    }],
    // Each prop field needs a docblock, which shows on hover where the
    // component is used.
    'jsdoc/require-jsdoc': ['error', {
      enableFixer: false,
      require: { FunctionDeclaration: false },
      contexts: [
        'CallExpression[callee.name="defineProps"] TSPropertySignature',
        'TSInterfaceDeclaration[id.name="Props"] TSPropertySignature',
        'TSTypeAliasDeclaration[id.name="Props"] TSPropertySignature'
      ]
    }],
    'jsdoc/no-types': 'error',
    'jsdoc/require-description': 'error'
  }
}, {
  // Nuxt turns this off because pages and layouts often have one-word names.
  // Components are named after their folder path, so theirs have several.
  name: 'portfolio/vue-components',
  files: ['app/components/**/*.vue'],
  rules: {
    'vue/multi-word-component-names': 'error'
  }
}, {
  // The reference design is a static mockup, not source code.
  name: 'portfolio/ignores',
  ignores: ['design/**']
});
