# css-module-typed README

Without writing .d.ts files, add TypeScript types to your css/less/scss modules files to keep your directory clean.

![preview](https://github.com/qyzzzz/typescript-plugin-css-modules-goToDefinition-reproduction/assets/43691324/7658a6e3-d683-40e1-823e-fa9c495bff85)

## Features

The plugin can automatically enhance the css modules file type and provide the following features:

1. Automatically recognize class names in css modules files and export them as correct types that can be recognized by TypeScript server.
2. Support recognizing incorrect class names.
3. Support goToDefinition. In tsx files, you can automatically navigate to the location where the class name is defined by using the command + click (or control + click on Windows).
4. Provide rich customization options for compilation.
5. Support css/less/scss module files.

## Configuration

#### css-module-typed.pluginOptions

Quoted from https://github.com/mrmckeb/typescript-plugin-css-modules, and added some additional supported features.

| Option                               | Default value             | Description                                                                    |
| ------------------------------------ | ------------------------- | ------------------------------------------------------------------------------ |
| `additionalData`                     | `undefined`               | An optional string to append to the top of source files.                       |
| `allowUnknownClassnamesAsDeprecated` | `true`                    | allow unknown class names as deprecated                                        |
| `allowUnknownClassnames`             | `false`                   | Disables TypeScript warnings on unknown classnames (for default imports only). |
| `classnameTransform`                 | `"asIs"`                  | See [`classnameTransform`](#classnameTransform) below.                         |
| `customMatcher`                      | `"\\.(c\|le\|sa\|sc)ss$"` | Changes the file extensions that this plugin processes.                        |
| `customRenderer`                     | `false`                   | See [`customRenderer`](#customRenderer) below.                                 |
| `customTemplate`                     | `false`                   | See [`customTemplate`](#customTemplate) below.                                 |
| `goToDefinition`                     | `true`                    | Enables jump to definition. See [`goToDefinition`](#goToDefinition) below.     |
| `noUncheckedIndexedAccess`           | `false`                   | Enable for compatibility with TypeScript's `noUncheckedIndexedAccess`.         |
| `namedExports`                       | `true`                    | Enables named exports for compatible classnames.                               |
| `dotenvOptions`                      | `{}`                      | Provides options for [`dotenv`](https://github.com/motdotla/dotenv#options).   |
| `postcssOptions`                     | `{}`                      | See [`postcssOptions`](#postcssOptions) below.                                 |
| `rendererOptions`                    | `{}`                      | See [`rendererOptions`](#rendererOptions) below.                               |

#### `classnameTransform`

Implements the behaviour of the [`localsConvention`](https://github.com/webpack-contrib/css-loader#localsconvention) `css-loader` option.

Options available are: `'asIs'`, `'camelCase'`, `'camelCaseOnly'`, `'dashes'`, and `'dashesOnly'`.

#### `customRenderer`

The `customRenderer` is an advanced option, letting you provide the CSS renderer.

When a custom renderer is provided, not other renderers will be used.

The path to the `customRenderer` must be relative to the project root (i.e. `./myRenderer.js`).

The custom renderer itself should be a JavaScript file. The function will be called with three arguments: a `css` string, an `options` object (see [`options.ts`](https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/options.ts#L22-L34)), and a `compilerOptions` object - which contains options as set in your `tsconfig.json`. It must be synchronous, and must return valid CSS.

```js
module.exports = (css, { fileName, logger }) => {
  try {
    // ...process your css here.
    return renderedCss;
  } catch (error) {
    logger.error(error.message);
  }
};
```

You can find an example custom renderer in our test fixtures ([`customRenderer.js`](https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/helpers/__tests__/fixtures/customRenderer.js)).

The [internal `logger`](https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/helpers/logger.ts) is provided for [debugging](#troubleshooting).

> If you use Webpack, note that tilde (`~`) imports not supported by Less and Sass natively.
>
> For Sass users: A custom importer has been implemented to resolve this as of v3.
>
> For Less users: This package exports a customRenderer that enables tilde imports: [`less-plugin-aliases`](https://github.com/dancon/less-plugin-aliases).

#### `customTemplate`

The `customTemplate` is an advanced option, letting you provide a template for the generated TypeScript declarations.

When a custom template is provided, its output is used as the virtual declaration (`*.d.ts`) file.

The path to the `customTemplate` must be relative to the project root (i.e. `./customTemplate.js`).

The custom renderer itself should be a JavaScript file. The function will be called with two arguments: a `dts` string, and an `options` object (see [`options.ts`](https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/options.ts#L43-L52)). It must be synchronous, and must return a valid TypeScript declaration (as found in a `.d.ts` file).

```js
module.exports = (dts, { classes, fileName, logger }) => {
  try {
    // ...generate your template here.
    return customTemplate;
  } catch (error) {
    logger.error(error.message);
  }
};
```

You can find an example custom template in our test fixtures ([`customTemplate.js`](https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/helpers/__tests__/fixtures/customTemplate.js)).

The [internal `logger`](https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/helpers/logger.ts) is provided for [debugging](#troubleshooting).

The `classes` object represents all the classnames extracted from the CSS Module. They are available if you want to add a custom representation of the CSS classes.

#### `goToDefinition`

This allows an editor like Visual Studio Code to go to a classname's definition (file and line).

This is experimental, and may not always work as expected. It currently supports CSS/PostCSS, Less, and Sass. Please raise an issue if you find something isn't working.

#### `postcssOptions`

| Option           | Default value | Description                                                                                                               |
| ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useConfig`      | `false`       | Set to `true` to load plugins from your [PostCSS config](https://github.com/michael-ciniawsky/postcss-load-config#usage). |
| `excludePlugins` | `false`       | Only sync plugins are supported. Use this to set an array of async plugins to exclude (i.e. `['postcss-mixins']`)         |

#### `rendererOptions`

| Option   | Default value | Description                                                                          |
| -------- | ------------- | ------------------------------------------------------------------------------------ |
| `less`   | `{}`          | Set [renderer options for Less](http://lesscss.org/usage/#less-options).             |
| `sass`   | `{}`          | Set [renderer options for Sass](https://sass-lang.com/documentation/js-api#options). |
| `stylus` | `{}`          | Set [renderer options for Stylus](https://stylus.bootcss.com/docs/js.html).          |

> For convenience, `loadPaths` for Sass are extended, not replaced. The defaults are the path of the current file, and `'node_modules'`.

### Configuration Priority

The priority of reading plugin configurations is as follows: user setting.json < workspace setting.json < .css-module.config.js (same dir with tsconfig.json)

## QA

Q: I made changes to the plugin configurations but they didn't take effect?

A: reload vscode window make config work.

Q: Some of my `less/scss` files are not being recognized correctly?

A: Check if there are any `less/scss` variables that are not properly defined in the files. If so, you can try defining the unknown variables using `additionalData`.

## Remark

Based on the usage of `typescript-plugin-css-modules`, we have discovered several issues with this plugin. Therefore, we have fixed them and released the fixes in this plugin.
