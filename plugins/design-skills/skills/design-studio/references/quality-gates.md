# Design Studio Quality Gates

Read this reference before critiquing, refining, or claiming a generated design is ready.

## Evidence First

Score the rendered result, not the intended code. Use the strongest available evidence:

1. Running artifact at the relevant state and breakpoint
2. DOM, computed styles, and interaction behavior
3. Build and focused test results
4. Source implementation
5. Static mockup or screenshot
6. Prose description

State the limitation when only weak evidence is available.

## Five-Lens Jury

Score every lens from 0 to 5. Use half points only when evidence supports the distinction.

| Lens | Weight | Questions |
|---|---:|---|
| Brief and UX fit | 30% | Does it solve the named user job? Is the primary action obvious? Does the flow match the brief? |
| Visual craft | 20% | Are hierarchy, composition, typography, spacing, density, imagery, and motion intentional and balanced? |
| System and brand fit | 15% | Does it reuse the product's tokens, components, voice, and recognizable principles without drift? |
| Accessibility and content integrity | 20% | Are semantics, keyboard, focus, contrast, reflow, reduced motion, labels, and claims sound? |
| Implementation and responsiveness | 15% | Does it render reliably across target sizes and states without overflow, breakage, or fragile one-offs? |

Calculate:

```text
composite_10 = 2 * (
  brief_ux * 0.30 +
  craft * 0.20 +
  system_brand * 0.15 +
  accessibility_content * 0.20 +
  implementation * 0.15
)
```

Do not use the composite to excuse a blocker.

## Verdicts

- `READY`: composite at least 8.0, every lens at least 3.5, no blockers, and required verification completed.
- `REVISE`: potentially shippable, but below the threshold or carrying unresolved high-impact findings.
- `BLOCKED`: missing source-of-truth content/assets, broken critical flow, untestable delivery surface, or any hard blocker below.

For exploratory work, use the same rubric as guidance but do not imply production readiness.

## Hard Blockers

Treat any of these as a failed ship gate:

- Primary user flow is broken, misleading, or unavailable by keyboard.
- Critical text or controls fail required contrast or disappear under zoom/reflow.
- Layout loses content, creates blocking overflow, or becomes unusable at a target breakpoint.
- Runtime, build, or focused test failure was introduced by the design change.
- Fabricated metric, testimonial, customer logo, research result, price, or capability is presented as factual.
- Placeholder, stock asset, or generated image is presented as an approved final asset without disclosure.
- The result materially violates a verified `DESIGN.md` rule without an explicit approved redesign.
- Loading, error, empty, destructive confirmation, or disabled behavior is missing where it can cause user harm or data loss.
- A visible control lacks a usable name, role, state, or focus treatment.

## Anti-Slop Signals

Use these as diagnostic signals, not universal style bans. Accept them only when the brief or established system justifies them.

- Defaulting to the same hero, equal-card grid, CTA, and four-column footer structure regardless of product.
- Presenting several directions that differ only in color.
- Centering every hero element on one axis with no meaningful hierarchy.
- Using nested cards, excessive pills, or equal visual weight for unrelated information.
- Adding gradients, glows, glass effects, decorative cursors, numbers, or badges with no semantic purpose.
- Drawing fake browser, device, terminal, or IDE chrome when a real capture or simpler framing would be clearer.
- Reusing arbitrary raw colors, spacing, radii, or font families outside the token system.
- Applying `transition: all`, uniform hover scaling, or multiple unrelated hover effects.
- Overusing the accent color until it stops functioning as emphasis.
- Filling proof sections with invented statistics or generic customer names.
- Producing a visually attractive page that could belong to any company because product-specific content and interaction are absent.

## Required Inspection

Check what applies:

### Hierarchy and content

- Purpose and primary action are clear within a few seconds.
- Headings create a coherent reading order.
- Real content fits without accidental clipping or awkward orphaning.
- Empty and error language tells the user what happened and what to do next.
- Quantitative and social-proof claims have a supplied source or are marked pending.

### Tokens and components

- New values are introduced as semantic tokens only when existing roles cannot serve.
- Interactive components cover applicable hover, focus-visible, active, disabled, loading, and error states.
- Similar components look and behave consistently.
- No unrelated global style churn was introduced for a local change.

### Accessibility

- Normal text contrast is at least 4.5:1; large text and non-text UI contrast are at least 3:1 where WCAG 2.1 AA applies.
- Focus is visible and immediate; focus order follows the visual and task order.
- Keyboard activation, dismissal, and arrow-key behavior match the component pattern.
- Touch targets and spacing are usable at the target mobile viewport.
- Zoom/reflow does not hide actions or require two-dimensional scrolling except for inherently two-dimensional content.
- Reduced-motion preferences remove non-essential motion.
- Images, icons, fields, status changes, and validation have appropriate accessible names or announcements.

### Responsive and implementation

- Mobile and desktop layouts are intentionally composed, not merely scaled.
- Long text, localization, missing images, large datasets, and narrow containers have defined behavior.
- Media has stable dimensions and does not cause layout shift where avoidable.
- Interactions work in the actual runtime, not only in a static screenshot.
- Focused build, type, lint, and test checks appropriate to the change pass.

## Critique Rounds

Run no more than three total rounds by default.

For each round:

1. Record the five scores and evidence.
2. Name blockers and at most five must-fix findings.
3. Apply the smallest coherent fixes when mutation is authorized.
4. Re-render the affected states and breakpoints.
5. Record the new scores and whether the result improved.

If quality does not improve after a round, stop patching symptoms. Revisit the brief, direction, or system constraint.

## Output Contract

```markdown
## Design Jury

**Verdict:** READY / REVISE / BLOCKED
**Evidence:** [runtime, viewports, states, tests]
**Composite:** [0.0-10.0]

| Lens | Score / 5 | Evidence | Required change |
|---|---:|---|---|
| Brief and UX fit | | | |
| Visual craft | | | |
| System and brand fit | | | |
| Accessibility and content integrity | | | |
| Implementation and responsiveness | | | |

### Blockers
- [None, or exact blocker]

### Highest-value changes
1. [Change]
2. [Change]
3. [Change]

### What already works
- [Specific strength]
```

When the same agent performed every lens, call this a structured multi-lens review. Do not claim five independent reviewers.

## Provenance

The direction-convergence, bounded critique-loop, project-state, and selected anti-slop ideas were independently adapted from Open Design at commit `c9bd2c6628506fd79822397c9abe2036b9bc4a55`:

- `plugins/_official/atoms/direction-picker/SKILL.md`, `plugins/_official/atoms/critique-theater/SKILL.md`, and `plugins/spec/examples/refine-critique-loop/SKILL.md` under Apache-2.0.
- `plugins/community/hallmark/references/slop-test.md` under MIT.

No Open Design source code, assets, templates, or design systems are vendored in this skill. Retain this provenance note when redistributing materially derived quality-gate text.
