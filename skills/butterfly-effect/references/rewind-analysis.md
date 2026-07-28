# Rewind Analysis

Use this reference to connect multiple corrections to an earlier drift point without inventing causality.

## Invariant-First Reduction

Start with the smallest statement of what success must preserve: the objective, audience, artifact, and acceptance criteria. Call this the objective invariant. A correction is diagnostically useful only when it identifies a violated part of that invariant or a method required to protect it.

For each candidate Agent action, run two counterfactual questions:

- **Necessity:** if this action were replaced with the supported alternative, would the correction disappear?
- **Coverage:** would that replacement prevent most later corrections in the same chain?

Use the earliest action that passes both tests as the boundary. Do not move the boundary earlier merely because it sounds more general, and do not move it later merely because that is where the user first complained. After locating boundaries, minimize the updated prompt: retain only clauses that protect an invariant, request an evidence-gathering step, or define an accepted delivery/validation rule. This prevents symptom lists and hindsight facts from becoming an overfit restart prompt.

## Correction Chains

Group correction events only when at least one of these signals is present:

- They protect the same objective, audience, artifact, or acceptance criterion.
- A later correction explicitly repairs a consequence of an earlier Agent assumption.
- Replacing one earlier Agent action would have prevented most of the later corrections.

Keep independent requests or unrelated preferences in separate chains. A transcript may produce several chains or no reliable chain.

Independence is evidence against one common rewind point, not evidence for a synthetic upstream cause. Separate chains may still have their own supported boundaries.

## Rewind Boundary

For each chain, compare the Agent's actions in reverse chronological order and choose the earliest boundary that satisfies all of the following:

1. The boundary is before the first supported causal assumption or action.
2. The linked corrections are downstream consequences of that assumption or action, not merely adjacent requests.
3. Earlier accepted decisions remain valid and do not need to be discarded.

Represent the boundary as one of:

- `before turn <id>` or `before <timestamp>` when the source provides stable identifiers;
- `before the Agent assumed/decided <short description>` when it does not;
- `the original request` when the drift began with the first Agent action;
- `no single rewind point; see independent chains below` when several chains have separate supported boundaries;
- `No reliable drift or rewind point detected` when no material chain or usable boundary is supported.

Do not call the first user correction the rewind point automatically. The user correction is evidence; the rewind point is the earlier Agent action it reveals.

## Recommendation Content

Keep the default recommendation short and actionable:

- **Rewind to:** the boundary or an explicit no-rewind result;
- **Why:** the shared causal assumption and the correction chain it explains;
- **Keep:** earlier decisions that remain valid;
- **Confidence:** high, medium, or low, with one evidence-based qualifier when needed.

When there are multiple independent chains, list only the supported boundary for each, explicitly reject a shared boundary, mark the overall result medium or low confidence, and say whether the updated prompt covers them together or requires separate prompts. Do not lower an individual chain's confidence merely because another independent chain exists; lower confidence for that chain when its own history or causal evidence is weak.

## Confidence and Fallbacks

- **High:** the Agent action is visible and multiple explicit or accepted corrections repair its consequences.
- **Medium:** the action and correction are visible, but the downstream link is partly inferred or only one material correction supports it.
- **Low:** the correction is visible but the suspected Agent action or early history is incomplete. Describe the boundary without a turn or timestamp.
- **No reliable result:** there is no material correction chain, the source is too incomplete to distinguish drift from a new requirement, or causality would be speculative. Return the exact fallback sentence and do not manufacture an updated prompt from unsupported rules.

## Missing or Truncated History

If the visible conversation does not contain the suspected first action, use the current-session source resolver only when that session is identifiable and accessible. Otherwise report the missing history and lower confidence; never infer a turn number or claim a precise boundary. A low-confidence recommendation may still use supported corrections, but its updated prompt must contain only the original objective and constraints directly evidenced by the remaining record.

If no material correction chain exists, return `No reliable drift or rewind point detected`. Do not rewrite the original request merely to fill the updated-prompt slot; generate one only when the user explicitly asks for prompt reconstruction despite the diagnostic result.
