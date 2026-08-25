---
name: component-stress-test
description: Exercise one implemented component through content, localization, viewport, interaction, accessibility, asynchronous, and failure extremes in an isolated harness. Use only when the user explicitly invokes this diagnostic workflow; it may add test fixtures but must not fix product code unless the user separately asks.
---

# Component Stress Test

Find where a component breaks before production users do. This is a diagnostic workflow, not implicit authorization to redesign or repair the component.

## Invocation

```text
$component-stress-test the current request
```

Use an existing Storybook, preview, test, example, or fixture convention when available. Keep new harness code isolated from production routing and data. Do not replace real product code with mocks merely to make the component pass.

## Establish the contract

Read the component API, consumers, styles, tests, `DESIGN.md`, and accessibility expectations. Record:

- Required props and supported variants
- User job and critical interaction
- Content and data limits already promised
- Breakpoints and container constraints
- Required semantics, keyboard pattern, announcements, and focus behavior
- Known unsupported cases that should remain out of scope

## State matrix

Test every applicable dimension with representative extremes:

| Dimension | Cases |
|---|---|
| Content | empty, shortest, typical, very long, unbroken token, missing media, large numbers |
| Localization | 30–50% text expansion, RTL when supported, mixed scripts, date/number formats |
| Container | narrow parent, mobile, tablet, desktop, zoom/reflow, dense sibling content |
| Interaction | pointer, keyboard, focus-visible, rapid repeat, interruption, dismissal, disabled |
| Async | loading, delayed success, empty result, recoverable error, retry, stale response |
| Accessibility | name/role/state, contrast, target size, reading order, announcements, reduced motion |
| Data safety | destructive confirmation, duplicate submit, permission denial, partial failure |

Do not invent support obligations. Mark a case `not applicable` with the contract evidence.

## Run and inspect

1. Add the smallest isolated fixtures needed to reach the matrix.
2. Run existing component tests and focused static checks.
3. Render relevant states at equivalent viewports.
4. Exercise the keyboard path and rapid/reversed interactions.
5. Capture exact evidence for each failure.
6. Leave production code unchanged unless the user separately requests fixes.

## Output

```markdown
## Component Stress Test: [component]

**Verdict:** RESILIENT / FAILURES FOUND / BLOCKED
**Harness:** [existing or added path]
**Evidence:** [runtime, viewports, tests]

| Dimension | Case | Result | Evidence | Product impact |
|---|---|---|---|---|

### Highest-risk failures
1. [Failure and smallest recommended fix]

### Coverage gaps
- [Unreachable state or missing environment]

### Product files changed
- None, or explicit list if separately authorized
```

`RESILIENT` means all applicable promised states passed; it does not promise behavior outside the recorded contract.

## Provenance

The explicit break-testing boundary and isolated state-matrix approach are independently adapted from `jakubkrehel/skills` at commit `ca483852de23` (MIT). Wording and coverage contract are original to this project.
