# Butterfly Effect: repository maintenance

This repository ships the `/butterfly-effect` Agent Skill, user documentation, distribution metadata, and static checks. There is no runtime application or build.

## Working Conventions

- Keep runtime behavior in `./skills/butterfly-effect/SKILL.md` and its directly routed references. Ordinary maintenance is not a Skill invocation; do not apply the Skill's diagnosis or output rules to maintenance replies or edits.
- Preserve the product purpose and runtime contract. Read the Skill before changing behavior; do not add runtime rules from a maintenance concern without evidence.
- Maintainer-facing files and Skill prose are English. Keep bilingual discovery terms in frontmatter; Chinese user documentation belongs in `./README-zh.md` and `./docs/zh/`.
- Keep `./README.md` and `./README-zh.md` structurally and semantically equivalent, and update paired English and Chinese docs together.

## Checks

- Run `npm test` and `git diff --check` before delivery.
- Run `npm run check:package` when packaging or distribution files change.
- Static checks validate repository structure and contract anchors, not model behavior, loading costs, latency, or accuracy. Qualify those claims.
- Record notable changes under `Unreleased` in `./CHANGELOG.md`. Maintenance-only refactors do not require a version bump or release tag.

## Read When Needed

- Changing runtime behavior or source routing: read `./skills/butterfly-effect/SKILL.md`, then only the relevant reference.
- Moving instructions or evaluating loading costs: read `./docs/en/skill-progressive-loading.md`.
- Changing documentation or bilingual structure: read `./CONTRIBUTING.md` and the paired pages.
- Changing packaging, plugin metadata, or preparing a release: read `./CONTRIBUTING.md` and the relevant files under `./.claude-plugin/`.
