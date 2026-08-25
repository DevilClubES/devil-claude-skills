#!/usr/bin/env node

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";

const repoRoot = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/, "")), "..");
const sourceRoot = join(repoRoot, "plugins", "design-skills");
const outputRoot = join(repoRoot, "plugins", "design-skills-codex");
const checkOnly = process.argv.includes("--check");

const skillMetadata = {
  "accessibility-review": {
    display: "Accessibility Review",
    short: "Audit a design for WCAG 2.1 AA issues",
    prompt: "Use $accessibility-review to audit this design for WCAG 2.1 AA issues.",
  },
  "component-stress-test": {
    display: "Component Stress Test",
    short: "Stress-test a component across edge states",
    prompt: "Use $component-stress-test to exercise this component across its edge states.",
    implicit: false,
  },
  "design-critique": {
    display: "Design Critique",
    short: "Review a design with evidence-backed feedback",
    prompt: "Use $design-critique to review this design and prioritize the strongest improvements.",
  },
  "design-handoff": {
    display: "Design Handoff",
    short: "Turn a design into an engineering-ready spec",
    prompt: "Use $design-handoff to turn this design into an engineering-ready specification.",
  },
  "design-studio": {
    display: "Design Studio",
    short: "Run a brief-to-verified-interface design loop",
    prompt: "Use $design-studio to turn this brief into a visually verified interface.",
  },
  "design-system": {
    display: "Design System",
    short: "Capture and validate a project design system",
    prompt: "Use $design-system to capture or validate this project's design system.",
  },
  "interface-review": {
    display: "Interface Review",
    short: "Review interface changes and blast radius",
    prompt: "Use $interface-review to review this interface change and its blast radius without editing files.",
    implicit: false,
  },
  "landing-page-design": {
    display: "Landing Page Design",
    short: "Design a truthful conversion-focused landing page",
    prompt: "Use $landing-page-design to design and verify this conversion-focused landing page.",
  },
  "research-synthesis": {
    display: "Research Synthesis",
    short: "Synthesize research into prioritized insights",
    prompt: "Use $research-synthesis to turn this research evidence into prioritized insights.",
  },
  "user-research": {
    display: "User Research",
    short: "Plan rigorous user research and test materials",
    prompt: "Use $user-research to plan this study and create the required research materials.",
  },
  "ux-copy": {
    display: "UX Copy",
    short: "Write clear, contextual interface copy",
    prompt: "Use $ux-copy to write clear interface copy for this user state.",
  },
  variant: {
    display: "Interface Variants",
    short: "Create and compare three isolated UI variants",
    prompt: "Use $variant to create three isolated UI variants and pause before promotion.",
    implicit: false,
  },
};

function posix(path) {
  return path.split(sep).join("/");
}

async function listFiles(root) {
  const files = [];
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) files.push(absolute);
    }
  }
  try {
    await visit(root);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return files.sort();
}

function transformRuntimeText(source) {
  let result = source.replaceAll(".claude/design-studio.md", ".agents/design-studio.md");
  result = result.replaceAll("${CLAUDE_SKILL_DIR}", "<design-system-skill-directory>");
  result = result.replaceAll("$ARGUMENTS", "the current request");
  for (const name of Object.keys(skillMetadata)) {
    result = result.replaceAll(`/design-skills:${name}`, `$${name}`);
  }
  return result;
}

function transformSkill(source, skillName) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  if (!match) throw new Error(`Invalid frontmatter in ${skillName}/SKILL.md`);
  const name = /^name:\s*(.+)$/m.exec(match[1])?.[1]?.trim();
  const description = /^description:\s*(.+)$/m.exec(match[1])?.[1]?.trim();
  if (name !== skillName || !description) {
    throw new Error(`Frontmatter mismatch in ${skillName}/SKILL.md`);
  }
  let body = transformRuntimeText(source.slice(match[0].length));
  body = body.replace(new RegExp(`^# \\$${skillName.replaceAll("-", "\\-")}$`, "m"), `# ${skillMetadata[skillName].display}`);
  return `---\nname: ${name}\ndescription: ${description}\n---\n\n${body.trimStart()}`;
}

function agentYaml(name) {
  const metadata = skillMetadata[name];
  return [
    "interface:",
    `  display_name: ${JSON.stringify(metadata.display)}`,
    `  short_description: ${JSON.stringify(metadata.short)}`,
    `  default_prompt: ${JSON.stringify(metadata.prompt)}`,
    "policy:",
    `  allow_implicit_invocation: ${metadata.implicit === false ? "false" : "true"}`,
    "",
  ].join("\n");
}

function pluginManifest(version) {
  return `${JSON.stringify({
    name: "design-skills-codex",
    version,
    description: "Twelve evidence-driven design, UX, accessibility, research, and interface-verification skills for Codex.",
    author: {
      name: "Devil Club",
      email: "edgar.ondono@gmail.com",
      url: "https://github.com/DevilClubES",
    },
    homepage: "https://github.com/DevilClubES/devil-claude-skills",
    repository: "https://github.com/DevilClubES/devil-claude-skills",
    license: "MIT",
    keywords: ["design", "ux", "accessibility", "research", "codex"],
    skills: "./skills/",
    interface: {
      displayName: "Devil Design Skills",
      shortDescription: "Evidence-driven product design workflows for Codex",
      longDescription: "Design, review, stress-test, document, and hand off digital interfaces with rendered evidence, explicit scope boundaries, and deterministic checks.",
      developerName: "Devil Club",
      category: "Developer Tools",
      capabilities: ["Design", "Write", "Interactive"],
      websiteURL: "https://devil.club/",
      defaultPrompt: [
        "Build and verify this interface from the brief.",
        "Review this design and prioritize improvements.",
        "Capture this project's design system.",
      ],
      brandColor: "#7C3AED",
    },
  }, null, 2)}\n`;
}

async function buildExpected() {
  const expected = new Map();
  const claudeManifest = JSON.parse(await readFile(join(sourceRoot, ".claude-plugin", "plugin.json"), "utf8"));
  const sourceFiles = await listFiles(sourceRoot);

  for (const absolute of sourceFiles) {
    const relativePath = posix(relative(sourceRoot, absolute));
    if (relativePath.startsWith(".claude-plugin/")) continue;
    const parts = relativePath.split("/");
    const skillName = parts[0] === "skills" ? parts[1] : undefined;
    if (skillName && !skillMetadata[skillName]) {
      throw new Error(`Missing Codex metadata for skill '${skillName}'`);
    }
    const source = await readFile(absolute);
    if (absolute.endsWith(".md")) {
      const text = source.toString("utf8");
      expected.set(relativePath, Buffer.from(parts.at(-1) === "SKILL.md" ? transformSkill(text, skillName) : transformRuntimeText(text)));
    } else {
      expected.set(relativePath, source);
    }
  }

  for (const name of Object.keys(skillMetadata)) {
    expected.set(`skills/${name}/agents/openai.yaml`, Buffer.from(agentYaml(name)));
  }
  expected.set(".codex-plugin/plugin.json", Buffer.from(pluginManifest(claudeManifest.version)));
  expected.set("GENERATED.md", Buffer.from("# Generated package\n\nThis Codex plugin is generated from `plugins/design-skills`. Do not edit it directly. Run `node scripts/sync-codex-package.mjs` from the repository root.\n"));
  return expected;
}

async function check(expected) {
  const actualFiles = await listFiles(outputRoot);
  const actual = new Set(actualFiles.map((path) => posix(relative(outputRoot, path))));
  const errors = [];
  for (const [path, contents] of expected) {
    const absolute = join(outputRoot, path);
    if (!actual.has(path)) {
      errors.push(`missing ${path}`);
      continue;
    }
    const current = await readFile(absolute);
    if (!current.equals(contents)) errors.push(`stale ${path}`);
    actual.delete(path);
  }
  for (const path of [...actual].sort()) errors.push(`unexpected ${path}`);
  if (errors.length) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    console.error("FAIL: Codex package is not synchronized.");
    process.exitCode = 1;
    return;
  }
  console.log(`PASS: Codex package synchronized (${expected.size} files).`);
}

async function write(expected) {
  const resolvedOutput = resolve(outputRoot);
  const expectedOutput = resolve(repoRoot, "plugins", "design-skills-codex");
  if (resolvedOutput !== expectedOutput || !resolvedOutput.startsWith(`${resolve(repoRoot)}${sep}`)) {
    throw new Error(`Refusing to replace unexpected output path: ${resolvedOutput}`);
  }
  await rm(resolvedOutput, { recursive: true, force: true });
  for (const [path, contents] of expected) {
    const absolute = join(resolvedOutput, path);
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, contents);
  }
  console.log(`WROTE: ${expected.size} generated Codex files.`);
}

const expected = await buildExpected();
if (checkOnly) await check(expected);
else await write(expected);
