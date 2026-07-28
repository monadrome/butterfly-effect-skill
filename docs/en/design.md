# Design

Butterfly Effect is a post-hoc trajectory-drift diagnosis tool. It uses an existing AI-assisted session to determine whether a produced task artifact had to be reworked because it missed the expected outcome, locate the earliest defensible boundary when it did, then return a rewind recommendation and an updated prompt for continuing the task from that point. It works across coding, research, writing, design, planning, operations, and other domains.

## Product Position

| Principle | Meaning |
|---|---|
| Zero preparation | Use conversation records that already exist. No tracker, hook, or correction labels must be installed before the session. |
| Artifact-first diagnosis | Establish that a produced task artifact was reworked because it missed the expected outcome before interpreting later requests. |
| Rewind-first | Return the earliest supported drift boundary and why it explains the artifact rework, followed by a prompt for continuing from that point. Supporting evidence is available through `--detailed`. |
| Evidence salvage | Treat later history as mixed evidence: reject drift-dependent content, retain separable valid work, and translate hindsight-only facts into discovery work. |
| Counterfactual branch | Construct a better continuation from the selected history point while respecting what could actually have been known there. |
| Domain neutrality | Preserve the source task's audience, artifact, evidence standard, and acceptance criteria without importing coding-specific defaults. |

Zero preparation does not mean zero input. The Skill still needs the visible conversation, a resolvable session name, or a supplied transcript path. It does not reconstruct history that is no longer available.

The domain terms and rationale are recorded in [CONTEXT.md](../../CONTEXT.md), [ADR 0001](../adr/0001-artifact-first-drift-diagnosis.md), and [ADR 0002](../adr/0002-salvage-mixed-post-drift-evidence.md).

## Evidence Model

The primary evidence is the task artifact and its versions, not a subjective label applied to each user message.

| Evidence | Treatment |
|---|---|
| Produced artifact version later reworked because it missed the expected outcome | Establishes drift and supports causal analysis |
| Requirement added before an artifact version exists | Update the current target; it does not establish drift |
| Accepted artifact followed by ordinary feature or scope expansion | Continue normally; it does not establish drift |
| Repeated explanation, status, or context-management message | No task-artifact rework; return the no-reliable result |
| Later requirement relevant to an established drift | Include as a continuation constraint when it defines the desired artifact |
| Optional current description of what's wrong or right | Use as an evidence hint; verify it against artifact history and never let it establish drift by itself |
| Failed assumption, invalid decision, or artifact state dependent on the drift | Reject it from the continuation |
| Accepted partial work separable from the drift | Retain its valid outcome, interface, or constraint without retaining the causal assumption |
| Eliminated option | Preserve it as a negative constraint only when rejection is an applicable accepted decision or current instruction; otherwise require a decision or verification gate before retrying it |
| Repeated preference or explicit request to remember | Treat as stable when relevant to the continued task |
| Fact discovered only after investigation | Convert it into an instruction to inspect, reproduce, or verify |
| Incidental domain detail or weak personality inference | Omit or generalize to the underlying intent |

Project rules and accepted final decisions can support a clause. A later request may describe the desired artifact without proving that drift occurred. Omit isolated reactions and inferred personality traits. Generated summaries are weaker evidence than raw chronological messages.

## Context Corruption and Rewind Model

The unit of diagnosis is a task artifact across produced versions. A task artifact is a user-intended work product that can be evaluated independently of Agent context management, such as code, a document, a design, a plan, or a final analysis. An unfinished response, status update, or ordinary conversational explanation is not an artifact unless that response is itself the requested deliverable.

Drift exists only when a produced artifact version had to be reworked because it missed the expected outcome or applicable constraints. The rewind point is the earliest Agent assumption or action whose replacement would have prevented that rework. Use an exact turn or timestamp only when the causal action is visible. When the evidence supports a causal stage but not an exact location, describe the boundary without inventing an identifier. Independent artifact drifts disprove one common rewind point but may retain separate supported boundaries. When no reworked artifact or causal boundary remains, return `No reliable drift or rewind point detected`.

Once drift begins, later context may reinforce its assumptions, but the resulting Corrupted Suffix is not uniformly invalid. It can also contain accepted parts of the artifact, clarified constraints, reliable discoveries, eliminated options, and validation evidence. Evidence Salvage rejects what depends on the drift, directly retains what remains valid at the rewind point, and applies Hindsight Translation to useful later-only knowledge.

The updated prompt keeps valid earlier decisions and salvaged evidence while preventing the artifact rework. It cannot assert a root cause that was discovered only later. The no-reliable result does not include an updated prompt unless the user explicitly asks for reconstruction from limited evidence, even when evidence hints were supplied.

## Reconstruction Sequence

1. Identify the user-intended task artifact and its produced versions; return the no-reliable result when no version was reworked because it missed the expected outcome.
2. Trace each supported artifact rework to the earliest Agent action whose replacement would have prevented it.
3. Treat the Corrupted Suffix as mixed evidence: reject drift-dependent content, retain separable valid work and constraints, and translate later-only discoveries into inspection, decision, or verification work.
4. Use optional what's-wrong and what's-right descriptions to focus this analysis, but verify them against history and keep them subordinate to the drift gate.
5. Check every retained continuation constraint and prompt clause before returning the result.

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

An explicit current instruction controls the desired continuation even when it conflicts with visible history. Report the mismatch only when it affects the recommendation, and do not claim that the instruction appeared in earlier history. A what's-right hint can preserve an accepted portion of an artifact; a what's-wrong hint can focus the failed region or assumption. Neither can turn a pre-version addition, accepted evolution, or repeated explanation into drift.

## Non-goals

- Butterfly Effect is not a session recorder. It works after useful history already exists.
- It is not persistent memory. Cross-session preferences require repeated evidence or an explicit user request.
- It is not a general prompt optimizer. Every added clause must trace to artifact evidence, a continuation constraint, or authoritative project context.
- It is not a suffix summarizer. Later history is filtered for the continued task rather than compressed wholesale.
- It is not report-first retrospective software. When drift is supported, the default artifacts are a concise rewind recommendation and the updated prompt.
- It does not make the continuation omniscient. Unknown facts remain investigation tasks.

## Counterfactual Validation

Before returning the prompt, ask:

1. Does the history contain a produced task artifact that was reworked because it missed the expected outcome?
2. Would replacing the proposed causal action have prevented that rework?
3. Was each retained requirement applicable at the selected point, or is later knowledge correctly phrased as discovery work?
4. Did any accepted partial work or eliminated option survive only in a form independent of the causal drift?
5. Did evidence hints focus the analysis without replacing artifact evidence or rewriting history?
6. Does the prompt preserve the original objective instead of narrowing the task to avoid uncertainty?
7. Can redundant constraints be merged without losing behavior?

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
| The whole Corrupted Suffix is retained | Invalid assumptions and decisions survive the rewind | Reject drift-dependent content before composing the prompt |
| The whole Corrupted Suffix is discarded | Accepted work, eliminated options, and validation evidence are lost | Salvage only content that remains valid or can become discovery work |
| A what's-wrong or what's-right hint is treated as ground truth | User focus manufactures drift or falsifies history | Require artifact rework and distinguish the current instruction from historical evidence |
| First later request is mistaken for the rewind point | The recommendation rewinds too late and leaves the causal drift intact | Trace artifact rework back to the earlier Agent assumption or action |
| Output starts with a long analysis | The user must translate the report again | Put the concise rewind recommendation and updated prompt first |

## Evaluation

Repository checks validate static contracts, references, manifests, language boundaries, release tags, and package contents. They cannot prove that a model identifies artifact rework or its causal boundary accurately.

Behavior evaluation should use raw transcripts in a fresh context. Include a reworked code or document artifact, useful findings in a Corrupted Suffix, a supported eliminated option, accepted partial work, an in-flight format requirement, repeated code explanations, normal evolution after an accepted artifact, multiple independent artifact drifts, missing history, and weak causality. Exercise what's-wrong only, what's-right only, conflicting hints, and hints when no artifact drift exists. Do not provide the expected prompt or intended classification. Review whether the result identifies artifact drift before formatting, returns no-op for non-drift cases, locates only supported boundaries, rejects drift-dependent content, retains separable valid work, preserves eliminated options appropriately, excludes unsupported claims, preserves the original objective, and turns later discoveries into checks.
