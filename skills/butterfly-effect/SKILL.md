---
name: butterfly-effect
description: Analyze a completed or ongoing AI session across coding, research, writing, design, planning, operations, and other work; link repeated human corrections to the earliest supported AI trajectory drift, then return a rewind recommendation and updated prompt. Use when users ask to rewind, restart better, rewrite the opening prompt, learn from corrections, reduce repeated guidance, or say 蝴蝶效应、AI偏斜纠正、回退建议、重开、如果一开始就知道、从纠偏生成提示词。
metadata:
  author: HuaTalk
  version: "0.3.0"
  category: prompt-engineering
---

# /butterfly-effect

Trace downstream corrections to the earliest supported trajectory drift, then recommend where to rewind and how to update the upstream prompt.

## Core Contract

- Produce a concise rewind recommendation and a copy-ready updated prompt, not a generic retrospective.
- Treat the current conversation as the default source.
- Ground every clause in observed corrections, accepted decisions, repeated preferences, or authoritative project context.
- Separate stable collaboration preferences from task-specific requirements and one-off course changes.
- Do not treat later discoveries as prior knowledge. Convert them into instructions to inspect, verify, or compare first.
- Preserve the user's original objective. Do not make the restarted task narrower merely to avoid uncertainty.
- Match the user's language unless explicitly asked otherwise.
- Do not reproduce secrets, credentials, private identifiers, or irrelevant personal content from session logs.
- Keep the source domain-neutral: preserve its audience, artifact, evidence standard, and acceptance criteria whether the work involves code, research, writing, design, planning, operations, or another domain.
- Identify the earliest reliable Agent assumption or action that caused a linked correction chain, or state that no single rewind point can be supported.

## Source Routing

- Use the complete current-session history when available. Start with the visible conversation; if it is truncated or lacks the early turns needed to locate drift and a current-session log is accessible, resolve only that session. Do not search unrelated local logs.
- Direct transcript or handoff path: read it and preserve message order.
- Named local session, ambiguous source, or transcript requiring discovery: read [Source resolution](references/source-resolution.md) before lookup.
- Multiple sessions: analyze each independently, then retain cross-session rules only when repeated or explicitly requested.

If history is unavailable, use visible evidence, state the gap in one sentence, and do not invent corrections.

## Workflow

### 1. Reconstruct the Original Start

Identify the original objective, intended audience or context, requested artifact, success criteria, initially available information, and the agent's first action. Keep later discoveries separate.

### 2. Build the Session Timeline

Read chronological human and Agent turns and mark the original request, Agent assumptions or actions, user corrections, accepted decisions, and later discoveries. Preserve turn identifiers or timestamps when the source provides them.

### 3. Extract and Link Correction Events

Record only turns where the user materially corrected the Agent's behavior, reasoning, scope, method, content, evidence, quality bar, output, or delivery. Internally map each event as `Agent assumption/action -> user correction -> resulting rule -> confidence`.

Link events into correction chains when they share the same objective and a common earlier assumption, or when one correction depends on another. Do not treat ordinary follow-up questions, independent new requirements, or requests for explanation as corrections unless they expose a flaw in the earlier approach.

Read [Correction taxonomy](references/correction-taxonomy.md) when classification is ambiguous, corrections conflict, multiple sessions are involved, or confidence is unclear. Read [Rewind analysis](references/rewind-analysis.md) when linking events, locating a rewind point, or handling multiple correction chains.

### 4. Locate the Rewind Point

For each correction chain, trace backward to the earliest Agent assumption or action whose removal or replacement would have prevented most of the linked corrections. Set the rewind boundary immediately before that turn, or at the original request when the drift began at the first action. Keep earlier valid decisions and state the evidence and confidence for the boundary.

If chains are independent, report multiple rewind points. If the evidence cannot support a reliable boundary, say so instead of inventing one.

### 5. Classify What Belongs in the Updated Prompt

| Evidence | Treatment |
| --- | --- |
| Repeated or explicitly remembered preference | Stable preference; include when relevant to the task. |
| Rule that prevents rework, scope drift, broken invariants, or wrong sequencing | Task-specific requirement; include directly. |
| One-off course change | Include only when it remains part of the final task; do not promote it to a stable preference. |
| Later discovery | Express as an inspection, reproduction, or verification step. |
| Contradiction | Use the latest explicit decision for its phase and scope. |
| Incidental implementation detail or weak inference | Omit or generalize to the underlying intent. |

### 6. Compose the Updated Prompt

Order clauses by execution time: objective and scope -> inspection or grounding -> decision gate -> execution constraints -> compatibility and trade-offs -> validation -> delivery -> output.

Use direct imperatives. Merge related corrections into one sentence. State defaults explicitly. Preserve important negative constraints such as "do not change the approved message," "do not publish before review," or domain-specific equivalents.

### 7. Run the Counterfactual Check

Check every high-confidence correction: would the prompt prevent it; does each clause use only initial knowledge or request discovery; is every constraint supported; can the prompt execute without the retrospective? Merge redundancy and revise until all checks pass.

## Output

Default output: a concise rewind recommendation followed by one copy-ready updated prompt. Do not replace either artifact with a generic retrospective.

Read [Output contract](references/output-contract.md) for the default two-part output, `--prompt-only`, `--detailed`, multiple cases, or output-format uncertainty. For multiple cases, produce independent rewind recommendations and prompts rather than summaries.

## Quality Bar

The rewind recommendation must point to the earliest supported drift boundary without claiming false precision. The updated prompt must let a fresh Agent pursue the same objective, create or evaluate the requested artifact, avoid the observed correction chains, and investigate unknown facts without the retrospective.
