# devil-claude-skills

Curated marketplace of Claude Code skills used at [Devil Club](https://devil.club).

## Plugins

### `design-skills`

Seven standalone skills for design, UX, accessibility, and research work:

| Skill | Use it for |
|---|---|
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

The seven skills are then available under the `/design-skills:` namespace. If they do not appear immediately, run `/reload-plugins` or restart Claude Code.

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

## License

The skill content is provided as-is for personal and commercial use. No warranty.
