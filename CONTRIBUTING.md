# Contributing to butterfly-effect-skill

Thanks for improving `/butterfly-effect`.

## Repository Layout

This repository has no runtime application or build. It contains the Skill, directly loaded references, user documentation, distribution metadata, and static checks.

| Change | Files to edit |
|---|---|
| Core behavior or routing | `skills/butterfly-effect/SKILL.md` and its directly linked references |
| User-facing install or usage behavior | `README.md`, `README-zh.md`, and matching bilingual docs |
| Progressive-loading structure | `docs/en/skill-progressive-loading.md` and `scripts/check-skill-contract.js` |
| npm or Claude Code distribution | `package.json` and `.claude-plugin/` |
| Repository and package contracts | `scripts/` and `.github/workflows/test.yml` |
| npm publication | `.github/workflows/publish.yml` and this release guide |

## Making a Change

1. Keep universal workflow and invariants in `skills/butterfly-effect/SKILL.md`. Put condition-specific detail in the matching directly linked reference.
2. Preserve the default rewind recommendation plus copy-ready updated prompt, current-conversation source, hindsight boundary, original objective, evidence grounding, and secret redaction.
3. Keep `README.md` and `README-zh.md` semantically and structurally equivalent. Update paired `docs/en/` and `docs/zh/` pages together.
4. Update `CHANGELOG.md` for release-visible behavior, documentation, packaging, or workflow changes.
5. Run `npm test` and inspect the full diff. Static checks do not replace fresh-context behavior evaluation.

Read [Skill progressive loading](docs/en/skill-progressive-loading.md) before moving instructions between `SKILL.md` and references.

## Language Conventions

- Maintainer-facing content is English: the Skill body, `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, scripts, CI, and maintainer docs.
- `README-zh.md` and `docs/zh/` are user-facing Chinese documentation.
- The Skill frontmatter description keeps bilingual trigger phrases for discovery.
- User-facing English and Chinese pages must describe the same behavior, even when the wording is not a literal translation.

## Design Constraints

Butterfly Effect is a post-hoc AI trajectory-drift correction tool. It is not a session recorder, persistent memory, a general prompt optimizer, or a report-first retrospective.

Every restart clause needs observed correction evidence, an accepted decision, a repeated preference, or authoritative project context. Facts knowable only after investigation become inspection or verification instructions. Do not turn isolated reactions into stable user traits.

## Evaluation

Use raw correction-heavy transcripts in a fresh context. Do not give the evaluator the intended restart prompt or your classification notes.

A successful result should:

- return a concise rewind recommendation followed by the copy-ready updated prompt by default;
- locate the earliest supported Agent assumption or action rather than treating the first user correction as the rewind point;
- cover every high-confidence correction;
- preserve the original objective;
- distinguish stable, task-specific, and one-off rules;
- turn later discoveries into investigation steps;
- report multiple independent chains or missing history without inventing a precise rewind boundary;
- exclude unsupported personality claims and private content.

For routing or output changes, compare the old and new Skill with identical transcripts. Add regression instructions only after observing a meaningful failure.

## Validation

```bash
npm test
git diff --check
```

`npm test` runs release-tag unit tests, version consistency, Skill contract and reference checks, manifest parsing, language boundaries, bilingual README structure, `npm pack --dry-run`, and packaged Markdown-link validation.

Individual checks remain available through `npm run check:versions`, `npm run check:skill`, and `npm run check:package`.

## Releasing

1. Update `CHANGELOG.md`. After the first public release, collect pending entries under `Unreleased` and move them to a dated version section when releasing.
2. Bump the version in `package.json`, `.claude-plugin/plugin.json`, and the Skill frontmatter metadata.
3. Run `npm test` and inspect `npm pack --dry-run` output.
4. Commit the release preparation.
5. Create the exact tag `vX.Y.Z`. CI rejects malformed tags and tags that differ from the shared version.
6. Push the commit and tag. The publish workflow validates the same repository and package contracts before contacting npm.

The package is scoped and public. `package.json` pins the official registry and public access; do not rely on machine-wide npm configuration.

### First npm Publication

Trusted Publisher cannot be configured until the npm package exists. Bootstrap the first release with a token:

1. Sign in with `npm login --scope=@huatalk --registry=https://registry.npmjs.org/`.
2. Confirm the account with `npm whoami --registry=https://registry.npmjs.org/` and verify it can publish under `@huatalk`.
3. Create a short-lived or granular npm token with publish permission and store it as the repository secret `NPM_TOKEN`.
4. Leave the repository variable `NPM_TRUSTED_PUBLISHER` unset or set to `false`.
5. Push the release tag. The workflow selects token mode and still requests npm provenance.
6. Confirm the package exists and the workflow's provenance verification step passes.

### Trusted Publisher Migration

After the package exists, configure npm Trusted Publisher with:

- GitHub owner: `HuaTalk`
- repository: `butterfly-effect-skill`
- workflow filename: `publish.yml`
- environment: leave unset unless the workflow is updated to use one

Set the GitHub repository variable `NPM_TRUSTED_PUBLISHER` to `true`, but keep the `NPM_TOKEN` secret during the first OIDC test. The variable makes the workflow choose OIDC explicitly; it does not silently fall back to the token.

Publish the next version and confirm both publication and the provenance verification step succeed. Only then delete `NPM_TOKEN`. If OIDC fails before npm accepts the version, fix the publisher claims and rerun the failed workflow. If npm accepted the version but a later verification step failed, inspect registry provenance before deciding whether another release is required.

The workflow pins the npm release client. Update that pin intentionally and validate its Node engine requirements before changing it.
