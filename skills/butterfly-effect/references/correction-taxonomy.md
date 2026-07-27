# Correction Taxonomy

Use this taxonomy to distinguish reusable prompt clauses from ordinary conversation.

| Type | Signal | Typical restart clause |
|---|---|---|
| Phase | "先分析，不要改" | Inspect and explain before implementation; wait for approval. |
| Scope | Wrong module, branch, worktree, file, or version | Work only in the named scope and verify it before edits. |
| Objective | Agent solved a narrower or different problem | Preserve the stated business outcome and success criteria. |
| Architecture | User changes boundaries, ownership, state, or abstraction | Keep side effects at the entry; use explicit inputs; preserve old paths. |
| Compatibility | Existing behavior or malformed input must survive | Add a gated path, normalize input, log and fall back. |
| Algorithm | User requests short-circuiting, ordering, caching, or a different primitive | State the decision strategy without copying incidental code. |
| Evidence | User asks for code, production config, or business-chain proof | Verify against authoritative sources before concluding. |
| Testing | User controls whether tests are added or only run | State the exact test creation and execution policy. |
| Delivery | Commit shape, push, PR, rebase, or review noise | Define the completion and Git workflow. |
| Output | User wants a prompt, document, table, or concise answer | Put the requested artifact first and omit unrequested narration. |
| Language | User corrects a term, example, or semantic range | Use the corrected terminology and avoid the narrowing word. |

## Confidence

Treat a correction as high confidence when it is explicit, repeated, accepted in the final result, or supported by project rules. Treat inferred personality traits and isolated stylistic reactions as low confidence.

## Contradictions

Use the latest explicit decision for the task. Keep an earlier rule only when it applies to a different phase or scope. For example, "do not modify code yet" can coexist with a later implementation request by becoming an analysis gate rather than a permanent prohibition.

## Discoveries versus instructions

Do not place a later code or environment finding into the opening prompt as a fact unless the user already knew it. Translate it:

```text
Later finding: the feature flag is not wired.
Restart clause: verify how the feature flag is wired before changing the matcher.
```
