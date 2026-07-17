---
name: design-studio
description: Run an end-to-end digital design loop from brief to verified implementation. Use for net-new or substantial web/app UI design, redesigns, visual direction exploration, production-ready interface builds, iterative refinement, selected-element tweaks, or any request that should connect design-system evidence, implementation, visual QA, critique, and handoff instead of producing a one-pass mockup.
argument-hint: "[explore | build | critique | refine | tweak | ship] <brief or artifact>"
---

# /design-skills:design-studio

> For optional connector placeholders and fallback behavior, see [CONNECTORS.md](../../CONNECTORS.md).

Turn a design brief into a real, visually verified artifact while preserving the project's product identity and implementation constraints.

## Usage

```text
/design-skills:design-studio explore <brief>
/design-skills:design-studio build <brief or approved direction>
/design-skills:design-studio critique <artifact>
/design-skills:design-studio refine <artifact and goal>
/design-skills:design-studio tweak <selected element and requested change>
/design-skills:design-studio ship <artifact>
```

Treat an unqualified design request as `build`. Select a more specific mode when the user's wording makes it clear.

## Operating Rules

1. Inspect repository instructions, the running surface, `DESIGN.md`, tokens, primitives, and representative screens before proposing a new visual language.
2. Match the user's requested operation. Review-only requests do not authorize edits; build, redesign, refine, tweak, and ship requests do.
3. Reuse shipped components and semantic tokens before inventing new ones. Label any new token or pattern as proposed until implemented and verified.
4. Keep concept artifacts distinct from production implementation. Never describe an unrendered draft as shipped or verified.
5. Use supplied facts and assets. Do not fabricate metrics, testimonials, customer logos, research findings, prices, or product capabilities to fill a layout.
6. Preserve principles from references without cloning protected logos, copy, illustrations, proprietary assets, or another product's recognizable trade dress.
7. Verify visual work in the rendered surface at relevant breakpoints and states. Source review alone is insufficient for a visual completion claim.
8. Prefer a small coherent system over a large catalog of disconnected styles. Novelty must serve the brief.
9. Ask only for information whose absence would materially change the result. When the user delegates judgment, choose a defensible default and record it.
10. Keep user-facing updates concise. Put durable decisions in the project, not only in chat.

## Route the Request

| Situation | Route |
|---|---|
| Existing `DESIGN.md` or clearly established product UI | Treat it as the locked direction; skip style exploration unless redesign is explicit. |
| Ambiguous net-new product or major redesign | Run `explore`, then converge on one direction before the expensive build. |
| Complete brief with explicit visual direction | Proceed to `build`; do not force an extra choice round. |
| Existing artifact with a localized request | Run `tweak`; avoid a whole redesign. |
| Existing artifact with broad quality problems | Run `refine` through critique and bounded revision rounds. |
| Review, opinion, or audit only | Run `critique`; do not mutate files. |
| User asks for plan only | Produce or update the design plan; do not create the final artifact. |

Use the specialized installed skills when their trigger applies: `/design-skills:design-system` for the canonical system contract, `/design-skills:accessibility-review` for a WCAG audit, `/design-skills:ux-copy` for interface language, and `/design-skills:design-handoff` for an engineering spec. Keep this skill responsible for sequencing, convergence, implementation, and verification.

## End-to-End Workflow

### 1. Establish the brief

Extract or infer:

- User and primary job
- Surface and key flow
- Business or communication goal
- Required content and real data sources
- Existing brand/system constraints
- Technical stack and delivery format
- Relevant breakpoints, states, and accessibility constraints
- Success conditions and non-goals

Inspect source-of-truth files before asking the user for facts already present in the project.

### 2. Diverge only when it adds value

For an ambiguous net-new design or major redesign, produce exactly three defensible directions. Make them structurally different, not palette swaps.

For each direction, state:

- Thesis and intended feeling
- Macrostructure and reading flow
- Type, color, imagery, and motion strategy
- Signature interaction or component
- Why it fits this user and goal
- Primary risk or tradeoff

Recommend one direction. Pause for selection only when the alternatives would materially change the product and the user has not delegated the decision. If the user says to proceed or pick the best, lock the recommendation and continue.

Do not offer separate directions when an active design system already answers color, typography, spacing, and mood.

### 3. Maintain durable project context

Read `DESIGN.md` and `.claude/design-studio.md` when present.

For a mutating, multi-turn design effort, create or update `.claude/design-studio.md` after a direction or rule is accepted. Record only durable decisions, rejected approaches, current gaps, and recent outcomes. Do not create this file for a one-off critique or record speculative observations as decisions.

Read [project-state.md](references/project-state.md) completely before creating or materially updating this state file.

### 4. Build in the real delivery surface

- Implement inside the existing framework and component architecture when a repository exists.
- Prefer real copy and representative data. Mark unresolved content visibly as pending instead of inventing proof.
- Cover default, hover, focus-visible, active, disabled, loading, error, empty, and overflow states when applicable.
- Define responsive behavior deliberately; do not rely on accidental wrapping.
- Use semantic HTML, keyboard behavior, reduced-motion handling, and contrast-safe token pairings from the start.
- Use an available format-specific tool or skill when the requested artifact is primarily a raster image, presentation, document, PDF, spreadsheet, or hosted site.

### 5. Render and inspect

Run the relevant build, lint, type, or focused tests. Then open the actual artifact or local application and inspect at minimum:

- One narrow mobile viewport
- One representative desktop viewport
- Primary interaction and keyboard path
- Long or missing content where relevant
- Loading, empty, error, and disabled states where relevant
- Focus visibility, contrast, reflow, and reduced motion

Capture screenshots when they materially improve comparison or proof. Fix visible defects before critique scoring.

### 6. Run the Design Jury

Read [quality-gates.md](references/quality-gates.md) completely before critiquing a generated or materially changed artifact.

Evaluate the artifact through five lenses: brief/UX fit, visual craft, system/brand fit, accessibility/content integrity, and implementation/responsiveness. These are structured lenses from one reviewer unless genuinely independent reviewers were run; never imply independent panelists.

For `build`, `refine`, or `ship`:

1. Score the rendered artifact.
2. Fix the smallest set of issues that meaningfully raises quality.
3. Re-render and re-score.
4. Stop when the ship gate passes or after three total critique rounds.

Do not hide a below-threshold result. Leave the best verified version in place and report the remaining blockers.

### 7. Hand off with evidence

Report:

- Direction and durable decisions
- Files or artifacts changed
- Verification performed and viewports/states checked
- Design Jury verdict and remaining caveats
- Any unresolved content, assets, or product decisions

Generate a full developer handoff only when requested or when implementation is owned by someone else.

## Mode: `tweak`

Treat a targeted tweak as an invariants-preserving patch.

1. Identify the target by component, selector, layer, visible label, or screenshot location.
2. Restate the requested delta and the properties that must not change.
3. Trace the target to its source implementation.
4. Apply the smallest coherent diff; avoid unrelated token or layout churn.
5. Re-render the affected viewport and state.
6. Report the exact change and any side effect that could not be avoided.

If the target is ambiguous, ask one short targeting question. Do not guess between multiple visually similar elements.

## Mode: `critique`

Inspect the rendered artifact whenever possible. Return the jury verdict, evidence-backed findings, the three highest-value changes, and what already works. Do not modify files.

## Mode: `ship`

Treat `ship` as a readiness check, not permission to deploy or publish. Verify the artifact, pass the Design Jury, and produce a clear ready/revise/blocked verdict. Deploy, push, merge, or publish only when the user separately requests that external action.

## Optional Connectors

When `~~design tool` is connected, inspect design variables, components, layers, and representative frames. When `~~knowledge base`, `~~project tracker`, or `~~user feedback` is connected, use it only if retrieved in the current run. Otherwise continue from repository and user-provided evidence and state the limitation.
