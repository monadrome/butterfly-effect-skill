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
2. Preserve artifact-first diagnosis before reconstruction, no-op when no task artifact was reworked, the supported-drift default of rewind recommendation plus copy-ready updated prompt, explicit-only `--prompt-only`, current-conversation source, hindsight boundary, original objective, evidence grounding, and secret redaction.
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

Butterfly Effect is a post-hoc AI trajectory-drift diagnosis and correction tool. It is not a session recorder, persistent memory, general prompt optimizer, or report-first retrospective.

Every updated-prompt clause needs artifact evidence, a continuation constraint, an accepted decision, a repeated preference, or authoritative project context. Facts knowable only after investigation become inspection or verification instructions. Do not turn isolated reactions into stable user traits.

## Evaluation

Use raw transcripts in a fresh context. Do not give the evaluator the intended updated prompt or expected drift diagnosis.

A successful result should:

- return a concise rewind recommendation followed by the copy-ready updated prompt by default when drift is supported;
- identify a produced task artifact and evidence that it was reworked because it missed the expected outcome;
- return the no-reliable result for requirements added before an artifact version exists, normal evolution after acceptance, and repeated explanations without artifact rework;
- select the evidence outcome before applying an output format and keep `--prompt-only` explicit-only;
- locate the earliest supported Agent assumption or action rather than treating the first later request as the rewind point;
- cover every retained continuation constraint with supporting evidence;
- preserve the original objective;
- distinguish stable, task-specific, and one-off rules;
- turn later discoveries into investigation steps;
- report multiple independent artifact drifts or missing history without inventing a precise rewind boundary or shared cause;
- return the no-reliable fallback without a synthetic updated prompt when no reworked artifact or usable boundary is supported;
- exclude unsupported personality claims and private content.

For routing or output changes, compare the old and new Skill with identical transcripts. Add regression instructions only after observing a meaningful failure.

## Validation

```bash
npm test
npm run release:check
git diff --check
```

`npm test` runs release-tag unit tests, version consistency, Skill contract and reference checks, manifest parsing, language boundaries, bilingual README structure, `npm pack --dry-run`, packaged Markdown-link validation, and a clean tarball installation smoke test. `npm run release:check` then exercises npm's publication dry run with the same public registry and access settings used by CI.

Individual checks remain available through `npm run check:versions`, `npm run check:skill`, and `npm run check:package`.

## Releasing

1. Update `CHANGELOG.md`. After the first public release, collect pending entries under `Unreleased` and move them to a dated version section when releasing.
2. Bump the version in `package.json`, `.claude-plugin/plugin.json`, and the Skill frontmatter metadata.
3. Run `npm run release:check` and inspect the npm publication dry-run output.
4. Commit the release preparation.
5. Create the exact tag `vX.Y.Z`. CI rejects malformed tags and tags that differ from the shared version.
6. Push the commit and tag. The publish workflow validates the same repository and package contracts before contacting npm.

The package is scoped and public. `package.json` pins the official registry and public access; do not rely on machine-wide npm configuration.

### First npm Publication

Trusted Publisher cannot be configured until the npm package exists. Bootstrap the first release with a token:

1. Sign in with `npm login --scope=@huatalk --registry=https://registry.npmjs.org/`.
2. Confirm the account with `npm whoami --registry=https://registry.npmjs.org/` and verify it can publish under `@huatalk`.
3. Confirm the package name is not already occupied with `npm view @huatalk/butterfly-effect-skill --registry=https://registry.npmjs.org/`; `E404` is expected before the first release.
4. Create a short-lived or granular npm token with publish permission and store it as the repository secret `NPM_TOKEN`.
5. Leave the repository variable `NPM_TRUSTED_PUBLISHER` unset or set to `false`.
6. Push the release tag. The workflow selects token mode and still requests npm provenance.
7. Confirm the package exists and the workflow's provenance verification step passes.

### Trusted Publisher Migration

After the package exists, configure npm Trusted Publisher with:

- GitHub owner: `HuaTalk`
- repository: `butterfly-effect-skill`
- workflow filename: `publish.yml`
- environment: leave unset unless the workflow is updated to use one

Set the GitHub repository variable `NPM_TRUSTED_PUBLISHER` to `true`, but keep the `NPM_TOKEN` secret during the first OIDC test. The variable makes the workflow choose OIDC explicitly; it does not silently fall back to the token.

Publish the next version and confirm both publication and the provenance verification step succeed. Only then delete `NPM_TOKEN`. If OIDC fails before npm accepts the version, fix the publisher claims and rerun the failed workflow. If npm accepted the version but a later verification step failed, inspect registry provenance before deciding whether another release is required.

The workflow pins the npm release client. Update that pin intentionally and validate its Node engine requirements before changing it.
