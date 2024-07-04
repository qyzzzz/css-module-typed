// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { PLUGIN_OPTIONS_CONFIG_NAME, setPluginGlobalConfig } from "./config";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "css-module-typed" is now active!'
  );

  setPluginGlobalConfig();

  const disposer = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration(PLUGIN_OPTIONS_CONFIG_NAME)) {
      setPluginGlobalConfig();
    }
  });
  context.subscriptions.push(disposer);
}

// This method is called when your extension is deactivated
export function deactivate() {}
