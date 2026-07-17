---
name: design-critique
description: Review a design through structured UX, visual-craft, brand/system, accessibility/content, and implementation lenses. Use for "review this design", "critique this mockup", "what do you think of this screen?", design comparisons, pre-handoff feedback, or an evidence-backed ready/revise/blocked verdict from a Figma link, screenshot, artifact, or running page.
argument-hint: "<design, context, and optional focus>"
---

# /design-skills:design-critique

> For optional connector placeholders and fallback behavior, see [CONNECTORS.md](../../CONNECTORS.md).

Give direct, stage-appropriate feedback grounded in the visible artifact and its product context.

## Usage

```text
/design-skills:design-critique $ARGUMENTS
```

If a design URL is provided, inspect the linked surface with an available connector or browser. If a file is referenced, read or render it. If no reviewable artifact is available, ask the user to share one or explicitly limit the critique to the supplied description.

Do not modify files during a critique. Move into implementation only when the user separately asks to fix, refine, or build.

## Evidence Rules

1. Prefer the running artifact over source code, source code over a static screenshot, and a screenshot over prose.
2. Inspect the relevant breakpoint and state; do not generalize a desktop happy path to mobile, error, or keyboard behavior.
3. Separate observations from inferences. Never report an untested behavior as verified.
4. Compare against the project's actual `DESIGN.md`, tokens, and components when available.
5. Tie every negative finding to user impact, product intent, or an established system rule.
6. Do not fabricate independent reviewers. When one agent applies several perspectives, call it a structured multi-lens review.

## Match the Stage

- `Exploration`: prioritize concept, audience fit, structure, and direction. Avoid pixel-level polish lists.
- `Refinement`: prioritize hierarchy, flows, components, responsive behavior, content, and system consistency.
- `Final`: prioritize blockers, edge states, accessibility, implementation fidelity, and handoff readiness.

If the stage is unknown, infer it from the artifact and say what you assumed.

## Five-Lens Jury

Review through these lenses:

| Lens | Focus |
|---|---|
| Brief and UX fit | User job, task flow, clarity, navigation, primary action, unnecessary steps |
| Visual craft | First impression, composition, hierarchy, typography, spacing, density, imagery, motion |
| System and brand fit | Tokens, components, voice, consistency, recognizable product identity |
| Accessibility and content integrity | Contrast, keyboard, focus, semantics, touch, reflow, honest claims, useful states and copy |
| Implementation and responsiveness | Target breakpoints, overflow, loading/error/empty states, interaction reliability, technical fragility |

For normal feedback, use severity and evidence without numeric scoring. For readiness, comparison, or iterative refinement, score each lens from 0 to 5 and explain the score.

When `../design-studio/references/quality-gates.md` is available and the user asks whether a design is ready, read it completely and apply its thresholds and blockers.

## Critique Method

1. State the artifact, context, stage, breakpoint, and evidence inspected.
2. Give the two-second first impression: what attracts attention and whether that is correct.
3. Identify the strongest product/design decision before listing problems.
4. Review all five lenses, omitting only dimensions that genuinely cannot be evaluated.
5. Rank findings by impact: `Critical`, `High`, `Medium`, or `Low`.
6. Recommend the smallest concrete correction for each meaningful finding.
7. End with exactly three priority changes unless fewer than three issues exist.

Avoid vague feedback such as "make it cleaner" or "the layout feels off." Name the element, evidence, consequence, and specific correction.

## Readiness Verdict

Use one verdict when the user asks whether the work is final or ready:

- `READY`: verified at required states and breakpoints, no blockers, and no material high-impact finding.
- `REVISE`: direction is viable but meaningful issues remain.
- `BLOCKED`: missing evidence or a critical UX, accessibility, content-integrity, system, or implementation blocker prevents a defensible readiness claim.

Do not average away a blocker with a high aesthetic score.

## Output

```markdown
## Design Critique: [Name]

**Verdict:** READY / REVISE / BLOCKED / NOT REQUESTED
**Stage:** [assumed or supplied]
**Evidence:** [artifact, breakpoint, states, sources]

### Overall
[Direct first impression, strongest decision, and biggest opportunity]

### Findings
| Severity | Lens | Evidence | User/product impact | Recommendation |
|---|---|---|---|---|
| Critical / High / Medium / Low | [lens] | [specific observation] | [impact] | [small concrete fix] |

### Hierarchy and Flow
- First focus: [element and whether correct]
- Reading/task flow: [sequence]
- Primary action: [clarity and competition]

### Accessibility and States
- Contrast and focus: [verified result or limitation]
- Keyboard and semantics: [verified result or limitation]
- Responsive, loading, empty, and error behavior: [verified result or limitation]

### What Works
- [Specific strength]
- [Specific strength]

### Top Three Changes
1. [Highest-impact change]
2. [Second change]
3. [Third change]
```

For a readiness review, add the five lens scores, composite, blockers, and round from the Design Studio quality-gate contract.

## Optional Connectors

When `~~design tool` is connected, inspect variables, component properties, layers, and representative frames. When `~~user feedback` or `~~knowledge base` is connected, use it only if retrieved in the current run. Otherwise continue from repository and user-provided evidence and state the limitation.
