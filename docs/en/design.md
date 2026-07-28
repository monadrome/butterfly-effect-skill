# Design

Butterfly Effect is a post-hoc trajectory-drift correction tool, not a restart-prompt generator. It uses an existing AI-assisted session to determine whether the Agent's course diverged from the user's objective, locate the earliest defensible boundary when it did, then return a rewind recommendation and an updated prompt for restarting the same task. It works across coding, research, writing, design, planning, operations, and other domains.

## Product Position

| Principle | Meaning |
|---|---|
| Zero preparation | Use conversation records that already exist. No tracker, hook, or correction labels must be installed before the session. |
| Diagnosis before reconstruction | Establish that a material correction chain and usable drift boundary exist before producing an updated prompt. |
| Rewind-first | Return the earliest supported drift boundary and why it explains the correction chain, followed by a prompt ready for a fresh session. Supporting evidence is available through `--detailed`. |
| Counterfactual restart | Ask what the user should have said initially, while respecting what could actually have been known then. |
| Domain neutrality | Preserve the source task's audience, artifact, evidence standard, and acceptance criteria without importing coding-specific defaults. |

Zero preparation does not mean zero input. The Skill still needs the visible conversation, a resolvable session name, or a supplied transcript path. It does not reconstruct history that is no longer available.

## Evidence Model

The same user statement can belong to different evidence classes depending on context.

| Evidence | Updated-prompt treatment |
|---|---|
| Repeated preference or explicit request to remember | Treat as stable when relevant to the restarted task |
| Correction that prevented rework or protected an invariant | Include as a task-specific requirement |
| One-off course change retained in the final result | Include for this restart, but do not generalize it into a user profile |
| Fact discovered only after investigation | Convert it into an instruction to inspect, reproduce, or verify |
| Earlier instruction contradicted by a later decision | Apply the latest explicit decision within its phase and scope |
| Incidental domain detail or weak personality inference | Omit or generalize to the underlying intent |

Project rules and accepted final decisions can support a clause. Generated summaries are weaker evidence than raw chronological messages.

Evidence strength grades the correction or resulting rule: explicit, repeated, accepted, or project-backed evidence is stronger than an isolated or inferred reaction. It is separate from boundary confidence, which grades the causal link between corrections and an earlier Agent action.

## Trajectory Drift and Rewind Model

The unit of analysis is a correction chain, not an isolated user message. A chain links an Agent assumption or action to a material user correction and the downstream corrections that repair the same objective, audience, artifact, or acceptance criterion.

The rewind point is the earliest Agent assumption or action that caused most of the linked corrections. It is not automatically the first user correction. The recommendation should identify the boundary as `before turn <id>`, `before <timestamp>`, `before the Agent assumed ...`, or `the original request` only when the evidence supports that precision. Independent chains disprove one common rewind point but may retain separate supported boundaries; mark the overall result medium or low boundary confidence even when an individual chain has high boundary confidence. Missing early history or weak causality requires lower boundary confidence and a non-precise boundary; when no material chain or usable boundary remains, return `No reliable drift or rewind point detected` rather than inventing a location.

The updated prompt keeps valid earlier decisions and translates hindsight into checks. It must prevent the linked correction chain without asserting a root cause that was discovered only later. The no-reliable result does not include an updated prompt unless the user explicitly asks for reconstruction from limited evidence.

## Reconstruction Sequence

1. Recover the original objective and the information available at the first turn.
2. Build a chronological timeline of Agent assumptions, actions, corrections, accepted decisions, and later discoveries.
3. Identify material corrections, link them into causal chains, and locate the earliest supported drift boundary for each chain.
4. Classify each correction by evidence strength, scope, and durability.
5. Choose the output outcome: one boundary, separate independent boundaries, a qualified low-confidence boundary, or the no-reliable fallback.
6. When the outcome supports reconstruction, compose the rewind recommendation and updated prompt in execution order.
7. Check the prompt against every high-strength correction and disclose missing or ambiguous history.

The result should be usable without the retrospective. A fresh agent should not need access to the old conversation to understand the objective, gates, constraints, and verification requirements.

## The Hindsight Boundary

A requirement the user could have stated initially belongs directly in the prompt. A cause, hidden dependency, source limitation, or environmental constraint discovered during the work does not.

Later finding:

```text
The source data covers only one region.
```

Counterfactual restart clause:

```text
Verify source coverage and regional scope before drawing conclusions.
```

This keeps the prompt useful without inventing prior knowledge or prescribing a premature solution before verification.

## Contradictions and Evidence Strength

Use the latest explicit decision for the same phase and scope. Earlier instructions may still apply elsewhere. For example, "do not finalize yet" can become a review gate rather than a permanent ban once the user later approves publication.

Explicit, repeated, accepted, or project-backed corrections have high evidence strength. Isolated reactions and inferred personality traits do not. When evidence strength is low, omit the clause or make it task-specific instead of calling it a stable preference. Grade boundary confidence separately from the visibility of the Agent action and the causal link to its downstream corrections.

## Non-goals

- Butterfly Effect is not a session recorder. It works after useful history already exists.
- It is not persistent memory. Cross-session preferences require repeated evidence or an explicit user request.
- It is not a restart-prompt generator. Prompt reconstruction follows a supported trajectory-drift diagnosis and is skipped when evidence cannot support one.
- It is not a general prompt optimizer. Every added clause must trace to observed corrections or authoritative project context.
- It is not report-first retrospective software. When drift is supported, the default artifacts are a concise rewind recommendation and the updated prompt.
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
| A prompt is generated even when no drift is supported | Formatting pressure creates a fictional diagnosis and unsupported rules | Choose the evidence outcome before formatting and use the no-reliable fallback |
| One reaction becomes a stable preference | The prompt overfits the user | Require repetition, explicit memory intent, or final acceptance |
| Later root cause is asserted as known | The updated prompt leaks hindsight | Convert the fact into an inspection or verification step |
| First user correction is mistaken for the rewind point | The recommendation rewinds too late and leaves the causal drift intact | Trace the correction chain back to the earlier Agent assumption or action |
| Output starts with a long analysis | The user must translate the report again | Put the concise rewind recommendation and updated prompt first |

## Evaluation

Repository checks validate static contracts, references, manifests, language boundaries, release tags, and package contents. They cannot prove that a model extracts corrections accurately.

Behavior evaluation should use raw transcripts in a fresh context. Include cases with one shared drift, multiple independent chains, missing early history, weak causality, and no material drift. Do not provide the expected prompt or intended classification. Review whether the result selects the correct outcome before formatting, locates only supported boundaries, covers every high-strength correction, excludes unsupported claims, preserves the original objective, and turns later discoveries into checks. Add a regression fixture only after observing a real failure pattern.
