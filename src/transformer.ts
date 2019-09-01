import ts from 'typescript';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const cwd = process.cwd();

interface I18NOptions {
  languages: string[];
  targetLanguage: string;
}

const isI18NOptions = (obj: unknown): obj is I18NOptions => {
  return (
    Object(obj) === obj &&
    Object.prototype.hasOwnProperty.call(obj, 'languages') &&
    Object.prototype.hasOwnProperty.call(obj, 'targetLanguage')
  );
};

const getTransformerOptions = (
  compilerOptions: ts.CompilerOptions
): I18NOptions => {
  if (
    typeof compilerOptions.plugins !== 'undefined' &&
    Array.isArray(compilerOptions.plugins)
  ) {
    for (let i = 0; i < compilerOptions.plugins.length; ++i) {
      const plugin = compilerOptions.plugins[i];

      if (isI18NOptions(plugin)) {
        return plugin;
      }
    }
  }

  throw new Error(`No options were specified!`);
};

type SubstitutionCache = {
  [languageCode: string]: {
    [identifier: string]: string;
  };
};

const readSubstitutionCache = (languages: string[]): SubstitutionCache => {
  return languages.reduce((acc, languageCode) => {
    try {
      const content = readFileSync(
        resolve(cwd, `translation.${languageCode}.json`)
      ).toString();
      const parsed = JSON.parse(content);
      acc[languageCode] = parsed;
    } catch (e) {
      acc[languageCode] = {};
    }

    return acc;
  }, {});
};

const flushSubstitutionCache = (
  languages: string[],
  cache: SubstitutionCache
) => {
  languages.forEach(languageCode => {
    writeFileSync(
      resolve(cwd, `translation.${languageCode}.json`),
      JSON.stringify(cache[languageCode], null, 2)
    );
  });
};

export default (options: I18NOptions | ts.Program) => {
  let cache: SubstitutionCache = {};
  let languages: string[];
  let targetLanguage: string;

  if (isI18NOptions(options)) {
    cache = readSubstitutionCache(options.languages);
    languages = options.languages;
    targetLanguage = options.targetLanguage;
  } else {
    const inferredOptions = getTransformerOptions(options.getCompilerOptions());
    cache = readSubstitutionCache(inferredOptions.languages);
    languages = inferredOptions.languages;
    targetLanguage = inferredOptions.targetLanguage;
  }

  return (context: ts.TransformationContext) => {
    const visit: ts.Visitor = node => {
      if (ts.isCallExpression(node) && node.expression.getText() === '_T') {
        if (
          node.arguments.length === 1 &&
          ts.isStringLiteral(node.arguments[0])
        ) {
          const rawIdentifier = node.arguments[0].getText();
          const identifier = rawIdentifier
            .substring(0, rawIdentifier.length - 1)
            .substring(1);

          if (
            cache[targetLanguage] &&
            typeof cache[targetLanguage][identifier] === 'string'
          ) {
            return ts.createStringLiteral(cache[targetLanguage][identifier]);
          } else {
            languages.forEach(languageCode => {
              if (!cache[languageCode]) {
                cache[languageCode] = {};
              }

              if (typeof cache[languageCode][identifier] === 'undefined') {
                cache[languageCode][identifier] = identifier;
              }
            });

            return ts.createStringLiteral(identifier);
          }
        }
      }

      return ts.visitEachChild(node, child => visit(child), context);
    };

    return (file: ts.SourceFile) => {
      const result = ts.visitNode(file, visit);
      flushSubstitutionCache(languages, cache);
      return result;
    };
  };
};
