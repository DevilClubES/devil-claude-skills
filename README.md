# devil-claude-skills

Curated marketplace of Claude Code skills used at [Devil Club](https://devil.club).

## Plugins

### `design-skills`

Eight standalone skills for end-to-end product design, UX, accessibility, and research work:

| Skill | Use it for |
|---|---|
| `/design-skills:design-studio` | Explore, build, refine, tweak, critique, and verify production UI |
| `/design-skills:design-critique` | Structured feedback on usability, hierarchy, consistency |
| `/design-skills:design-system` | Audit, capture, validate, document, or extend a design system and its `DESIGN.md` |
| `/design-skills:design-handoff` | Generate developer handoff specs from a design |
| `/design-skills:accessibility-review` | WCAG 2.1 AA audit of a design or page |
| `/design-skills:ux-copy` | Write or review microcopy, error messages, empty states, CTAs |
| `/design-skills:user-research` | Plan, conduct, and synthesize user research |
| `/design-skills:research-synthesis` | Synthesize interview/survey/test results into themes |

## Install

In any Claude Code session:

```
/plugin marketplace add DevilClubES/devil-claude-skills
/plugin install design-skills@devil-claude-skills
```

The eight skills are then available under the `/design-skills:` namespace. If they do not appear immediately, run `/reload-plugins` or restart Claude Code.

## Update

```
/plugin update design-skills@devil-claude-skills
```

Restart Claude Code after an update so the refreshed plugin cache is loaded.

## DESIGN.md workflow

The design-system skill can turn an existing implementation, design source, or reference site into a project-owned `DESIGN.md`:

```text
/design-skills:design-system capture
/design-skills:design-system validate DESIGN.md
```

It records semantic tokens, component states, responsive behavior, accessibility rules, implementation evidence, and known gaps without copying another brand's protected assets or identity.

This workflow adapts the strongest structural ideas from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) and adds project evidence, implementation mapping, progressive disclosure, and deterministic validation for production use.

## Design Studio workflow

The design-studio skill connects the design-system, critique, accessibility, copy, and handoff skills into a bounded production workflow:

```text
/design-skills:design-studio explore <brief>
/design-skills:design-studio build <brief or direction>
/design-skills:design-studio refine <artifact and goal>
/design-skills:design-studio tweak <target and change>
/design-skills:design-studio ship <artifact>
```

It requires rendered evidence, mobile and desktop inspection, explicit interaction states, a five-lens readiness jury, and at most three refinement rounds. The direction-convergence, bounded critique-loop, project-state, and selected anti-slop mechanisms are independently adapted from [nexu-io/open-design](https://github.com/nexu-io/open-design) at commit `c9bd2c6628506fd79822397c9abe2036b9bc4a55`; no Open Design code, assets, templates, or design systems are vendored.

## License

The skill content is provided as-is for personal and commercial use. No warranty.
