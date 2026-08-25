---
name: landing-page-design
description: Design, implement, or improve a product or campaign landing page around one audience, promise, action, and evidence set, then verify conversion clarity, responsive craft, accessibility, performance, SEO, and answer-engine readability. Use for marketing, launch, waitlist, lead-generation, or product pages; do not use for application dashboards, generic site-wide redesigns, or copy-only requests.
argument-hint: "[audit | outline | build | refine] <brief, page, or URL>"
---

# /design-skills:landing-page-design

Create a landing page whose visual system and page structure make a truthful product argument. Do not force a stock sequence of sections when the brief does not need them.

## Modes

```text
/design-skills:landing-page-design audit <page>
/design-skills:landing-page-design outline <brief>
/design-skills:landing-page-design build <brief or approved outline>
/design-skills:landing-page-design refine <page and goal>
```

`audit` and `outline` are non-mutating. `build` and `refine` authorize scoped implementation in the named project, but not merge, deploy, publication, paid traffic, or analytics changes unless separately requested.

## 1. Establish the conversion contract

Record:

- One primary audience and their current situation
- One job or problem the page helps resolve
- One precise promise the product can substantiate
- One primary action and its post-click expectation
- Traffic context and awareness level when known
- Supplied proof: product behavior, demo, customer evidence, data, credentials, or guarantee
- Brand/system, legal, technical, performance, and localization constraints

If proof is missing, design honest explanation or product evidence. Never invent metrics, customers, testimonials, ratings, integrations, prices, urgency, or guarantees.

## 2. Build the argument before the layout

Choose only sections that advance the audience from question to action. Possible jobs include orientation, problem framing, product mechanism, proof, comparison, objection handling, pricing, FAQ, and final action. Their presence and order depend on the brief, not a template.

For each proposed section, write:

| Section job | User question | Evidence/content | Visual mechanism | Exit to next section |
|---|---|---|---|---|

Delete sections that repeat a claim, carry no evidence, or exist only to fill a familiar landing-page pattern.

## 3. Make the product the proof

- Show the actual product, workflow, output, or before/after state when available.
- Explain the mechanism with real inputs, transformation, control, and outcome instead of abstract feature cards.
- Use supplied customer evidence with exact provenance and scope.
- Mark unresolved assets and claims as pending; never disguise placeholders as approved proof.
- Separate primary conversion from secondary education or navigation.

## 4. Design and implement

Inspect `DESIGN.md`, tokens, primitives, and existing marketing surfaces. Use `/design-skills:design-studio` when the work needs broader direction exploration or a new cross-product visual system.

- Establish a clear two-second hierarchy: audience relevance, promise, proof cue, primary action.
- Use composition, type, spacing, assets, and motion to clarify the argument rather than decorate every section.
- Keep one coherent section-separation mechanism and a deliberate density rhythm.
- Cover navigation, form, validation, success, loading, error, disabled, long-content, and mobile states as applicable.
- Preserve semantic HTML, keyboard use, visible focus, sufficient contrast, reduced-motion parity, and stable media dimensions.

## 5. Search and answer-engine contract

- Write one descriptive page title, canonical primary heading, and useful meta description.
- Use semantic headings that let a reader and crawler recover the page argument without visual styling.
- Answer high-intent questions directly near the evidence that supports them.
- Keep product/entity names, claims, pricing, and availability consistent with authoritative sources.
- Add structured data only when the page visibly contains the matching truthful content.
- Include FAQ content only for real audience objections with sourced answers; do not manufacture questions for schema volume.
- Preserve crawlable text and meaningful links when client rendering is used.

## 6. Verify

Inspect the rendered page on narrow mobile and representative desktop, plus the primary conversion interaction. Check content overflow, localization expansion, forms, focus, reduced motion, loading and failure states, metadata, heading order, link purpose, media weight, layout shift, and targeted performance tests available in the project.

Report the conversion contract, argument map, files changed, evidence inspected, claims still pending, SEO/AEO checks, viewports and states tested, and a `READY`, `REVISE`, or `BLOCKED` verdict. A ready page is still not authorized for deployment or publication.

## Provenance

The conversion, copy, SEO, and answer-engine synthesis is independently adapted from `elayadesign/ai-design-skills` at commit `1c1e97cb9878`; product-as-proof and mechanism-led originality checks are independently adapted from `MengTo/Skills` at commit `4c716b516b6b`; selected consistency diagnostics are independently adapted from `codeswithroh/tastemaker` at commit `45313ce9f609` (all MIT). Wording and workflow are original to this project.
