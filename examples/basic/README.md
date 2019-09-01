# ts-transformer-i18n/example-basic

## How-to

First of all, install all dependencies:

```
$ yarn
```

Now, build the application:

```
$ yarn build
```

You will notice 3 new files in the project directory:

- `index.js` - build result
- `translation.en.json` - generated english translation
- `translation.ru.json` - generated russian translation

Notice, that translations and build result contain the same text as the identifier.

Edit `translation.en.json`:

```json
{
  "greeting": "Hello, world!"
}
```

and build the application again:

```
$ yarn build
```

Notice, that the build result now contains the correct translation:

```javascript
console.log('Hello, world!');
```
