import * as vscode from "vscode";
import { EXTENSION_NAME } from "./constants";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

const storagePath = path.join(os.tmpdir(), "./.tpcm.config.json");
export const PLUGIN_OPTIONS_CONFIG_NAME = `${EXTENSION_NAME}.pluginOptions`;

export const setPluginGlobalConfig = () => {
  const globalConfig = vscode.workspace.getConfiguration();

  const globalOptions = globalConfig.get(PLUGIN_OPTIONS_CONFIG_NAME) as object;

  const options = {
    goToDefinition: true,
    customMatcher: "\\.(((c|le|sa|sc)ss)|styl)$",
    ...globalOptions,
  };

  fs.writeFileSync(storagePath, JSON.stringify(options), "utf-8");
};
