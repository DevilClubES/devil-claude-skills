#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Invalid opaque hex color '${hex}'. Use #RGB or #RRGGBB.`);
  const expanded = match[1].length === 3 ? [...match[1]].map((value) => value + value).join("") : match[1];
  const [red, green, blue] = [0, 2, 4].map((index) => Number.parseInt(expanded.slice(index, index + 2), 16));
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

export function contrastRatio(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

async function loadPairs(args) {
  if (args[0] === "--matrix") {
    if (!args[1]) throw new Error("--matrix requires a JSON file path");
    const parsed = JSON.parse(await readFile(resolve(process.cwd(), args[1]), "utf8"));
    if (!Array.isArray(parsed)) throw new Error("contrast matrix must be a JSON array");
    return parsed;
  }
  if (args.length < 2) throw new Error("Usage: check-contrast.mjs <foreground> <background> [minimum] OR --matrix <file.json>");
  return [{ label: "pair", foreground: args[0], background: args[1], minimum: Number(args[2] ?? 4.5) }];
}

let failures = 0;
try {
  for (const [index, pair] of (await loadPairs(process.argv.slice(2))).entries()) {
    const minimum = Number(pair.minimum ?? 4.5);
    if (!Number.isFinite(minimum) || minimum <= 0) throw new Error(`Invalid minimum for matrix row ${index + 1}`);
    const ratio = contrastRatio(pair.foreground, pair.background);
    const passed = ratio + Number.EPSILON >= minimum;
    console.log(`${passed ? "PASS" : "FAIL"}: ${pair.label ?? `row ${index + 1}`} ${ratio.toFixed(2)}:1 (minimum ${minimum.toFixed(2)}:1)`);
    if (!passed) failures += 1;
  }
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exit(2);
}
if (failures) process.exit(1);
