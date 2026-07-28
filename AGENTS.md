# Butterfly Effect - trajectory drift diagnosis and correction

Butterfly Effect first determines whether an AI session contains supported trajectory drift, then finds the earliest defensible Agent action behind each correction chain and turns that evidence into a rewind recommendation plus an updated initial prompt.

## Core Contract

- Diagnose drift before reconstructing a prompt; do not assume every session has a rewind point.
- When drift is supported, output a concise rewind recommendation and a copy-ready updated prompt by default, not a retrospective report.
- Use the current conversation unless the user names another session or transcript.
- Ground clauses in observed corrections and accepted decisions.
- Separate stable preferences, task-specific requirements, and one-off changes.
- Convert facts knowable only later into instructions to inspect or verify.
- Preserve the original objective and avoid overfitting incidental code details.
- Do not mistake the first user correction for the rewind point; trace it back to the earlier Agent assumption or action.
- Keep independent correction chains separate, lower confidence when history or causality is weak, and return `No reliable drift or rewind point detected` when no usable boundary exists.
- Treat `--prompt-only` as explicit-only; never infer prompt-only output as the default.
- Redact secrets and irrelevant private content from all output.

## Commands

```bash
npm test
node --test scripts/check-versions.test.js
node scripts/check-versions.js
node scripts/check-skill-contract.js
npm run check:package
```

## Repository Map

- `skills/butterfly-effect/SKILL.md`: canonical workflow and output contract
- `skills/butterfly-effect/references/`: source discovery, correction taxonomy, rewind decisions, confidence, and formatting details
- `.claude-plugin/`: Claude Code plugin and marketplace metadata
- `scripts/`: release-tag, repository, Skill, documentation, and package checks
- `README.md` / `README-zh.md`: equivalent user-facing documentation
- `docs/en/skill-progressive-loading.md`: maintainer guidance for instruction placement and evaluation

## Maintenance

- Keep the Skill body and maintainer-facing files in English.
- Keep bilingual discovery terms in the frontmatter description.
- Keep both READMEs structurally equivalent.
- Bump the version in `package.json`, `.claude-plugin/plugin.json`, and Skill metadata together.
- Do not claim a preference is stable unless the source evidence supports it.
- Keep `NPM_TOKEN` until a Trusted Publisher release and its provenance check both succeed.
