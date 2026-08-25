# DESIGN.md Contract

Use this contract when creating or materially updating a project-level `DESIGN.md`.

## Contents

1. [Contract rules](#contract-rules)
2. [Status and evidence](#status-and-evidence)
3. [Copy-ready template](#copy-ready-template)
4. [Review checklist](#review-checklist)

## Contract Rules

- Keep exact token values in YAML frontmatter and reference token names in prose.
- Use semantic, product-owned names. Avoid names copied from a reference brand.
- Include only observed tokens and components. Put uncertain or absent behavior in `Known Gaps`.
- Use `verified` only after sampling the document against the current implementation.
- Add or remove token groups to fit the product, but retain the required top-level keys.
- Document only component states that apply. Explicitly say when a state is intentionally absent.
- Keep implementation paths repository-relative so agents can find the source.
- Update `last_verified` whenever implementation evidence is checked.

Required frontmatter keys:

`version`, `name`, `description`, `status`, `last_verified`, `sources`, `colors`, `typography`, `spacing`, `components`.

Recommended token groups:

`radii`, `borders`, `elevation`, `motion`, and any product-specific group such as `data-visualization`.

## Status and Evidence

Use one document status:

- `draft`: incomplete, inferred, or not yet checked against implementation.
- `verified`: sampled against the current implementation and all errors resolved.
- `deprecated`: retained only for migration or historical context.

Each source entry must identify its kind, location, scope, and verification date. Prefer `code`, `design`, `live`, `docs`, or `screenshot` as source kinds.

## Copy-Ready Template

Replace every bracketed placeholder. Remove examples that do not apply.

```markdown
---
version: 1
name: "[Product design system]"
description: "[One sentence describing the product's visual language and intended surfaces.]"
status: draft
last_verified: "YYYY-MM-DD"
sources:
  - kind: code
    location: "[repository-relative path]"
    scope: "[tokens, components, or screens checked]"
    verified: "YYYY-MM-DD"
colors:
  action-primary:
    value: "#000000"
    role: "Primary action background"
    content: "{colors.text-on-action}"
  text-primary:
    value: "#111111"
    role: "Primary text on light surfaces"
  text-on-action:
    value: "#ffffff"
    role: "Text and icons on action-primary"
  surface-canvas:
    value: "#ffffff"
    role: "Default page background"
typography:
  display-lg:
    family: "[family and fallbacks]"
    size: "[value]"
    weight: "[value]"
    line_height: "[value]"
    letter_spacing: "[value]"
    role: "Primary page heading"
  body-md:
    family: "[family and fallbacks]"
    size: "[value]"
    weight: "[value]"
    line_height: "[value]"
    letter_spacing: "[value]"
    role: "Default body copy"
spacing:
  xs: "[value]"
  sm: "[value]"
  md: "[value]"
  lg: "[value]"
  section: "[value or responsive expression]"
radii:
  sm: "[value]"
  md: "[value]"
  pill: "9999px"
borders:
  subtle: "[width style token-reference]"
elevation:
  raised: "[shadow or surface treatment]"
motion:
  fast: "[duration easing]"
  standard: "[duration easing]"
components:
  button-primary:
    purpose: "Primary action"
    tokens:
      - "{colors.action-primary}"
      - "{colors.text-on-action}"
      - "{radii.md}"
    states:
      default: "[treatment]"
      hover: "[treatment]"
      focus: "[visible focus treatment]"
      active: "[treatment]"
      disabled: "[treatment and behavior]"
---

# [Product] Design System

## Overview

[Atmosphere, product context, supported surfaces, and the most recognizable visual decisions.]

## Design Principles

1. **[Principle]** — [Concrete consequence for implementation.]
2. **[Principle]** — [Concrete consequence for implementation.]
3. **[Principle]** — [Concrete consequence for implementation.]

## Color and Surface Strategy

[Explain hierarchy and pairings using token references such as `{colors.surface-canvas}`. Include semantic success, warning, and error behavior when present.]

## Typography Rules

[Explain hierarchy, fallbacks, wrapping, truncation, localization, and when each role applies.]

## Layout

### Grid and Container

[Maximum width, columns, gutters, alignment, and full-bleed exceptions.]

### Density and Spacing

[Section rhythm, component density, and intentional whitespace.]

## Component Rules

[Document component anatomy, variants, state behavior, token references, content limits, and composition rules.]

## Accessibility

- Contrast: [pairings and minimums]
- Focus: [visible focus rules]
- Keyboard: [navigation and activation]
- Touch: [minimum target and spacing]
- Reflow and zoom: [expected behavior]
- Motion: [reduced-motion behavior]
- Semantics: [roles, labels, and announcements]

## Responsive Behavior

| Range | Layout changes | Component changes | Content behavior |
|---|---|---|---|
| [mobile] | [changes] | [changes] | [wrap, truncate, scroll] |
| [tablet] | [changes] | [changes] | [behavior] |
| [desktop] | [changes] | [changes] | [behavior] |

## Content and Imagery

[Voice, icon geometry, illustration or photography rules, charts, empty states, and prohibited treatments.]

## Do's and Don'ts

| Do | Don't |
|---|---|
| [Specific rule] | [Specific anti-pattern] |

## Implementation Mapping

| Concept | Token or component | Source path | Evidence status |
|---|---|---|---|
| [concept] | [name] | [repository-relative path] | verified / inferred / proposed |

## Agent Quick Reference

- Canvas: `[token]`
- Primary action: `[token]`
- Display type: `[token]`
- Body type: `[token]`
- Container: `[rule]`
- Section rhythm: `[token]`
- Signature component: `[component]`
- Never: `[highest-risk anti-pattern]`

When generating UI, first reuse existing components and tokens. If a required pattern is absent, propose the smallest compatible extension and label it as proposed.

## Known Gaps

- [Unverified state, breakpoint, asset, token, or implementation drift.]
```

## Review Checklist

- Every exact value has one canonical home.
- Semantic token names describe roles rather than colors or borrowed brands.
- All source paths and URLs resolve.
- At least one representative claim from each major area was checked.
- Interactive components cover applicable focus, keyboard, loading, error, and disabled behavior.
- Responsive rules explain reflow, overflow, truncation, and touch targets.
- Accessibility rules are testable rather than aspirational.
- Do's and don'ts are specific enough to reject an incorrect implementation.
- The agent quick reference can guide a small UI task without rereading the whole file.
- Known gaps contain uncertainty instead of hiding it in confident prose.
