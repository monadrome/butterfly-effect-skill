# CLAUDE.md

This repository packages the `/butterfly-effect` Agent Skill for turning correction-heavy AI sessions into better restart prompts.

## Architecture

The canonical behavior is in `skills/butterfly-effect/SKILL.md`. Its references are one level deep and loaded only for source discovery, correction classification, or output formatting. The rest of the repository provides documentation, npm distribution, Claude Code plugin distribution, and static checks.

## Distribution

| Channel | Mechanism |
|---|---|
| Multi-agent | `npx skills add HuaTalk/butterfly-effect-skill` |
| Claude Code | `/plugin install butterfly-effect@butterfly-effect` |

## Design Rules

1. The default artifact is the restart prompt itself.
2. Historical analysis is an internal means, not the default product output.
3. Later discoveries become investigation instructions unless they were available at the original start.
4. Every prompt clause must trace to evidence; inferred personality profiles are insufficient.
5. The prompt must preserve the original objective while preventing repeated correction loops.

## Commands

```bash
npm test
npm pack --dry-run
```

## Release

Version `0.1.0` is tracked in `package.json`, `.claude-plugin/plugin.json`, and `skills/butterfly-effect/SKILL.md`. Tag pushes run validation and publish to npm through a token bootstrap for the first release and Trusted Publisher for later releases.
