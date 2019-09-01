# ts-transformer-i18n

TypeScript transformer used for the purposes of internationalization. Inspired by [gettext](https://en.wikipedia.org/wiki/Gettext).

## Installation [not yet available]

```
$ yarn add -D ts-transformer-i18n
```

## How does it work?

The transformer works by replacing special identifiers with strings defined in `translation.[language name].json` file. A simple example might look like this:

index.ts:

```typescript
console.log(_T('greeting'));
```

translation.en.json:

```json
{
  "greeting": "Hello, world!"
}
```

Build result will look like this:

index.js:

```javascript
console.log('Hello, world!');
```

During the first (and any subsequent) run the transformer will regenerate translation files, adding new items to them.

## Configuration

### plain typescript

[See example](examples/basic/README.md).

You will need `ttypescript` to be able to run transformers.

tsconfig.json:

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "ts-transformer-i18n",
        "languages": ["ru", "en"],
        "targetLanguage": "ru"
      }
    ]
  }
}
```

```
$ ttsc index.ts
```

### webpack, awesome-typescript-loader

```javascript
const i18nTransformer = require('ts-transformer-i18n').default;

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'awesome-typescript-loader',
          options: {
            getCustomTransformers: () => ({
              before: [
                i18nTransformer({
                  languages: ['ru', 'en'],
                  targetLanguage: 'ru',
                }),
              ],
            }),
          },
        },
      },
    ],
  },
};
```
