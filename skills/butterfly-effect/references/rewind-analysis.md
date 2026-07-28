# Rewind Analysis

Use this reference to connect multiple corrections to an earlier drift point without inventing causality.

## Correction Chains

Group correction events only when at least one of these signals is present:

- They protect the same objective, audience, artifact, or acceptance criterion.
- A later correction explicitly repairs a consequence of an earlier Agent assumption.
- Replacing one earlier Agent action would have prevented most of the later corrections.

Keep independent requests or unrelated preferences in separate chains. A transcript may produce several chains or no reliable chain.

## Rewind Boundary

For each chain, compare the Agent's actions in reverse chronological order and choose the earliest boundary that satisfies all of the following:

1. The boundary is before the first supported causal assumption or action.
2. The linked corrections are downstream consequences of that assumption or action, not merely adjacent requests.
3. Earlier accepted decisions remain valid and do not need to be discarded.

Represent the boundary as one of:

- `before turn <id>` or `before <timestamp>` when the source provides stable identifiers;
- `before the Agent assumed/decided <short description>` when it does not;
- `the original request` when the drift began with the first Agent action;
- `no single reliable rewind point` when chains are independent or evidence is insufficient.

Do not call the first user correction the rewind point automatically. The user correction is evidence; the rewind point is the earlier Agent action it reveals.

## Recommendation Content

Keep the default recommendation short and actionable:

- **Rewind to:** the boundary or an explicit no-rewind result;
- **Why:** the shared causal assumption and the correction chain it explains;
- **Keep:** earlier decisions that remain valid;
- **Confidence:** high, medium, or low, with one evidence-based qualifier when needed.

When there are multiple chains, list each boundary briefly and say whether the updated prompt covers them together or requires separate prompts.

## Missing or Truncated History

If the visible conversation does not contain the suspected first action, use the current-session source resolver only when that session is identifiable and accessible. Otherwise report the missing history and lower confidence; never infer a turn number or claim a precise boundary.

If no material correction chain exists, return `No reliable drift or rewind point detected` and use the original objective as the basis for the updated prompt. Do not manufacture a rewind recommendation.
