# Butterfly Effect - trajectory drift diagnosis and correction

Butterfly Effect first determines whether a produced task artifact was reworked because it missed the expected outcome, then finds the earliest defensible Agent action behind that drift and turns the evidence into a rewind recommendation plus an updated prompt.

## Core Contract

- Diagnose drift from a reworked task artifact before reconstructing a prompt; do not infer drift from later requests alone.
- When drift is supported, output a concise rewind recommendation and a copy-ready updated prompt by default, not a retrospective report.
- Use the current conversation unless the user names another session or transcript.
- Ground clauses in artifact evidence, continuation constraints, and accepted decisions.
- Treat history at and after the rewind point as mixed evidence: reject drift-dependent content, retain separable valid work, and translate hindsight-only facts into discovery or verification steps.
- Treat optional descriptions of what's wrong or right as focus hints, never as substitutes for artifact rework or causal evidence.
- Separate stable preferences, task-specific requirements, and one-off changes.
- Convert facts knowable only later into instructions to inspect or verify.
- Preserve the original objective and avoid overfitting incidental code details.
- Treat requirements added before an artifact version exists, normal evolution after acceptance, and repeated explanations without artifact rework as no-op.
- Do not mistake the first later request for the rewind point; trace artifact rework back to the earlier Agent assumption or action.
- Keep independent artifact drifts separate. Use a descriptive boundary when exact history is missing, and return `No reliable drift or rewind point detected` when causality cannot support a boundary.
- Treat `--prompt-only` as explicit-only; never infer prompt-only output as the default.
- Redact secrets and irrelevant private content from all output.

## Commands

```bash
npm test
npm run release:check
node --test scripts/check-versions.test.js
node scripts/check-versions.js
node scripts/check-skill-contract.js
npm run check:package
```

## Repository Map

- `skills/butterfly-effect/SKILL.md`: canonical decision and output contract
- `skills/butterfly-effect/references/source-resolution.md`: environment-specific session and transcript discovery
- `.claude-plugin/`: Claude Code plugin and marketplace metadata
- `scripts/`: release-tag, repository, Skill, documentation, and package checks
- `README.md` / `README-zh.md`: equivalent user-facing documentation
- `CONTEXT.md` / `docs/adr/`: domain language and architectural decisions
- `docs/en/skill-progressive-loading.md`: maintainer guidance for instruction placement and evaluation

## Maintenance

- Keep the Skill body and maintainer-facing files in English.
- Keep bilingual discovery terms in the frontmatter description.
- Keep both READMEs structurally equivalent.
- Bump the version in `package.json`, `.claude-plugin/plugin.json`, and Skill metadata together.
- Do not claim a preference is stable unless the source evidence supports it.
- Keep the default result concise; evidence salvage belongs in `Keep`, the updated prompt, or explicit detailed output rather than a new mandatory report section.
- Keep `NPM_TOKEN` until a Trusted Publisher release and its provenance check both succeed.
