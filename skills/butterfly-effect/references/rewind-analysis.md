# Exceptional Rewind Analysis

Use this reference only when the normal single-chain analysis cannot support one high-confidence boundary.

## Independent Chains

Keep chains independent when they protect different objectives or acceptance conditions, repair consequences of different Agent actions, or would require different replacements. Independence is evidence against a common boundary, not evidence for a synthetic upstream cause.

For each independent chain:

1. Name the Agent action supported by that chain alone.
2. Locate its earliest supported boundary without discarding earlier accepted decisions.
3. Grade its boundary confidence from its own causal evidence.

There is no single rewind point when two or more chains retain different supported boundaries. Individual chains may remain high confidence; the combined result is medium or low confidence because it does not support one shared rewind.

## Conflicting Candidate Boundaries

When several Agent actions could explain one chain, compare them in reverse chronological order. Accept the earliest candidate only when replacing it would prevent most linked corrections and the corrections are consequences rather than adjacent requests. Otherwise choose the later supported candidate or lower boundary confidence.

The first user correction is evidence about an earlier action, never the boundary by itself.

## Missing Early Actions

When the suspected action is absent from visible history, recover only the identifiable current session through the source resolver. If it cannot be recovered:

- describe the suspected action without a turn number or timestamp;
- set boundary confidence to low;
- keep the updated prompt to the original objective and directly supported constraints.

Return `No reliable drift or rewind point detected` when the remaining history cannot distinguish drift from a new requirement or cannot support a usable boundary.

## Completion Criterion

Exceptional analysis is complete when every chain has its own supported or rejected boundary, every confidence grade refers to causal evidence, and no common cause, identifier, or prompt clause exceeds the available history.
