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
- Treat the current conversation as the default source.
- Ground every clause in observed corrections, accepted decisions, repeated preferences, or authoritative project context.
- Separate stable collaboration preferences from task-specific requirements and one-off course changes.
- Do not treat later discoveries as prior knowledge. Convert them into instructions to inspect, verify, or compare first.
- Preserve the user's original objective. Do not make the restarted task narrower merely to avoid uncertainty.
- Match the user's language unless explicitly asked otherwise.
- Do not reproduce secrets, credentials, private identifiers, or irrelevant personal content from session logs.

## Source Routing

- Use the visible conversation when no source is supplied; do not search local logs.
- Direct transcript or handoff path: read it and preserve message order.
- Named local session, ambiguous source, or transcript requiring discovery: read [Source resolution](references/source-resolution.md) before lookup.
- Multiple sessions: analyze each independently, then retain cross-session rules only when repeated or explicitly requested.

If history is unavailable, use visible evidence, state the gap in one sentence, and do not invent corrections.

## Workflow

### 1. Reconstruct the Original Start

Identify the original objective, initially available information, and the agent's first action. Keep later discoveries separate.

### 2. Extract Correction Events

Record only turns where the user materially corrected the agent's behavior, reasoning, scope, design, output, or delivery. Internally map each event as `agent assumption/action -> user correction -> resulting rule -> confidence`.

Do not treat ordinary follow-up questions, new requirements, or requests for explanation as corrections unless they expose a flaw in the earlier approach.

Read [Correction taxonomy](references/correction-taxonomy.md) when classification is ambiguous, corrections conflict, multiple sessions are involved, or confidence is unclear.

### 3. Classify What Belongs in the Restart Prompt

| Evidence | Treatment |
| --- | --- |
| Repeated or explicitly remembered preference | Stable preference; include when relevant to the task. |
| Rule that prevents rework, scope drift, broken invariants, or wrong sequencing | Task-specific requirement; include directly. |
| One-off course change | Include only when it remains part of the final task; do not promote it to a stable preference. |
| Later discovery | Express as an inspection, reproduction, or verification step. |
| Contradiction | Use the latest explicit decision for its phase and scope. |
| Incidental implementation detail or weak inference | Omit or generalize to the underlying intent. |

### 4. Compose the Restart Prompt

Order clauses by execution time: objective and scope -> inspection -> decision gate -> implementation constraints -> compatibility and failure behavior -> verification -> delivery -> output.

Use direct imperatives. Merge related corrections into one sentence. State defaults explicitly. Preserve important negative constraints such as "do not modify V2" or "do not add tests unless requested."

### 5. Run the Counterfactual Check

Check every high-confidence correction: would the prompt prevent it; does each clause use only initial knowledge or request discovery; is every constraint supported; can the prompt execute without the retrospective? Merge redundancy and revise until all checks pass.

## Output

Default output: one blockquote containing only the restart prompt.

Read [Output contract](references/output-contract.md) only for `--detailed`, requested analysis, multiple cases, or output-format uncertainty. In detailed mode, put the restart prompt first. For multiple cases, produce independent prompts rather than summaries.

## Quality Bar

The prompt must let a fresh agent pursue the same objective, avoid the observed correction loops, and investigate unknown facts without the retrospective.
