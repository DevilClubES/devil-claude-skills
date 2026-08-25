# Motion Craft Review

Use this rubric only when motion exists or is proposed. Motion is a functional design material, not a default polish layer.

## Review sequence

1. `Purpose`: name what the motion explains—state, causality, hierarchy, continuity, spatial relationship, feedback, or delight. Remove motion without a purpose.
2. `Frequency`: estimate how often the trigger occurs. Frequent actions should be fast and quiet; rare transitions can carry more expression.
3. `Interruption`: trigger the interaction repeatedly and reverse it mid-flight. The interface must respond from its current visual state instead of queuing stale animations.
4. `Continuity`: preserve spatial and state continuity when an element enters, exits, expands, collapses, or changes ownership.
5. `Performance`: prefer transform and opacity for frequent animation. Inspect layout, paint, dropped frames, and input latency before claiming smoothness.
6. `Reduced motion`: preserve meaning, state, focus, and task completion under `prefers-reduced-motion`; remove or replace non-essential travel, parallax, and looping effects.
7. `Slow-motion review`: temporarily slow the animation to expose discontinuities, abrupt easing, clipping, layering, and incorrect transform origins. Restore production timing afterward.

## Evidence table

| Interaction | Purpose | Frequency | Interruptible | Reduced motion | Performance evidence | Finding |
|---|---|---|---|---|---|---|
| trigger and target | named job | frequent/occasional/rare | pass/fail/not tested | pass/fail/not tested | trace, profiler, or limitation | exact correction |

## Failure patterns

- `transition: all` hides property ownership and can animate unintended changes.
- Uniform hover scaling on every control creates noise and layout ambiguity.
- Long entrances delay access to content or focus.
- Infinite decorative motion competes with reading and may consume resources off-screen.
- Scroll-driven effects that overwrite navigation, focus, or native scrolling make motion a blocker.
- Reduced-motion CSS that merely shortens duration can still preserve harmful travel or flashing.

Do not enforce one universal duration or easing curve. Judge timing against distance, frequency, hierarchy, input method, and the product's established motion system.

For a deterministic source preflight, run the shared plugin script before visual review:

```text
node "<design-skills-plugin-directory>/scripts/audit-motion.mjs" <file-or-directory>
```

The script rejects `transition: all` and missing reduced-motion handling and reports long or infinite motion for human review. Passing it does not establish visual quality, interruptibility, or runtime performance.

## Provenance

Independently adapted from motion-review mechanisms in `emilkowalski/skills` at commit `d23d7f88a2e2` (MIT). Wording and evidence contract are original to this project.
