---
name: design-system
description: Audit, capture, document, validate, or extend a design system. Use when checking token or component consistency, creating or updating a project-level DESIGN.md, documenting component variants and states, validating design documentation against implementation, or designing a new pattern that must fit an existing visual language.
argument-hint: "[audit | capture | document | extend | validate] [target]"
---

# /design-skills:design-system

> For optional connector placeholders and fallback behavior, see [CONNECTORS.md](../../CONNECTORS.md).

Manage a design system from evidence to an agent-readable contract.

## Usage

```text
/design-skills:design-system audit [scope]
/design-skills:design-system capture [source or output path]
/design-skills:design-system document [component]
/design-skills:design-system extend [pattern]
/design-skills:design-system validate [DESIGN.md path]
```

Work on: $ARGUMENTS

## Operating Rules

1. **Inspect before proposing.** Read repository instructions, existing `DESIGN.md`, tokens, global styles, component primitives, and representative screens.
2. **Separate truth from intent.** Label rules as `verified`, `inferred`, or `proposed`. Never present a screenshot inference as an implemented token.
3. **Resolve conflicts explicitly.** When code, design files, and prose disagree, report drift and identify which source currently ships.
4. **Use semantic tokens.** Prefer roles such as `action-primary` and `text-muted` over brand-shaped names or raw values in components.
5. **Document behavior, not just appearance.** Include variants, states, responsive changes, content limits, accessibility, and motion preferences.
6. **Preserve identity without cloning.** When studying another product, transfer principles and patterns; do not copy logos, product copy, proprietary assets, or licensed fonts.
7. **Keep one canonical value.** Store exact token values once and reference their token names elsewhere to prevent drift.
8. **Do not modify product code during an audit or validation.** Make implementation changes only when the user explicitly requests them.

## Evidence Order

Use the strongest available source for each claim:

1. Shipped code and generated token output
2. Maintained design source such as Figma variables and components
3. Running product inspected at the relevant breakpoint and state
4. Approved design documentation
5. Screenshots or verbal descriptions

Record the source location and verification date for the resulting system contract. If only weak evidence is available, keep `status: draft` and list the gap.

## Core Workflow

1. Read project instructions and identify the requested mode.
2. Inventory existing foundations: colors, typography, spacing, radii, borders, elevation, motion, layout, and breakpoints.
3. Inventory reusable components and their variants, states, and accessibility behavior.
4. Compare declared tokens with actual usage; count hardcoded or arbitrary values instead of relying on examples alone.
5. Execute the selected mode.
6. Verify claims against at least one representative implementation source.
7. Report what was verified, inferred, changed, and still unknown.

## Mode: `capture`

Create or update a project-level `DESIGN.md` that coding agents can follow consistently.

Read [design-md-contract.md](references/design-md-contract.md) completely before authoring. Use its schema and copy-ready template.

Capture all of the following when evidence exists:

- Visual atmosphere and governing principles
- Semantic color and surface roles, including contrast pairings
- Typography hierarchy with family, size, weight, line height, and tracking
- Spacing, radii, borders, elevation, and motion tokens
- Layout container, grid, density, and whitespace rhythm
- Components with variants and default, hover, focus, active, disabled, loading, error, and empty states as applicable
- Responsive breakpoints, collapsing behavior, touch targets, and overflow strategy
- Accessibility requirements, including focus, contrast, keyboard, reduced motion, and zoom/reflow
- Content, iconography, imagery, and data-visualization rules when relevant
- Do's, don'ts, implementation mappings, agent quick reference, and known gaps

For an update, preserve verified project-specific decisions and change only claims supported by stronger or newer evidence. Do not replace the project's identity with a borrowed brand style.

After writing, run:

```text
node "${CLAUDE_SKILL_DIR}/scripts/validate-design-md.mjs" DESIGN.md
```

Fix every error. Treat warnings as review items and explain any intentionally retained warning.

## Mode: `validate`

Validate structure and truth separately:

1. Run the bundled validator against the requested file.
2. Check every source path or URL that is available.
3. Sample at least one color, typography, spacing, component, responsive, and accessibility claim against implementation.
4. Flag stale values, unresolved placeholders, duplicated raw values, missing states, and unsupported assertions.
5. Return `pass`, `pass with warnings`, or `fail`, with exact fixes.

The validator checks document completeness; it does not prove that documented values match the product.

## Mode: `audit`

Audit naming, token coverage, component completeness, implementation drift, responsive behavior, accessibility, and documentation freshness.

Return:

```markdown
## Design System Audit

### Summary
**Scope:** [scope] | **Sources:** [sources] | **Status:** [pass/warn/fail]

### Findings
| Severity | Area | Evidence | Impact | Recommendation |
|---|---|---|---|---|
| Critical / High / Medium / Low | [area] | [path, component, or screen] | [user/team impact] | [specific action] |

### Coverage
| Area | Defined | Implemented | Documented | Drift |
|---|---:|---:|---:|---:|
| Colors | [count] | [count] | [count] | [count] |

### Priority Actions
1. [Highest-impact correction]
2. [Next correction]
3. [Next correction]
```

## Mode: `document`

Document a component from its actual implementation and design source.

Include:

- Purpose and when not to use it
- Anatomy and content rules
- API or properties
- Variants and sizes
- State matrix, including keyboard and screen-reader behavior
- Tokens used, with no unexplained raw values
- Responsive and localization behavior
- Do's, don'ts, code example, source paths, and known gaps

If documenting the whole system rather than one component, use the `capture` contract.

## Mode: `extend`

Design a new pattern that composes existing foundations before adding tokens or primitives.

Return:

```markdown
## Proposed Pattern: [Name]

### Problem and User Need
[Problem this solves]

### Existing Patterns Considered
| Pattern | Reuse | Gap |
|---|---|---|
| [existing component] | [what carries over] | [why extension is needed] |

### Specification
- Anatomy: [parts]
- Variants and sizes: [rules]
- States and behavior: [matrix or list]
- Tokens: [existing tokens first; proposed tokens clearly labeled]
- Responsive behavior: [changes]
- Accessibility: [role, keyboard, focus, announcements]

### Migration and Validation
[Adoption path, compatibility, and tests]

### Open Questions
- [Decision requiring review]
```

## Optional Connectors

When a design tool is connected, inspect variables, component properties, and representative frames. When a knowledge base is connected, reconcile approved documentation. If neither is available, continue from repository evidence and user-provided artifacts, then state the limitation.

Never claim connector-derived evidence unless it was actually retrieved in the current run.
