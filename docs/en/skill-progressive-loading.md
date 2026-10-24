# Skill Progressive Loading

This guide explains how Butterfly Effect keeps activation context small without weakening source routing or the decision contract. It is maintainer documentation, not a user tutorial.

## Loading Layers

| Layer | Loaded when | Content |
|---|---|---|
| Discovery metadata | During Skill discovery | Stable name and complete bilingual trigger description |
| `SKILL.md` | Every activation | Minimal decision contract, fallback, output modes, and the source-resolution route |
| Direct references | When the route requires them | Environment-specific session and transcript discovery |
| Static checks | Repository validation only | Version, reference graph, contract anchors, language, manifest, and package guards |

Moving text into a reference saves context only when `SKILL.md` states exactly when to read it. An unconditional reference merely relocates the cost.

## Current Routes

| Reference | Load condition |
|---|---|
| `references/source-resolution.md` | Named, ambiguous, truncated, or undiscovered interaction history |

Artifact-first diagnosis, rewind selection, hindsight handling, independent drifts, and output modes stay in the decision contract because they are product rules, not environment-specific lookup knowledge.

## Placement Test

Evaluate an instruction in this order:

1. Keep it in `SKILL.md` when it applies to every invocation, changes global order, protects a high-consequence invariant, or is needed to recognize a branch.
2. Move it to a direct reference when the branch is conditional and recognizable before the details are loaded.
3. Use a script when the operation is deterministic, repeated, and safer to execute than reconstruct from prose.
4. Add a static check for stable structure or a required runtime anchor; a checker must not replace runtime semantics.
5. Remove prose that only restates discovery metadata, explains ordinary model knowledge, or duplicates a sharper contract elsewhere.

Do not hide a universal safeguard behind a conditional route. Secret redaction, original-objective preservation, and the hindsight boundary must remain available on every invocation.

## Reference Rules

- Link every runtime reference directly from `SKILL.md` and keep the graph one level deep.
- Put the load condition beside the link.
- Keep one coherent conditional concern in one reference.
- Do not duplicate the reference's detailed rules in the entry file.
- Keep the entry route and any universal invariant needed before loading the reference.

`scripts/check-skill-contract.js` enforces direct reachability, regular files, one-level paths, and the absence of local reference-to-reference links.

## Evaluation Loop

1. Record the baseline Skill revision and behavior oracle.
2. Record the exact required files for each invocation path and total their source bytes, including the complete `SKILL.md` and every required reference. Measure repository instructions separately.
3. Change one high-cost conditional or duplicated block.
4. Run old and new versions with the same raw transcript in separate fresh contexts.
5. Grade observable output: task artifact identified, rework supported, no-op cases rejected, boundary precision justified, continuation constraints retained, later discoveries converted, and explicit-only modes respected.
6. Add a focused harness only after a consequential failure is observed.
7. Run static checks and inspect the complete diff.

Do not give the evaluator the intended prompt or your diagnosis. A forward test is useful only when it can fail independently.

## Current Result

The entry file is a decision contract rather than a reasoning tutorial. Its only direct reference contains environment-specific source discovery. Rewind advice, false-precision prevention, the no-reliable fallback, and explicit-only prompt mode remain testable repository anchors.

The 2026-10-22 maintenance comparison uses initial HEAD `566cee7c96701de6a2359596f6b8de1ff62eb99b` as its immutable baseline. The Skill entry and its single conditional reference are unchanged. The following complete required-path totals count UTF-8 source bytes from that baseline and this revision:

| Invocation path | Complete required files | Initial HEAD | This revision | Change |
|---|---|---:|---:|---:|
| Current conversation with visible history | `skills/butterfly-effect/SKILL.md` | 3,461 | 3,461 | 0 (unchanged) |
| Named, ambiguous, truncated, or undiscovered history | `skills/butterfly-effect/SKILL.md`; `skills/butterfly-effect/references/source-resolution.md` | 6,346 | 6,346 | 0 (unchanged) |

The complete `SKILL.md`, including frontmatter, is counted once per path. Conversation and transcript content, tool output, and host-provided instructions are excluded. Required reference counts remain zero and one respectively; a reference read need not correspond to one tool round trip because hosts may batch reads.

Repository instructions are a separate source cost:

| File | Initial HEAD | This revision | Change |
|---|---:|---:|---:|
| `AGENTS.md` | 2,912 | 1,847 | -1,065 |
| `CLAUDE.md` | 3,096 | 24 | -3,072 |

The 24-byte Claude file imports `AGENTS.md`; it is not a 24-byte total after import expansion. These files affect repository maintenance where the host loads them. They are not part of an installed Skill invocation in another project that does not load this repository's instructions.

Reproduce the file sizes from the repository root, then add the complete file sets listed above. The baseline commit is the exact Git object named above; no session-temporary file is required:

```bash
node <<'NODE'
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const baseline = '566cee7c96701de6a2359596f6b8de1ff62eb99b';
for (const file of [
  'skills/butterfly-effect/SKILL.md',
  'skills/butterfly-effect/references/source-resolution.md',
  'AGENTS.md',
  'CLAUDE.md',
]) {
  const before = execFileSync('git', ['show', `${baseline}:${file}`]).length;
  const after = fs.readFileSync(file).length;
  console.log(`${file}: ${before} -> ${after} bytes (${after - before})`);
}
NODE
```

These are static source-size comparisons, not token, latency, context-window, accuracy, or cross-agent behavior measurements. No host loading traces were collected. The unchanged runtime routes provide no demonstrated runtime context saving; maintenance instruction deduplication does not establish model or performance effects.

## Change Checklist

- Confirm the discovery description and version changed only when intended.
- Confirm universal rules remain in `SKILL.md`.
- Confirm every conditional rule has an explicit direct route.
- Run `npm test` and `git diff --check`.
- Run fresh-context behavior cases for routing or output changes.
- Inspect the raw output rather than relying on a self-reported summary.
- Record release-visible changes in `CHANGELOG.md`.

Static checks prove repository structure, not model behavior. Keep those claims separate.
