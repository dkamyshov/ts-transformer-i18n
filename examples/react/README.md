# ts-transformer-i18n/example-basic

## How-to

First of all, install all dependencies:

```
$ yarn
```

Now, start the application in development mode:

```
$ yarn wds
```

You will notice 2 new files in the project directory:

- `translation.en.json` - generated english translation
- `translation.ru.json` - generated russian translation

You may navigate to http://localhost:8080/en or http://localhost:8080/ru to see the english and russian translations, respectively.

Now, edit `translation.en.json`, save `index.tsx` (unfortunately, you need to tell webpack to rebuild the applications for changes to take effect) and navigate to http://localhost:8080/en to check that the translation has been applied.
