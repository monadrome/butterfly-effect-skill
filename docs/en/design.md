# Design

Butterfly Effect is a post-hoc reconstruction tool. It uses corrections from an existing AI-assisted session to improve the prompt that would start the same task again.

## Product Position

| Principle | Meaning |
|---|---|
| Zero preparation | Use conversation records that already exist. No tracker, hook, or correction labels must be installed before the session. |
| Prompt-first | Return a prompt ready for a fresh session. Analysis is supporting material available through `--detailed`. |
| Counterfactual restart | Ask what the user should have said initially, while respecting what could actually have been known then. |

Zero preparation does not mean zero input. The Skill still needs the visible conversation, a resolvable session name, or a supplied transcript path. It does not reconstruct history that is no longer available.

## Evidence Model

The same user statement can belong to different evidence classes depending on context.

| Evidence | Restart treatment |
|---|---|
| Repeated preference or explicit request to remember | Treat as stable when relevant to the restarted task |
| Correction that prevented rework or protected an invariant | Include as a task-specific requirement |
| One-off course change retained in the final result | Include for this restart, but do not generalize it into a user profile |
| Fact discovered only after investigation | Convert it into an instruction to inspect, reproduce, or verify |
| Earlier instruction contradicted by a later decision | Apply the latest explicit decision within its phase and scope |
| Incidental code detail or weak personality inference | Omit or generalize to the underlying intent |

Project rules and accepted final decisions can support a clause. Generated summaries are weaker evidence than raw chronological messages.

## Reconstruction Sequence

1. Recover the original objective and the information available at the first turn.
2. Identify material corrections, not every follow-up request.
3. Classify each correction by confidence, scope, and durability.
4. Compose direct instructions in execution order.
5. Check the prompt against every high-confidence correction.

The result should be usable without the retrospective. A fresh agent should not need access to the old conversation to understand the objective, gates, constraints, and verification requirements.

## The Hindsight Boundary

A requirement the user could have stated initially belongs directly in the prompt. A root cause, hidden dependency, or malformed data shape discovered during implementation does not.

Later finding:

```text
The production feature flag is only wired into one branch.
```

Counterfactual restart clause:

```text
Trace the feature flag through every relevant branch and verify its effective behavior before proposing a change.
```

This keeps the prompt useful without inventing prior knowledge or prescribing a line-level fix before inspection.

## Contradictions and Confidence

Use the latest explicit decision for the same phase and scope. Earlier instructions may still apply elsewhere. For example, "do not edit yet" can become an analysis gate rather than a permanent ban once the user later approves implementation.

Explicit, repeated, accepted, or project-backed corrections are high confidence. Isolated reactions and inferred personality traits are not. When confidence is low, omit the clause or make it task-specific instead of calling it a stable preference.

## Non-goals

- Butterfly Effect is not a session recorder. It works after useful history already exists.
- It is not persistent memory. Cross-session preferences require repeated evidence or an explicit user request.
- It is not a general prompt optimizer. Every added clause must trace to observed corrections or authoritative project context.
- It is not report-first retrospective software. The default artifact is the restart prompt.
- It does not make a fresh agent omniscient. Unknown facts remain investigation tasks.

## Counterfactual Validation

Before returning the prompt, ask:

1. Would following this clause have prevented or substantially reduced the corresponding correction?
2. Was the information available at the start, or is the clause correctly phrased as discovery work?
3. Does the clause preserve the original objective instead of narrowing the task to avoid uncertainty?
4. Is every constraint supported by evidence?
5. Can redundant clauses be merged without losing behavior?

## Failure Modes

| Failure | Effect | Guard |
|---|---|---|
| Transcript summary replaces raw messages | Corrections can lose order or attribution | Prefer chronological human and assistant turns |
| Every request is treated as a correction | The prompt becomes a transcript summary | Keep only turns that expose or change an earlier approach |
| One reaction becomes a stable preference | The prompt overfits the user | Require repetition, explicit memory intent, or final acceptance |
| Later root cause is asserted as known | The restart prompt leaks hindsight | Convert the fact into an inspection or verification step |
| Output starts with analysis | The user must translate the report again | Put the copy-ready prompt first; default to the prompt alone |

## Evaluation

Repository checks validate static contracts, references, manifests, language boundaries, release tags, and package contents. They cannot prove that a model extracts corrections accurately.

Behavior evaluation should use raw correction-heavy transcripts in a fresh context. Do not provide the expected prompt or the intended classification. Review whether the result covers every high-confidence correction, excludes unsupported claims, preserves the original objective, and turns later discoveries into checks. Add a regression fixture only after observing a real failure pattern.
