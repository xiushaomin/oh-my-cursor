#!/usr/bin/env node
/**
 * oh-my-cursor governance hook.
 * Conservative, dependency-free guardrails for Cursor hook events.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getProjectDir, loadRuntimeConfig } from "./omc-workflow-lib.mjs";

const scriptDir = dirname(fileURLToPath(import.meta.url));

function readInput() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return {};
  }
}

function eventName(input) {
  return String(
    process.argv[2] ??
      input.hookEventName ??
      input.hook_event_name ??
      input.eventName ??
      input.event_name ??
      "",
  );
}

function pickString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function shellCommand(input) {
  return pickString(
    input.command,
    input.shell_command,
    input.shellCommand,
    input.tool_input?.command,
    input.toolInput?.command,
    input.args?.command,
  );
}

function mcpName(input) {
  return pickString(
    input.server,
    input.serverName,
    input.server_name,
    input.tool,
    input.toolName,
    input.tool_name,
    input.name,
  );
}

function filePath(input) {
  return pickString(
    input.path,
    input.file,
    input.filePath,
    input.file_path,
    input.uri,
    input.tool_input?.path,
    input.toolInput?.path,
    input.args?.path,
  );
}

function audit(projectDir, record) {
  try {
    if (record.localLogsEnabled === false) return;
    const dir = join(projectDir, ".cursor", "ohc", "logs");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    appendFileSync(join(dir, "governance.jsonl"), JSON.stringify(record) + "\n");
  } catch {
    // Governance should never break normal Cursor usage.
  }
}

function permission(value, message) {
  return JSON.stringify({
    permission: value,
    user_message: message,
    agent_message: message,
  });
}

function empty() {
  return JSON.stringify({});
}

const SENSITIVE_FILE_RE =
  /(^|\/)(\.env(\..*)?|\.npmrc|\.pypirc|\.netrc|id_rsa|id_ed25519|\.ssh\/|\.cursor\/mcp\.json|mcp\.json)$/i;

function isSensitivePath(path) {
  return SENSITIVE_FILE_RE.test(String(path).replaceAll("\\", "/"));
}

function riskyShellReason(command) {
  const c = String(command).trim();
  const lower = c.toLowerCase();
  if (!c) return "";
  if (/\brm\s+-[^&|;\n]*r[^&|;\n]*f\s+(\/|\.\s*$|\.\s+|~|\$HOME)/i.test(c)) return "destructive recursive remove";
  if (/\bgit\s+reset\s+--hard\b/i.test(c)) return "destructive git reset";
  if (/\bgit\s+clean\s+-[^&|;\n]*f/i.test(c)) return "destructive git clean";
  if (/\bchmod\s+-r\s+777\b/i.test(lower)) return "unsafe recursive chmod";
  if (/(curl|wget)\b.*\|\s*(sh|bash|zsh)\b/i.test(c)) return "remote script pipe to shell";
  if (/\b(open|cat|sed|awk|grep)\b.*(\.env|id_rsa|id_ed25519|\.npmrc|\.pypirc|\.netrc)/i.test(c)) {
    return "secret file access from shell";
  }
  return "";
}

function riskyMcpReason(name, input) {
  const text = JSON.stringify({ name, input }).toLowerCase();
  if (/(install|add|create|write|delete|remove).*(mcp|server)/.test(text)) {
    return "MCP installation or server mutation should be explicit";
  }
  if (/(token|secret|password|api[_-]?key)/.test(text)) {
    return "MCP call appears to include secret material";
  }
  return "";
}

function main() {
  const input = readInput();
  const event = eventName(input);
  const projectDir = getProjectDir(input);
  const config = loadRuntimeConfig(scriptDir);
  const now = new Date().toISOString();
  const record = { time: now, event, localLogsEnabled: config.telemetry.localLogsEnabled };

  if (!config.enabled || !config.hooks.guardEnabled) {
    process.stdout.write(event.startsWith("before") ? permission("allow", "[OHC GOVERNANCE] Guard disabled by config.") : empty());
    return;
  }

  if (event === "beforeShellExecution") {
    const command = shellCommand(input);
    const reason = (config.safety.destructiveShellGuard || config.safety.destructiveGitGuard) ? riskyShellReason(command) : "";
    audit(projectDir, { ...record, command, decision: reason ? "deny" : "allow", reason });
    if (reason) {
      process.stdout.write(permission("deny", `[OHC GOVERNANCE] Blocked shell command: ${reason}. Ask the user before retrying.`));
      return;
    }
    process.stdout.write(permission("allow", "[OHC GOVERNANCE] Shell command allowed."));
    return;
  }

  if (event === "beforeMCPExecution") {
    const name = mcpName(input);
    const reason = config.safety.mcpGuardEnabled ? riskyMcpReason(name, input) : "";
    audit(projectDir, { ...record, mcp: name, decision: reason ? "deny" : "allow", reason });
    if (reason) {
      process.stdout.write(permission("deny", `[OHC GOVERNANCE] Blocked MCP call: ${reason}. Ask the user before retrying.`));
      return;
    }
    process.stdout.write(permission("allow", "[OHC GOVERNANCE] MCP call allowed."));
    return;
  }

  if (event === "beforeReadFile") {
    const path = filePath(input);
    const sensitive = isSensitivePath(path);
    audit(projectDir, { ...record, path, decision: sensitive ? "deny" : "allow", reason: sensitive ? "sensitive file read" : "" });
    if (sensitive) {
      process.stdout.write(permission("deny", "[OHC GOVERNANCE] Blocked sensitive file read. Ask the user before accessing secrets or MCP config."));
      return;
    }
    process.stdout.write(permission("allow", "[OHC GOVERNANCE] File read allowed."));
    return;
  }

  if (event === "afterFileEdit") {
    const path = filePath(input);
    audit(projectDir, { ...record, path, decision: "observe", sensitive: isSensitivePath(path) });
    process.stdout.write(empty());
    return;
  }

  if (event === "afterShellExecution" || event === "afterMCPExecution") {
    audit(projectDir, { ...record, decision: "observe" });
    process.stdout.write(empty());
    return;
  }

  process.stdout.write(empty());
}

main();
