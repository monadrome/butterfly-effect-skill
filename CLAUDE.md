# CLAUDE.md

This repository packages the `/butterfly-effect` Agent Skill for turning correction-heavy AI sessions into better restart prompts.

## Architecture

The canonical behavior is in `skills/butterfly-effect/SKILL.md`. Its references are one level deep and load only for source discovery, ambiguous correction classification, or non-default output formatting. The rest of the repository provides bilingual user documentation, npm and Claude Code distribution, maintainer guidance, and static checks.

Read `docs/en/skill-progressive-loading.md` before moving instructions between the entry file and references.

## Distribution

| Channel | Mechanism |
|---|---|
| Agent Skills | `npx skills add HuaTalk/butterfly-effect-skill` |
| Claude Code | `/plugin install butterfly-effect@butterfly-effect` |

## Design Rules

1. The default artifact is the restart prompt itself.
2. Historical analysis is an internal means, not the default product output.
3. Later discoveries become investigation instructions unless they were available at the original start.
4. Every prompt clause must trace to evidence; inferred personality profiles are insufficient.
5. The prompt must preserve the original objective while preventing repeated correction loops.
6. User-facing English and Chinese documentation must remain structurally and semantically equivalent.

## Commands

```bash
npm test
npm run check:versions
npm run check:skill
npm run check:package
git diff --check
```

## Release

The release version is tracked in `package.json`, `.claude-plugin/plugin.json`, and `skills/butterfly-effect/SKILL.md`. Tag pushes must use the exact shared `vX.Y.Z` tag.

The first npm release uses the `NPM_TOKEN` repository secret. After configuring npm Trusted Publisher, set the repository variable `NPM_TRUSTED_PUBLISHER=true` to select OIDC explicitly. Keep the token secret until an OIDC release publishes successfully and the workflow verifies registry provenance. See `CONTRIBUTING.md` for the complete sequence.
