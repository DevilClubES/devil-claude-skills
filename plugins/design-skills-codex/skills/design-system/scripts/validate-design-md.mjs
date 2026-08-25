#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const requestedPath = process.argv[2] ?? "DESIGN.md";
const filePath = resolve(process.cwd(), requestedPath);

const requiredKeys = [
  "version",
  "name",
  "description",
  "status",
  "last_verified",
  "sources",
  "colors",
  "typography",
  "spacing",
  "components",
];

const requiredHeadings = [
  "Overview",
  "Design Principles",
  "Color and Surface Strategy",
  "Typography Rules",
  "Layout",
  "Component Rules",
  "Accessibility",
  "Responsive Behavior",
  "Do's and Don'ts",
  "Implementation Mapping",
  "Agent Quick Reference",
  "Known Gaps",
];

const errors = [];
const warnings = [];

let source;
try {
  source = await readFile(filePath, "utf8");
} catch (error) {
  console.error(`ERROR: Cannot read ${filePath}: ${error.message}`);
  process.exit(1);
}

const lines = source.replaceAll("\r\n", "\n").split("\n");
if (lines[0]?.trim() !== "---") {
  errors.push("The file must start with YAML frontmatter delimited by ---.");
}

const closingDelimiter = lines.findIndex(
  (line, index) => index > 0 && line.trim() === "---",
);

if (closingDelimiter < 0) {
  errors.push("The YAML frontmatter has no closing --- delimiter.");
}

const frontmatterLines = closingDelimiter > 0 ? lines.slice(1, closingDelimiter) : [];
const bodyLines = closingDelimiter > 0 ? lines.slice(closingDelimiter + 1) : lines;
const topLevelKeys = new Set();

for (const line of frontmatterLines) {
  const match = /^([a-z][a-z0-9_-]*):(?:\s|$)/.exec(line);
  if (match) topLevelKeys.add(match[1]);
}

for (const key of requiredKeys) {
  if (!topLevelKeys.has(key)) errors.push(`Missing frontmatter key: ${key}`);
}

const statusLine = frontmatterLines.find((line) => /^status:\s*/.test(line));
if (statusLine) {
  const status = statusLine.replace(/^status:\s*/, "").replace(/^['\"]|['\"]$/g, "");
  if (!["draft", "verified", "deprecated"].includes(status)) {
    errors.push(`Invalid status '${status}'. Use draft, verified, or deprecated.`);
  }
}

const headings = new Set(
  bodyLines
    .map((line) => /^##\s+(.+?)\s*$/.exec(line)?.[1])
    .filter(Boolean),
);

for (const heading of requiredHeadings) {
  if (!headings.has(heading)) errors.push(`Missing section: ## ${heading}`);
}

const bracketPlaceholders = (source.match(/\[[^\]\n]+\](?!\()/g) ?? []).filter(
  (value) => !/^\[[ xX-]\]$/.test(value),
);
const unresolvedPlaceholders = [
  ...bracketPlaceholders,
  ...(source.match(/\{\{[^}]+\}\}/g) ?? []),
  ...(source.match(/YYYY-MM-DD/g) ?? []),
];

if (unresolvedPlaceholders.length > 0) {
  errors.push(
    `Unresolved template placeholders: ${[...new Set(unresolvedPlaceholders)].join(", ")}`,
  );
}

if (!frontmatterLines.some((line) => /^\s+-\s+kind:\s*/.test(line))) {
  errors.push("The sources list must contain at least one entry with kind.");
}

if (!bodyLines.some((line) => /verified|inferred|proposed/.test(line))) {
  warnings.push("Implementation Mapping should use verified, inferred, or proposed evidence labels.");
}

const body = bodyLines.join("\n");
const rawHexValues = body.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
if (rawHexValues.length > 0) {
  warnings.push(
    `Raw color values appear outside frontmatter (${[...new Set(rawHexValues)].join(", ")}); reference semantic color tokens instead.`,
  );
}

for (const message of errors) console.error(`ERROR: ${message}`);
for (const message of warnings) console.warn(`WARN: ${message}`);

if (errors.length > 0) {
  console.error(`FAIL: ${errors.length} error(s), ${warnings.length} warning(s) in ${requestedPath}`);
  process.exit(1);
}

console.log(`PASS: ${requestedPath} (${warnings.length} warning(s))`);
