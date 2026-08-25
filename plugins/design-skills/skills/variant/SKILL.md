---
name: variant
description: Create exactly three isolated, meaningfully different interface variants, compare them against one success contract, and pause before promotion. Use only when the user explicitly invokes this workflow to explore alternatives for a specific existing or proposed UI; use design-studio for a complete design project and ux-copy for text-only alternatives.
argument-hint: "<target, goal, constraints, and optional direction>"
disable-model-invocation: true
---

# /design-skills:variant

Build a bounded comparison without overwriting the current implementation or quietly choosing a winner.

## Invocation

```text
/design-skills:variant $ARGUMENTS
```

Explicit invocation authorizes creation of isolated comparison artifacts for the named target. It does not authorize replacing production code, deleting the baseline, merging, deploying, or publishing.

## Contract

Before editing, establish:

- Target component, section, screen, or flow
- User job and measurable success condition
- Existing `DESIGN.md`, tokens, APIs, content, and accessibility constraints
- Properties that must remain invariant
- Where isolated variants can safely live in this repository

Prefer the project's existing Storybook, examples, playground, fixture, or preview convention. Otherwise create a clearly named temporary comparison surface inside the repository's accepted scratch or demo area. Never fork the whole application when a component-level harness will prove the decision.

## Create three real alternatives

Produce exactly three variants. They must differ in structure, interaction, hierarchy, density, or visual mechanism—not only color, copy, or border radius.

- `A — Conservative`: strongest continuity with the existing product.
- `B — Balanced`: one meaningful structural or interaction improvement with controlled risk.
- `C — Exploratory`: pushes one justified design dial while preserving the brief and accessibility.

All variants must use the same representative content and success contract. Preserve semantic behavior, keyboard access, responsive support, and truthful claims. Record any necessary exception.

## Compare with evidence

Render all three at equivalent mobile and desktop viewports and the same key states. Compare:

| Dimension | A | B | C |
|---|---|---|---|
| User-job clarity | | | |
| Hierarchy and scan path | | | |
| System/brand fit | | | |
| Accessibility and states | | | |
| Implementation cost and risk | | | |
| Distinctive product value | | | |

Recommend one variant and name its tradeoff. Do not promote it yet.

## Selection gate

Pause after presenting the comparison. Promotion requires the user's explicit selection or an explicit instruction to choose and continue. After selection:

1. Apply only the selected mechanism to the real target.
2. Preserve unrelated behavior and remove comparison-only wiring when authorized.
3. Re-render and verify the production surface.
4. Report the promoted variant, changed files, and remaining differences.

If no variant meets the contract, say so and recommend revisiting the brief instead of promoting the least-bad option.

## Provenance

The explicit invocation, isolated comparison, and selection-before-promotion gate are independently adapted from `jakubkrehel/skills` at commit `ca483852de23` and calibrated variation from `ConardLi/garden-skills` at commit `aaf9a82f5efd` (MIT). Wording and workflow are original to this project.
