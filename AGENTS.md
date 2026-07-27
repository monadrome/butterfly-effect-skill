# Butterfly Effect - restart prompts from correction history

Butterfly Effect analyzes repeated human corrections in AI-assisted work and turns them into a better initial prompt, as if the task were restarted with hindsight.

## Core Contract

- Output a copy-ready restart prompt by default, not a retrospective report.
- Use the current conversation unless the user names another session or transcript.
- Ground clauses in observed corrections and accepted decisions.
- Separate stable preferences, task-specific requirements, and one-off changes.
- Convert facts knowable only later into instructions to inspect or verify.
- Preserve the original objective and avoid overfitting incidental code details.
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
- `skills/butterfly-effect/references/`: source discovery, correction taxonomy, and formatting details
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
