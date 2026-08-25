#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";

const supported = new Set([".css", ".html", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const targets = process.argv.slice(2);
if (!targets.length) {
  console.error("ERROR: Usage: audit-motion.mjs <file-or-directory> [...]");
  process.exit(2);
}

async function collect(path) {
  const info = await stat(path);
  if (info.isFile()) return supported.has(extname(path).toLowerCase()) ? [path] : [];
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if ([".git", "node_modules", "dist", "build"].includes(entry.name)) continue;
    files.push(...await collect(resolve(path, entry.name)));
  }
  return files;
}

const files = [];
for (const target of targets) files.push(...await collect(resolve(process.cwd(), target)));
if (!files.length) {
  console.error("ERROR: No supported motion source files found.");
  process.exit(2);
}

const records = await Promise.all(files.map(async (path) => ({ path, source: await readFile(path, "utf8") })));
const corpus = records.map((record) => record.source).join("\n");
const hasMotion = /\b(?:animation|transition|scroll-behavior)\s*:|\b(?:animate|motion)\s*\(/i.test(corpus);
const hasReducedMotion = /prefers-reduced-motion/i.test(corpus);
const errors = [];
const warnings = [];

for (const { path, source } of records) {
  const lines = source.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/transition\s*:\s*all\b/i.test(line)) errors.push(`${path}:${index + 1} uses transition: all`);
    if (/animation(?:-[a-z-]+)?\s*:[^;\n]*\binfinite\b/i.test(line)) warnings.push(`${path}:${index + 1} contains an infinite animation; verify purpose, pause behavior, and visibility`);
    for (const match of line.matchAll(/(?:duration|transition|animation)[^;\n]*?([0-9]+(?:\.[0-9]+)?)s\b/gi)) {
      if (Number(match[1]) > 1) warnings.push(`${path}:${index + 1} contains motion longer than 1s; verify frequency and interruption`);
    }
  });
}
if (hasMotion && !hasReducedMotion) errors.push("motion exists but no prefers-reduced-motion handling was found in the inspected target");

for (const message of errors) console.error(`ERROR: ${message}`);
for (const message of warnings) console.warn(`WARN: ${message}`);
if (errors.length) {
  console.error(`FAIL: ${errors.length} motion error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(`PASS: ${files.length} motion source file(s), ${warnings.length} warning(s).`);
