# Design Read and Redesign Mode

Read this reference before a net-new build, extension, or redesign. The output is a compact decision contract, not a mood-board description.

## 1. Classify existing work

- `greenfield`: no product interface or visual contract exists.
- `extension`: add a surface or component that should look native to the current product.
- `preserve`: substantially improve the experience while protecting recognizable identity and operational contracts.
- `overhaul`: replace the visual language or structure because the user explicitly asked for a redesign and accepted the migration cost.

For `extension` and `preserve`, list protected contracts before editing: routes, information architecture, analytics events, forms and data flow, accessibility behavior, public copy or claims, component APIs, and brand signatures. If a protected contract must change, surface that decision before implementation.

## 2. Calibrate five dials

Use `low`, `medium`, or `high`, followed by a one-sentence consequence.

| Dial | Low | Medium | High |
|---|---|---|---|
| Variance | Repeated, predictable composition | Controlled shifts around a stable grid | Strong compositional contrast and intentional asymmetry |
| Motion | Static or functional state changes | A few purposeful transitions | Motion is a primary explanatory or narrative device |
| Density | One decision per viewport | Balanced scanning and detail | Information-rich, compact, expert-facing surfaces |
| Asset dependence | Type, color, and native UI carry the design | A small set of product or editorial assets | Custom imagery, diagrams, video, or 3D is central to comprehension |
| Brand fidelity | New visual territory is acceptable | Core signatures remain recognizable | Existing tokens, components, voice, and layout grammar are tightly protected |

Resolve conflicts explicitly. High brand fidelity usually constrains variance. High asset dependence without approved assets creates a blocker or a clearly labeled placeholder plan. High motion must still preserve task completion and reduced-motion parity.

## 3. Write the contract

```text
Design Read
- User and job:
- Artifact and success condition:
- Mode: greenfield / extension / preserve / overhaul
- Protected contracts:
- Variance: low / medium / high — consequence
- Motion: low / medium / high — consequence
- Density: low / medium / high — consequence
- Asset dependence: low / medium / high — consequence
- Brand fidelity: low / medium / high — consequence
- Primary risk:
- Evidence still needed:
```

Each dial must produce at least one observable implementation decision. If changing the value would not change the artifact, the dial is too vague.

## 4. Decide whether an early v0 helps

Use a v0 only to answer an expensive question before full implementation, such as whether the macrostructure supports the primary job, whether representative data fits, or whether a key interaction is understandable. Build the smallest representative slice, inspect it, record the decision, and discard or evolve it deliberately.

Skip v0 when the established design system and brief already determine the answer.

## Provenance

Independently adapted from the Design Read, five-dial calibration, and preservation-aware redesign mechanisms in `ConardLi/garden-skills` at commit `aaf9a82f5efd` (MIT). Wording and workflow are original to this project; no source assets or templates are included.
