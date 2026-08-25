# Devil Design Skills

Curated, evidence-driven design workflows used at [Devil Club](https://devil.club). Release `1.2.0` provides one reviewed source for Claude Code plus a deterministic Codex adapter, so the two runtimes do not drift through hand edits.

## Skills

| Skill | Primary job |
|---|---|
| `design-studio` | Explore, build, refine, tweak, critique, and verify production UI |
| `design-critique` | Give evidence-backed feedback and a readiness verdict |
| `design-system` | Audit, capture, validate, document, or extend `DESIGN.md` |
| `design-handoff` | Produce an engineering handoff from a design |
| `accessibility-review` | Run a WCAG 2.1 AA design or page audit |
| `ux-copy` | Write or review interface copy |
| `user-research` | Plan and conduct user research |
| `research-synthesis` | Turn research evidence into themes and recommendations |
| `landing-page-design` | Design and verify a conversion-focused landing page |
| `interface-review` | Review an implementation and its blast radius without editing |
| `variant` | Build three isolated variants and pause for selection |
| `component-stress-test` | Exercise a component across content, state, and viewport extremes |

`interface-review`, `variant`, and `component-stress-test` are explicit-only workflows. They do not run merely because a request resembles their domain.

## Install for Claude Code

In Claude Code:

```text
/plugin marketplace add DevilClubES/devil-claude-skills
/plugin install design-skills@devil-claude-skills
```

The skills are available under `/design-skills:`. After an update, run `/reload-plugins` or restart Claude Code.

## Install for Codex

The repo-local Codex marketplace is at `.agents/plugins/marketplace.json` and exposes `design-skills-codex`. Clone or open this repository in Codex, then install that plugin from the repository marketplace. The generated package lives at `plugins/design-skills-codex`.

Do not edit the generated Codex package directly. Change `plugins/design-skills`, then run:

```powershell
node scripts/sync-codex-package.mjs
node scripts/sync-codex-package.mjs --check
```

The adapter removes Claude-only frontmatter, translates invocation examples and state paths, and writes Codex `agents/openai.yaml` metadata while preserving the same substantive instructions and references.

## Core workflow

The design studio connects the system, critique, accessibility, copy, and handoff skills into a bounded production loop:

```text
/design-skills:design-studio explore <brief>
/design-skills:design-studio build <brief or direction>
/design-skills:design-studio refine <artifact and goal>
/design-skills:design-studio tweak <target and change>
/design-skills:design-studio ship <artifact>
```

It classifies existing work as extension, preservation-led redesign, or overhaul; calibrates five design dials; records reference provenance; inspects rendered mobile and desktop states; and runs a five-lens readiness jury. `ship` is a readiness check, not permission to merge, deploy, or publish.

The design-system skill can capture and validate a project-owned `DESIGN.md`:

```text
/design-skills:design-system capture
/design-skills:design-system validate DESIGN.md
```

## Repository checks

Run all deterministic checks before proposing a release:

```powershell
node scripts/lint-skills.mjs
node scripts/sync-codex-package.mjs --check
node scripts/test-tooling.mjs
```

`scripts/verify-runtime-sync.ps1` can also compare a checkout with optional local Claude, local Codex, and VPS plugin roots. It is read-only and never installs or updates a runtime.

Tags matching `v*` build separate Claude and Codex ZIP files plus SHA-256 checksum files. Creating a tag or release remains a separate maintainer action.

## Design principles and provenance

This collection selectively adapts reusable mechanisms from the projects listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). It does not bulk-import their skill catalogs, assets, visual systems, examples, or brand identity. The retained mechanisms include calibrated design direction, purpose-led motion, originality checks, blast-radius review, isolated variants, deterministic contrast checks, and agent-readable contracts.

See [LICENSE](LICENSE) for this repository's MIT license and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for source repositories, pinned commits, licenses, and adaptation boundaries.
