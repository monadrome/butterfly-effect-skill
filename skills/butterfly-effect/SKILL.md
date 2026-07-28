---
name: butterfly-effect
description: Rewind AI sessions by using later corrections to find the earliest supported point where outputs began to diverge, then return a rewind recommendation and revised prompt. Use when users ask for session time travel, a turning point, 月光宝盒、蝴蝶效应, or a restart prompt learned from later corrections.
metadata:
  author: HuaTalk
  version: "0.5.0"
  category: prompt-engineering
---

# /butterfly-effect

Use hindsight from later corrections like a time machine: find the supported session turning point, then reconstruct the prompt needed for a better trajectory from there.

## Core Contract

- Diagnose trajectory drift before reconstructing a prompt. A correction is evidence, not automatically a causal chain or rewind point.
- When reliable drift exists, produce a concise rewind recommendation and a copy-ready updated prompt.
- Treat the current conversation as the default source.
- Ground every boundary and prompt clause in observed corrections, accepted decisions, repeated preferences, or authoritative project context.
- Separate stable collaboration preferences from task-specific requirements and one-off course changes.
- Keep independent correction chains separate; use a shared boundary only when the causal evidence supports one.
- Convert later discoveries into instructions to inspect, verify, or compare first; keep hindsight as a method, not invented prior knowledge.
- Preserve the user's original objective and the source task's audience, artifact, evidence standard, and acceptance criteria.
- Redact secrets, credentials, private identifiers, and irrelevant personal content from all output.

## Source Routing

- Use visible current-session history when it contains the opening request and candidate drift actions.
- For a direct transcript or handoff path, read it in message order.
- For a named local session, ambiguous source, or transcript requiring discovery, read [Source resolution](references/source-resolution.md) before lookup.
- Analyze multiple sessions independently; retain a cross-session rule only when it repeats or the user explicitly requests it.

When early history is unavailable, use the visible evidence, state the gap in one sentence, and avoid unsupported corrections, causal links, identifiers, or prompt clauses.

## Workflow

### 1. Reconstruct the Original Start

Identify the objective, audience or context, requested artifact, acceptance conditions, information available at that point, and the Agent's first action. Put later discoveries in a separate list.

**Complete when:** every reconstructed fact is attributable to the original context and every later fact is separated as hindsight.

### 2. Build and Classify the Timeline

Read human and Agent turns chronologically. Mark Agent assumptions or actions, accepted decisions, and later discoveries. A material correction changes the Agent's behavior, reasoning, scope, method, content, evidence, quality bar, output, or delivery. Split mixed human turns into distinct directives, then classify each relevant directive as a material correction, new requirement, ordinary follow-up, or unrelated content; preserve stable turn identifiers or timestamps when present.

**Complete when:** every relevant human directive has exactly one classification and every material correction points to the Agent behavior it addresses.

### 3. Build Correction Events

Map each material correction as:

```text
Agent assumption/action -> user correction -> resulting rule -> evidence strength
```

`Evidence strength` measures the correction itself: high when explicit, repeated, accepted, or project-backed; medium when explicit but isolated; low when inferred from style or indirect feedback. It does not measure whether the rewind boundary is causal.

Read [Correction taxonomy](references/correction-taxonomy.md) only when a turn's class, resulting rule, evidence strength, durability, or scope is ambiguous.

**Complete when:** every material correction has a resulting rule and evidence strength, while every excluded turn has a recorded classification.

### 4. Locate the Rewind Point

Link correction events only when they protect the same objective or acceptance condition and a supported earlier Agent action explains their consequences. For each chain, choose the earliest Agent assumption or action whose replacement would have prevented most linked corrections; set the boundary immediately before it and retain earlier valid decisions.

Assign `boundary confidence` separately:

- **High:** the Agent action is visible and multiple explicit or accepted corrections repair its consequences.
- **Medium:** the action and correction are visible, but part of the downstream causal link is inferred or only one material correction supports it.
- **Low:** the correction is visible but the suspected action or early history is incomplete; describe the boundary without a turn identifier.

Read [Rewind analysis](references/rewind-analysis.md) only for independent chains, conflicting candidate boundaries, missing early actions, weak causality, or a boundary below high confidence.

If no material chain or usable boundary is supported, return `No reliable drift or rewind point detected` plus one sentence naming the evidence gap, then stop unless the user explicitly requests reconstruction from limited evidence.

**Complete when:** every correction chain has one supported boundary with boundary confidence, an independent boundary, or the exact no-reliable result.

### 5. Select Prompt Material

| Evidence | Treatment |
|---|---|
| Repeated or explicitly remembered preference | Stable preference; include when relevant to the task. |
| Rule that prevents rework, scope drift, broken invariants, or wrong sequencing | Task-specific requirement; include directly. |
| One-off course change | Include only when it remains part of the final task. |
| Later discovery | Express as an inspection, reproduction, or verification step. |
| Contradiction | Use the latest explicit decision for its phase and scope. |
| Incidental detail or weak inference | Omit or generalize to the underlying intent. |

**Complete when:** every candidate clause has an evidence source, task scope, and durability classification.

### 6. Compose and Check the Updated Prompt

Order direct instructions by execution time: objective and scope -> inspection or grounding -> decision gate -> execution constraints -> compatibility and trade-offs -> validation -> delivery -> output. Use the task domain's own verbs and artifacts. Keep concrete names and constraints known at the boundary; turn later findings into discovery work.

Run the counterfactual check against every high-strength correction: would the prompt prevent it; is each clause known at the boundary or phrased as investigation; does it preserve the objective; can a fresh Agent execute it without the retrospective? Merge overlapping clauses.

**Complete when:** every high-strength correction is covered or explicitly excluded, and every prompt clause maps back to evidence.

### 7. Return the Result

For one supported chain, return exactly these two artifacts first:

```markdown
## Rewind recommendation

- Rewind to: before the Agent assumed ...
- Why: ...
- Keep: ...
- Confidence: high

## Updated prompt

> First establish ... Then ...
```

Keep the recommendation actionable and the prompt copy-ready. Read [Output contract](references/output-contract.md) only for explicit `--prompt-only`, `--detailed`, multiple independent cases, or output-format uncertainty.

**Complete when:** the result format matches the diagnosed outcome, every reported confidence is boundary confidence, and the user can use the prompt without the retrospective.

## Quality Bar

Account for every relevant human turn, every material correction, every chain, and every emitted prompt clause. The result is complete only when the rewind boundary is the earliest defensible point without false precision and the updated prompt preserves the original objective while preventing the supported correction chain.
