---
name: butterfly-effect
description: Analyze a completed or ongoing AI session with repeated human corrections and turn the hindsight into a better initial prompt for restarting the task. Use when users ask to restart better, rewrite the opening prompt, learn from corrections, reduce repeated guidance, extract collaboration preferences, or say 蝴蝶效应、重开、重新开始、如果一开始就知道、从纠偏生成提示词、复盘后重写提示词。
metadata:
  author: HuaTalk
  version: "0.1.0"
  category: prompt-engineering
---

# /butterfly-effect

Turn downstream corrections into the smallest useful changes to the upstream prompt.

## Core Contract

- Produce a copy-ready restart prompt, not a generic retrospective.
- Treat the current conversation as the default source. If the user names another session or transcript, resolve and read that source first.
- Ground every clause in observed corrections, accepted decisions, repeated preferences, or authoritative project context.
- Separate stable collaboration preferences from task-specific requirements and one-off course changes.
- Do not pretend that facts discovered later were knowable at the start. Convert them into instructions to inspect, verify, or compare first.
- Preserve the user's original objective. Do not make the restarted task narrower merely to avoid uncertainty.
- Prefer one compact prompt. Include analysis only when the user requests it or passes `--detailed`.
- Match the user's language unless explicitly asked otherwise.
- Do not reproduce secrets, credentials, private identifiers, or irrelevant personal content from session logs.

## Source Routing

Before analyzing corrections, resolve the source:

- Current conversation or no source supplied: use the visible conversation context.
- Named Codex, Claude Code, or other local session: read [Source resolution](references/source-resolution.md).
- Transcript or handoff path: read the file directly and preserve message order.
- Multiple sessions: analyze each separately first, then keep only rules supported across sessions or explicitly requested by the user.

If the requested history is unavailable, use the evidence currently visible and state the missing source in one sentence. Do not invent corrections.

Accept an optional session name or transcript path in the user's request. Treat `--detailed` as a request for the supporting correction map in addition to the restart prompt.

## Workflow

### 1. Reconstruct the Original Start

Identify the initial objective, the information available at that moment, and the first action the agent took. Ignore later implementation details for now.

### 2. Extract Correction Events

Record only turns where the user materially changed or constrained the agent's behavior, reasoning, scope, design, output, or delivery. Read [Correction taxonomy](references/correction-taxonomy.md) when the session contains more than three correction events or ambiguous reversals.

For each event, capture internally:

```text
agent assumption/action -> user correction -> resulting rule -> confidence
```

Do not treat ordinary follow-up questions, new requirements, or requests for explanation as corrections unless they reveal that the earlier approach was inadequate.

### 3. Classify What Belongs in the Restart Prompt

Put a rule into the prompt when at least one condition holds:

- It would have prevented meaningful rework, scope drift, or a wrong implementation.
- The user repeated it or explicitly asked the agent to remember it.
- It protects an important invariant such as compatibility, worktree scope, review quality, or output format.
- It establishes the required order of work, such as analyze before implementing.

Exclude or soften:

- Facts that were discovered only through investigation. Rewrite them as a required check.
- Accidental implementation details that do not express intent.
- A preference contradicted by the user's later decision.
- Rules that overfit one line of code and would make the opening prompt harder to follow than the original task.

### 4. Compose the Restart Prompt

Order clauses by execution time:

```text
objective and scope
-> inspect and explain
-> decision gate
-> implementation constraints
-> compatibility and failure behavior
-> verification
-> delivery workflow
-> output contract
```

Use direct imperatives. Merge related corrections into one sentence. State defaults explicitly. Preserve important negative constraints such as "do not modify V2" or "do not add tests unless requested."

### 5. Run the Counterfactual Check

Before answering, test the draft against every high-confidence correction:

1. Would following this prompt have prevented or substantially reduced the correction?
2. Does the clause rely only on information available at the start, or correctly request discovery?
3. Did the prompt accidentally add a constraint the user never wanted?
4. Can redundant clauses be merged without losing behavior?
5. Is the prompt executable without reading the retrospective?

Revise until all high-confidence corrections are covered and no unsupported rule remains. Read [Output contract](references/output-contract.md) before producing the final response.

## Output

Default output: one blockquote containing only the restart prompt.

With `--detailed` or an explicit request for analysis, output in this order:

1. `Restart prompt` - always first.
2. `Corrections absorbed` - concise mapping from correction themes to prompt clauses.
3. `Not included` - later discoveries, contradictions, or low-confidence preferences excluded from the prompt.

If the user asks for multiple representative cases, write one independent restart prompt per case. Do not replace the prompts with case summaries.

## Quality Bar

A strong result lets a fresh agent begin from the prompt alone and avoid the same correction loops while still investigating unknown facts. It should feel like a better opening instruction, not a transcript compressed into prose.
