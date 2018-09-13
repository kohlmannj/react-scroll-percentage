const ES = process.env.BABEL_ENV === 'es'

module.exports = {
  presets: [
    [
      '@babel/env',
      ES
        ? {
            modules: false,
          }
        : {},
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [

    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-json-strings',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
  ],
}
