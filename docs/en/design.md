# Design

Butterfly Effect is a post-hoc trajectory-drift diagnosis tool. It uses an existing AI-assisted session to determine whether a produced task artifact had to be reworked because it missed the expected outcome, locate the earliest defensible boundary when it did, then return a rewind recommendation and an updated prompt for continuing the task from that point. It works across coding, research, writing, design, planning, operations, and other domains.

## Product Position

| Principle | Meaning |
|---|---|
| Zero preparation | Use conversation records that already exist. No tracker, hook, or correction labels must be installed before the session. |
| Artifact-first diagnosis | Establish that a produced task artifact was reworked because it missed the expected outcome before interpreting later requests. |
| Rewind-first | Return the earliest supported drift boundary and why it explains the artifact rework, followed by a prompt for continuing from that point. Supporting evidence is available through `--detailed`. |
| Counterfactual branch | Construct a better continuation from the selected history point while respecting what could actually have been known there. |
| Domain neutrality | Preserve the source task's audience, artifact, evidence standard, and acceptance criteria without importing coding-specific defaults. |

Zero preparation does not mean zero input. The Skill still needs the visible conversation, a resolvable session name, or a supplied transcript path. It does not reconstruct history that is no longer available.

The domain terms and rationale are recorded in [CONTEXT.md](../../CONTEXT.md) and [ADR 0001](../adr/0001-artifact-first-drift-diagnosis.md).

## Evidence Model

The primary evidence is the task artifact and its versions, not a subjective label applied to each user message.

| Evidence | Treatment |
|---|---|
| Produced artifact version later reworked because it missed the expected outcome | Establishes drift and supports causal analysis |
| Requirement added before an artifact version exists | Update the current target; it does not establish drift |
| Accepted artifact followed by ordinary feature or scope expansion | Continue normally; it does not establish drift |
| Repeated explanation, status, or context-management message | No task-artifact rework; return the no-reliable result |
| Later requirement relevant to an established drift | Include as a continuation constraint when it defines the desired artifact |
| Repeated preference or explicit request to remember | Treat as stable when relevant to the continued task |
| Fact discovered only after investigation | Convert it into an instruction to inspect, reproduce, or verify |
| Incidental domain detail or weak personality inference | Omit or generalize to the underlying intent |

Project rules and accepted final decisions can support a clause. A later request may describe the desired artifact without proving that drift occurred. Omit isolated reactions and inferred personality traits. Generated summaries are weaker evidence than raw chronological messages.

## Trajectory Drift and Rewind Model

The unit of diagnosis is a task artifact across produced versions. A task artifact is a user-intended work product that can be evaluated independently of Agent context management, such as code, a document, a design, a plan, or a final analysis. An unfinished response, status update, or ordinary conversational explanation is not an artifact unless that response is itself the requested deliverable.

Drift exists only when a produced artifact version had to be reworked because it missed the expected outcome or applicable constraints. The rewind point is the earliest Agent assumption or action whose replacement would have prevented that rework. Use an exact turn or timestamp only when the causal action is visible. When the evidence supports a causal stage but not an exact location, describe the boundary without inventing an identifier. Independent artifact drifts disprove one common rewind point but may retain separate supported boundaries. When no reworked artifact or causal boundary remains, return `No reliable drift or rewind point detected`.

The updated prompt keeps valid earlier decisions and translates hindsight into checks. It must prevent the artifact rework without asserting a root cause that was discovered only later. The no-reliable result does not include an updated prompt unless the user explicitly asks for reconstruction from limited evidence.

## Reconstruction Sequence

1. Identify the user-intended task artifact and its produced versions; return the no-reliable result when no version was reworked because it missed the expected outcome.
2. Trace each supported artifact rework to the earliest Agent action whose replacement would have prevented it.
3. Retain relevant later requirements as continuation constraints, keeping later discoveries as inspection or verification work.
4. Check every retained continuation constraint and prompt clause before returning the result.

The result should be usable without the retrospective. The Agent continuing from the selected point should not need the later conversation to understand the objective, gates, constraints, and verification requirements.

## The Hindsight Boundary

A requirement the user could have stated initially belongs directly in the prompt. A cause, hidden dependency, source limitation, or environmental constraint discovered during the work does not.

Later finding:

```text
The source data covers only one region.
```

History-point continuation clause:

```text
Verify source coverage and regional scope before drawing conclusions.
```

This keeps the prompt useful without inventing prior knowledge or prescribing a premature solution before verification.

## Contradictions and Evidence

Use the latest explicit decision for the same phase and scope. Earlier instructions may still apply elsewhere. For example, "do not finalize yet" can become a review gate rather than a permanent ban once the user later approves publication.

Prefer requirements and preferences that are explicit, repeated, accepted, or backed by project rules. Omit isolated reactions and inferred personality traits unless another source supports the same rule. Let the visible causal evidence determine whether the boundary is exact, descriptive, or unsupported.

## Non-goals

- Butterfly Effect is not a session recorder. It works after useful history already exists.
- It is not persistent memory. Cross-session preferences require repeated evidence or an explicit user request.
- It is not a general prompt optimizer. Every added clause must trace to artifact evidence, a continuation constraint, or authoritative project context.
- It is not report-first retrospective software. When drift is supported, the default artifacts are a concise rewind recommendation and the updated prompt.
- It does not make the continuation omniscient. Unknown facts remain investigation tasks.

## Counterfactual Validation

Before returning the prompt, ask:

1. Does the history contain a produced task artifact that was reworked because it missed the expected outcome?
2. Would replacing the proposed causal action have prevented that rework?
3. Was each retained requirement applicable at the selected point, or is later knowledge correctly phrased as discovery work?
4. Does the prompt preserve the original objective instead of narrowing the task to avoid uncertainty?
5. Can redundant constraints be merged without losing behavior?

## Failure Modes

| Failure | Effect | Guard |
|---|---|---|
| Transcript summary replaces raw messages | Artifact versions and rework evidence can lose order or attribution | Prefer chronological human and assistant turns |
| Messages are classified before identifying an artifact | Pre-version requirements and ordinary follow-ups create false drift | Identify produced artifact versions and rework first |
| Repeated explanations are treated as drift | Conversation volume creates a fictional rewind point | Require rework of a user-intended task artifact |
| Normal evolution of an accepted artifact is treated as drift | New scope is misrepresented as an earlier failure | Require evidence that the prior version missed the expected outcome |
| A prompt is generated even when no artifact drift is supported | Formatting pressure creates a fictional diagnosis and unsupported rules | Use the no-reliable fallback |
| One reaction becomes a stable preference | The prompt overfits the user | Require repetition, explicit memory intent, or final acceptance |
| Later root cause is asserted as known | The updated prompt leaks hindsight | Convert the fact into an inspection or verification step |
| First later request is mistaken for the rewind point | The recommendation rewinds too late and leaves the causal drift intact | Trace artifact rework back to the earlier Agent assumption or action |
| Output starts with a long analysis | The user must translate the report again | Put the concise rewind recommendation and updated prompt first |

## Evaluation

Repository checks validate static contracts, references, manifests, language boundaries, release tags, and package contents. They cannot prove that a model identifies artifact rework or its causal boundary accurately.

Behavior evaluation should use raw transcripts in a fresh context. Include a reworked code or document artifact, an in-flight format requirement, repeated code explanations, normal evolution after an accepted artifact, multiple independent artifact drifts, missing history, and weak causality. Do not provide the expected prompt or intended classification. Review whether the result identifies artifact drift before formatting, returns no-op for non-drift cases, locates only supported boundaries, retains relevant continuation constraints, excludes unsupported claims, preserves the original objective, and turns later discoveries into checks.
