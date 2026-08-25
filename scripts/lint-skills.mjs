#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

const repoRoot = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/, "")), "..");
const pluginRoot = join(repoRoot, "plugins", "design-skills");
const skillsRoot = join(pluginRoot, "skills");
const expectedSkills = [
  "accessibility-review",
  "component-stress-test",
  "design-critique",
  "design-handoff",
  "design-studio",
  "design-system",
  "interface-review",
  "landing-page-design",
  "research-synthesis",
  "user-research",
  "ux-copy",
  "variant",
];
const explicitOnly = new Set(["component-stress-test", "interface-review", "variant"]);
const errors = [];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

function frontmatter(source, file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  if (!match) {
    errors.push(`${file}: missing YAML frontmatter`);
    return new Map();
  }
  const fields = new Map();
  for (const line of match[1].split(/\r?\n/)) {
    const field = /^([a-z][a-z0-9-]*):\s*(.*)$/.exec(line);
    if (field) fields.set(field[1], field[2].replace(/^['"]|['"]$/g, "").trim());
  }
  return fields;
}

const actualSkills = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
if (actualSkills.join("\n") !== expectedSkills.join("\n")) {
  errors.push(`skill inventory mismatch; expected ${expectedSkills.join(", ")}, got ${actualSkills.join(", ")}`);
}

for (const name of actualSkills) {
  const path = join(skillsRoot, name, "SKILL.md");
  const source = await readFile(path, "utf8");
  const fields = frontmatter(source, relative(repoRoot, path));
  if (fields.get("name") !== name) errors.push(`${name}: frontmatter name must match directory`);
  const description = fields.get("description") ?? "";
  if (description.length < 40 || description.length > 1024) errors.push(`${name}: description must be 40-1024 characters`);
  const disabled = fields.get("disable-model-invocation") === "true";
  if (explicitOnly.has(name) !== disabled) {
    errors.push(`${name}: explicit-only frontmatter does not match repository policy`);
  }
  if (!source.includes(`# /design-skills:${name}`)) errors.push(`${name}: missing namespaced Claude heading`);
  if (/\[TODO:[^\]]*\]/.test(source)) errors.push(`${name}: unresolved TODO marker`);
}

for (const path of await walk(pluginRoot)) {
  if (!path.endsWith(".md")) continue;
  const source = await readFile(path, "utf8");
  for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].split("#", 1)[0];
    if (!target || /^(?:https?:|mailto:)/.test(target)) continue;
    const resolved = resolve(dirname(path), target.replaceAll("/", process.platform === "win32" ? "\\" : "/"));
    if (!await exists(resolved)) errors.push(`${relative(repoRoot, path)}: broken local link ${match[1]}`);
  }
}

const claudeManifest = JSON.parse(await readFile(join(pluginRoot, ".claude-plugin", "plugin.json"), "utf8"));
const marketplace = JSON.parse(await readFile(join(repoRoot, ".claude-plugin", "marketplace.json"), "utf8"));
if (claudeManifest.version !== marketplace.plugins?.[0]?.version) errors.push("Claude manifest and marketplace versions differ");
if (!/^\d+\.\d+\.\d+$/.test(claudeManifest.version)) errors.push("plugin version must use strict semver");

const codexRoot = join(repoRoot, "plugins", "design-skills-codex");
const codexManifest = JSON.parse(await readFile(join(codexRoot, ".codex-plugin", "plugin.json"), "utf8"));
if (claudeManifest.version !== codexManifest.version) errors.push("Claude and Codex plugin versions differ");
for (const name of expectedSkills) {
  const agentPath = join(codexRoot, "skills", name, "agents", "openai.yaml");
  const agent = await readFile(agentPath, "utf8");
  const shortDescription = /^\s*short_description:\s*["'](.+)["']$/m.exec(agent)?.[1] ?? "";
  if (shortDescription.length < 25 || shortDescription.length > 64) {
    errors.push(`${name}: Codex short_description must be 25-64 characters`);
  }
  if (!agent.includes(`$${name}`)) errors.push(`${name}: Codex default_prompt must name the skill`);
  const implicit = /^\s*allow_implicit_invocation:\s*(true|false)$/m.exec(agent)?.[1];
  if ((implicit === "false") !== explicitOnly.has(name)) {
    errors.push(`${name}: Codex invocation policy does not match repository policy`);
  }
}

const codexMarketplace = JSON.parse(await readFile(join(repoRoot, ".agents", "plugins", "marketplace.json"), "utf8"));
const codexEntry = codexMarketplace.plugins?.find((entry) => entry.name === "design-skills-codex");
if (codexEntry?.source?.path !== "./plugins/design-skills-codex") errors.push("Codex marketplace source path is invalid");
if (codexEntry?.policy?.installation !== "AVAILABLE" || codexEntry?.policy?.authentication !== "ON_INSTALL") {
  errors.push("Codex marketplace policy is incomplete");
}
for (const required of ["LICENSE", "THIRD_PARTY_NOTICES.md", "AGENTS.md"]) {
  if (!await exists(join(repoRoot, required))) errors.push(`missing ${required}`);
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  console.error(`FAIL: ${errors.length} repository skill error(s).`);
  process.exit(1);
}
console.log(`PASS: ${actualSkills.length} canonical skills and repository contracts validated.`);
