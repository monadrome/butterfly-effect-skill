# Correction Taxonomy

Use this taxonomy to distinguish reusable prompt clauses from ordinary conversation.

| Type | Signal | Typical updated-prompt clause |
|---|---|---|
| Phase | "Inspect before acting" | Inspect, outline, or ask for approval before drafting, changing, publishing, or executing. |
| Scope | Wrong audience, channel, source, locale, file, module, branch, or worktree | Work only in the named scope and verify it before acting. |
| Objective | Agent solved a narrower or different problem | Preserve the stated outcome, audience, and success criteria. |
| Method | User changes the structure, tone, sequence, medium, architecture, or algorithm | Follow the selected approach without copying incidental details. |
| Constraints | Existing behavior, policy, brand, budget, format, accessibility, or invariants must survive | Preserve the constraint and define a compatible fallback when needed. |
| Evidence | User asks for sources, data, logs, examples, or domain proof | Verify against authoritative or user-provided evidence before concluding. |
| Quality | User controls tests, fact checks, examples, visual review, or stakeholder approval | State the relevant validation and acceptance policy. |
| Delivery | Handoff, export, publication, commit, push, or review shape matters | Define the completion artifact and delivery workflow. |
| Output | User wants a prompt, document, table, or concise answer | Put the requested artifact first and omit unrequested narration. |
| Language | User corrects a term, example, or semantic range | Use the corrected terminology and avoid the narrowing word. |

## Evidence Strength

Evidence strength grades the resulting rule, not the causal confidence of a rewind boundary:

- **High:** explicit, repeated, accepted in the final result, or supported by project rules.
- **Medium:** explicit but isolated, with no conflicting later decision.
- **Low:** inferred from style, indirect feedback, or a reaction whose task scope is unclear.

Use low-strength evidence only to interpret stronger events; omit it from the updated prompt unless another source supports the same rule.

## Contradictions

Use the latest explicit decision for the task. Keep an earlier rule only when it applies to a different phase or scope. For example, "do not finalize yet" can coexist with a later approval to publish by becoming a review gate rather than a permanent prohibition.

## Discoveries versus instructions

Do not place a later domain or environment finding into the opening prompt as a fact unless the user already knew it. Translate it:

```text
Later finding: the source data covers only one region.
Updated-prompt clause: verify source coverage and regional scope before drawing conclusions.
```
