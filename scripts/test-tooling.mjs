#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";

const repoRoot = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/, "")), "..");
const contrast = join(repoRoot, "plugins", "design-skills", "scripts", "check-contrast.mjs");
const motion = join(repoRoot, "plugins", "design-skills", "scripts", "audit-motion.mjs");

function run(label, script, args, expectedSuccess) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd: repoRoot, encoding: "utf8" });
  const succeeded = result.status === 0;
  if (succeeded !== expectedSuccess) {
    console.error(`FAIL: ${label} returned ${result.status}`);
    if (result.stdout) console.error(result.stdout.trim());
    if (result.stderr) console.error(result.stderr.trim());
    process.exit(1);
  }
  console.log(`PASS: ${label}`);
}

run("passing contrast matrix", contrast, ["--matrix", "tests/fixtures/contrast-pass.json"], true);
run("failing contrast matrix rejects", contrast, ["--matrix", "tests/fixtures/contrast-fail.json"], false);
run("motion-safe fixture", motion, ["tests/fixtures/motion-good.css"], true);
run("motion defect fixture rejects", motion, ["tests/fixtures/motion-bad.css"], false);
console.log("PASS: deterministic tooling tests completed.");
