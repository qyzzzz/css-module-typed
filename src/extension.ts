// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "css-module-typed" is now active!'
  );

  // Get the TS extension
  const tsExtension = vscode.extensions.getExtension(
    "vscode.typescript-language-features"
  );
  if (!tsExtension) {
    return;
  }

  await tsExtension.activate();

  // Get the API from the TS extension
  if (!tsExtension.exports || !tsExtension.exports.getAPI) {
    return;
  }

  const api = tsExtension.exports.getAPI(0);
  if (!api) {
    return;
  }
  const config = {
    goToDefinition: true,
    customMatcher: ".(((c|le|sa|sc)ss)|styl)$",
  };
  api.configurePlugin("tpcm", config);
}

// This method is called when your extension is deactivated
export function deactivate() {}
