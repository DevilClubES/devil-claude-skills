# Project Design State

Use `.claude/design-studio.md` only for durable, project-specific context that improves later design work.

## Rules

- Read the existing file before changing it.
- Record accepted decisions, not every idea generated during exploration.
- Label unresolved assumptions as open questions.
- Keep implementation truth in `DESIGN.md`, tokens, components, and tests; do not duplicate their exact values here.
- Keep at most ten recent outcomes. Remove the oldest when adding an eleventh.
- Do not store secrets, credentials, personal data, private connector output, or user research that the repository should not contain.
- Respect existing repository conventions and ignore rules. Do not commit the file unless the user requests or the repository already treats `.claude` as committed project context.
- Do not create or update the file for a review-only task.

## Template

```markdown
# Design Studio State

Last updated: YYYY-MM-DD

## Current Direction

- Name: [short direction name]
- Thesis: [one sentence]
- Status: proposed / approved / implemented / superseded
- Applies to: [surfaces or feature]

## Locked Decisions

| Decision | Rationale | Evidence or approval | Date |
|---|---|---|---|
| [decision] | [why] | [path, live surface, or user approval] | YYYY-MM-DD |

## Rejected Approaches

| Approach | Reason rejected | Reconsider when |
|---|---|---|
| [approach] | [reason] | [condition] |

## Open Questions

- [Question that materially affects later work]

## Recent Outcomes

| Date | Scope | Direction or macrostructure | Result | Verification |
|---|---|---|---|---|
| YYYY-MM-DD | [scope] | [choice] | [implemented/approved/etc.] | [runtime/viewports/tests] |
```

When `DESIGN.md` and this file conflict, shipped implementation plus verified `DESIGN.md` wins. Report and resolve the stale project-state entry.
