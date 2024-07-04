# css-module-typed README

在不写入 .d.ts 前提下，给您的 css/less/scss modules 文件添加 typescript 类型，让你的磁盘列表始终保持干净

![preview](https://github.com/qyzzzz/typescript-plugin-css-modules-goToDefinition-reproduction/assets/43691324/7658a6e3-d683-40e1-823e-fa9c495bff85)

## 功能

插件可以自动增强 css modules 文件类型并且提供下列功能：

1. 自动识别 css modules 文件中类名，并将其导出为 typescript server 能识别的正确的类型
2. 支持识别不正确的 class names
3. 支持 goToDefinition，在 tsx 文件中，使用 command + click( windows 使用 control + click )，可以自动跳转到类名定义的位置
4. 提供丰富的自定义编译选项
5. 支持 css/less/scss module 文件

## 配置

#### css-module-typed.pluginOptions

引用自 https://github.com/mrmckeb/typescript-plugin-css-modules，并且添加了一些额外支持的功能


| Option                               | Default value             | Description                                                  |
| ------------------------------------ | ------------------------- | ------------------------------------------------------------ |
| `additionalData`                     | `undefined`               | An optional string to append to the top of source files.     |
| `allowUnknownClassnamesAsDeprecated` | `true`                    | allow unknown class names as deprecated                      |
| `allowUnknownClassnames`             | `false`                   | Disables TypeScript warnings on unknown classnames (for default imports only). |
| `classnameTransform`                 | `"asIs"`                  | See [`classnameTransform`](#classnameTransform) below.       |
| `customMatcher`                      | `"\\.(c\|le\|sa\|sc)ss$"` | Changes the file extensions that this plugin processes.      |
| `customRenderer`                     | `false`                   | See [`customRenderer`](#customRenderer) below.               |
| `customTemplate`                     | `false`                   | See [`customTemplate`](#customTemplate) below.               |
| `goToDefinition`                     | `true`                    | Enables jump to definition. See [`goToDefinition`](#goToDefinition) below. |
| `noUncheckedIndexedAccess`           | `false`                   | Enable for compatibility with TypeScript's `noUncheckedIndexedAccess`. |
| `namedExports`                       | `true`                    | Enables named exports for compatible classnames.             |
| `dotenvOptions`                      | `{}`                      | Provides options for [`dotenv`](https://github.com/motdotla/dotenv#options). |
| `postcssOptions`                     | `{}`                      | See [`postcssOptions`](#postcssOptions) below.               |
| `rendererOptions`                    | `{}`                      | See [`rendererOptions`](#rendererOptions) below.             |

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



### 配置优先级

  插件读取配置的优先级分别为 user setting.json < workspace setting.json < .css-module.config.js (same dir with tsconfig.json)



## 常见问题

问：我更改了配置的插件没有生效？

答：reload vscode window make config work.



问：我有一些 less/scss 文件无法正确识别类型？

答：检查一下文件中是否有 less/scss 变量没有被正确定义，如果是，可以尝试用 `additionalData` 定义未知的变量.

## 备注

Based on the usage of `typescript-plugin-css-modules`, we have discovered several issues with this plugin. Therefore, we have fixed them and released the fixes in this plugin.