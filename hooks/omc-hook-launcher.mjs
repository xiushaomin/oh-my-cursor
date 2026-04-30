#!/usr/bin/env node
import { existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { pathToFileURL } from "node:url";

function usage() {
  console.error("[oh-my-cursor] Usage: node hooks/omc-hook-launcher.mjs <relative-script> [...args]");
  process.exit(1);
}

function candidateRoots() {
  return [
    process.env.OHC_PLUGIN_ROOT,
    process.cwd(),
    join(homedir(), ".cursor", "plugins", "local", "oh-my-cursor"),
    join(homedir(), ".cursor", "plugins", "src", "oh-my-cursor"),
    join(homedir(), ".cursor", "oh-my-cursor"),
  ].filter((root) => root && existsSync(join(root, ".cursor-plugin", "plugin.json")));
}

async function main() {
  const [relativeScript, ...forwardedArgs] = process.argv.slice(2);
  if (!relativeScript) usage();

  const resolved = candidateRoots()
    .map((root) => join(root, relativeScript))
    .find((candidate) => existsSync(candidate));

  if (!resolved) {
    console.error(
      `[oh-my-cursor] Unable to locate ${relativeScript}. Set OHC_PLUGIN_ROOT if installed elsewhere.`,
    );
    process.exit(1);
  }

  process.argv = [process.argv[0], resolved, ...forwardedArgs];
  await import(pathToFileURL(resolved).href);
}

await main();
