// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { EXTENSION_NAME } from "./constants";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

const storagePath = path.join(os.tmpdir(), "./.tpcm.config.json");

const disposer = [];

const PLUGIN_OPTIONS_CONFIG_NAME = `${EXTENSION_NAME}.pluginOptions`;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "css-module-typed" is now active!'
  );

  setPluginGlobalConfig();

  disposer.push(
    ...[
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration(PLUGIN_OPTIONS_CONFIG_NAME)) {
          setPluginGlobalConfig();
        }
      }),
    ]
  );
}

const setPluginGlobalConfig = () => {
  const globalConfig = vscode.workspace.getConfiguration();

  // TODO support workspace config file
  const globalOptions = globalConfig.get(PLUGIN_OPTIONS_CONFIG_NAME) as object;

  const options = {
    goToDefinition: true,
    customMatcher: "\\.(((c|le|sa|sc)ss)|styl)$",
    ...globalOptions,
  };

  fs.writeFileSync(storagePath, JSON.stringify(options), "utf-8");
};

// This method is called when your extension is deactivated
export function deactivate() {}
