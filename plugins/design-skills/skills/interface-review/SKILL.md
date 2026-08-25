---
name: interface-review
description: Inspect an implemented interface and report evidence-backed regressions, blast radius, removed behavior, and release risk without changing files. Use only when the user explicitly invokes this read-only workflow for a diff, branch, pull request, component, route, or running UI; use design-critique for general visual feedback and accessibility-review for a dedicated WCAG audit.
argument-hint: "<diff, branch, component, route, or running interface>"
disable-model-invocation: true
---

# /design-skills:interface-review

Review an interface implementation as a read-only engineering and design gate. Do not edit files, create fixes, stage changes, push, merge, deploy, or publish.

## Scope

```text
/design-skills:interface-review $ARGUMENTS
```

Identify the exact review target and base. For a branch or pull request, verify the comparison base and inspect the actual diff, including added, modified, renamed, and removed lines. For a running surface, record the route, build, viewport, state, and available source revision.

If the target cannot be located, return `BLOCKED` with the missing evidence. Do not silently substitute a nearby screen or stale build.

## Review order

1. Read repository instructions, `DESIGN.md`, relevant component contracts, and test conventions.
2. Establish the change inventory: files, components, routes, tokens, shared primitives, assets, copy, analytics, and tests.
3. Trace blast radius through imports, variants, selectors, token consumers, responsive rules, and shared state.
4. Inspect removed lines and deleted behavior separately. Confirm whether focus handling, labels, validation, empty/error/loading states, analytics, or responsive fallbacks disappeared.
5. Run focused static checks and existing tests that are safe and relevant.
6. Inspect the rendered affected surface when available, including one mobile and one desktop viewport plus the changed interaction state.
7. Compare the result against the user request and existing system contract.

## Finding standard

Report only actionable findings introduced or exposed by the target change. Each finding needs:

- `Severity`: P0 critical, P1 high, P2 medium, or P3 low.
- `Evidence`: exact file/line, DOM state, screenshot, runtime behavior, or test result.
- `Impact`: user, product, accessibility, system, or maintenance consequence.
- `Blast radius`: known consumers and states affected.
- `Correction`: the smallest concrete fix, without implementing it.

Do not flag preference-only differences as defects. Do not claim a regression without a base comparison or an established contract.

## Required checks

- Primary action, navigation, form, and destructive paths still work.
- Focus order, accessible names, semantics, keyboard behavior, and reduced-motion behavior were not removed.
- Loading, empty, error, disabled, long-content, and narrow-layout behavior remain reachable.
- Shared tokens and primitives did not change unrelated surfaces unintentionally.
- Removed code is either intentionally obsolete or replaced by equivalent behavior.
- New visuals use real claims and assets and preserve the product's identity.
- Tests cover the changed contract, including at least one failure-restoring case when practical.

## Output

```markdown
## Interface Review

**Verdict:** READY / REVISE / BLOCKED
**Target and base:** [exact revisions, route, or artifact]
**Evidence:** [diff, runtime, viewports, states, tests]

### Change inventory and blast radius
[Concise map]

### Findings
| Priority | Evidence | Impact | Blast radius | Correction |
|---|---|---|---|---|

### Removed behavior checked
- [Removed line or behavior and result]

### Verification gaps
- [Missing evidence or none]
```

Use `READY` only when no actionable P0-P2 finding remains and the affected runtime states were inspected. `BLOCKED` means evidence is insufficient for a defensible verdict, not that the code is necessarily wrong.

## Provenance

The explicit read-only boundary, blast-radius analysis, and removed-line review are independently adapted from `jakubkrehel/skills` at commit `ca483852de23` (MIT). Wording and output contract are original to this project.
