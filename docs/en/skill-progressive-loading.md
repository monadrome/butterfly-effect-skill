# Skill Progressive Loading

This guide explains how Butterfly Effect keeps activation context small without weakening source routing, correction classification, or output behavior. It is maintainer documentation, not a user tutorial.

## Loading Layers

| Layer | Loaded when | Content |
|---|---|---|
| Discovery metadata | During Skill discovery | Stable name and complete bilingual trigger description |
| `SKILL.md` | Every activation | Normal single-chain workflow, evidence strength, boundary confidence, fallback, default output, completion criteria, and conditional routes |
| Direct references | When the route requires them | Source lookup, ambiguous classification, exceptional rewind analysis, or non-default output modes |
| Static checks | Repository validation only | Version, reference graph, contract anchors, language, manifest, and package guards |

Moving text into a reference saves context only when `SKILL.md` states exactly when to read it. An unconditional reference merely relocates the cost.

## Current Routes

| Reference | Load condition |
|---|---|
| `references/source-resolution.md` | A named local session, ambiguous source, or transcript that requires discovery |
| `references/correction-taxonomy.md` | Ambiguous turn class, resulting rule, evidence strength, durability, or scope |
| `references/rewind-analysis.md` | Independent chains, conflicting candidate boundaries, missing early actions, weak causality, or boundary confidence below high |
| `references/output-contract.md` | Explicit `--prompt-only`, `--detailed`, multiple independent cases, or output-format uncertainty |

The visible current conversation, a direct transcript path, straightforward single-chain diagnosis, and default output stay in `SKILL.md`. References load only when a recognizable exceptional branch requires their detail.

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
- Keep one coherent conditional workflow in one reference.
- Do not duplicate the reference's detailed rules in the entry file.
- Keep the entry route and any universal invariant needed before loading the reference.

`scripts/check-skill-contract.js` enforces direct reachability, regular files, one-level paths, and the absence of local reference-to-reference links.

## Evaluation Loop

1. Record the baseline Skill revision and behavior oracle.
2. Measure `SKILL.md` lines, words, and bytes.
3. Change one high-cost conditional or duplicated block.
4. Run old and new versions with the same raw transcript in separate fresh contexts.
5. Grade observable output: source used, every relevant human directive classified, correction chains supported, evidence strength separated from boundary confidence, later discoveries converted, unsupported rules excluded, and explicit-only modes respected.
6. Add a focused harness only after a consequential failure is observed.
7. Run static checks and inspect the complete diff.

Do not give the evaluator the intended prompt or your diagnosis. A forward test is useful only when it can fail independently.

## Current Result

The entry file contains the complete normal single-chain path and a checkable completion criterion for every step. Four direct references hold only recognizable branches: source discovery, ambiguous correction classification, exceptional rewind analysis, and non-default output modes. The time-machine leading word, two confidence axes, no-reliable fallback, and explicit-only prompt mode remain testable repository anchors.

## Change Checklist

- Confirm the discovery description and version changed only when intended.
- Confirm universal rules remain in `SKILL.md`.
- Confirm every conditional rule has an explicit direct route.
- Run `npm test` and `git diff --check`.
- Run fresh-context behavior cases for routing or output changes.
- Inspect the raw output rather than relying on a self-reported summary.
- Record release-visible changes in `CHANGELOG.md`.

Static checks prove repository structure, not model behavior. Keep those claims separate.
