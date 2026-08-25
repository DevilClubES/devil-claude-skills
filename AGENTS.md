# Repository authoring contract

## Source of truth

- Edit Claude-facing source only under `plugins/design-skills`.
- Treat `plugins/design-skills-codex` as generated output. Rebuild it with `node scripts/sync-codex-package.mjs`.
- Keep plugin versions synchronized across Claude and Codex manifests.

## Skill boundaries

- A skill owns one clear user outcome. Prefer a focused verb workflow over a catalog of loosely related advice.
- Descriptions must state both the positive trigger and the important boundary.
- Keep detailed rubrics in `references/` and load them only at the decision point that needs them.
- Put deterministic checks in `scripts/`; do not encode subjective visual judgment as a pass/fail script.
- `interface-review`, `variant`, and `component-stress-test` remain explicit-only in both runtimes.

## Verification

Run before committing:

```text
node scripts/lint-skills.mjs
node scripts/sync-codex-package.mjs --check
node scripts/test-tooling.mjs
```

Do not claim a runtime install, VPS deployment, merge, release, or publication unless that state was separately authorized and verified live.
