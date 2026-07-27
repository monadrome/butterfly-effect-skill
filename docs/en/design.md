# Design Notes

## Why the prompt comes first

Users invoke Butterfly Effect to restart better. A long retrospective makes them translate analysis into instructions again, recreating the work the Skill should perform. The default output is therefore the final prompt alone.

## Avoiding hindsight leakage

A correction can reveal a requirement that the user could have stated initially, or a fact that nobody knew until investigation. The first belongs directly in the restart prompt. The second becomes an instruction to inspect or verify.

## Avoiding overfitting

The prompt should prevent the correction pattern, not preserve every implementation artifact. "Use explicit inputs instead of an object field" may generalize to a function boundary. A temporary variable name usually should not appear.

## Counterfactual validation

The final check asks whether a fresh agent following only the restart prompt would avoid each high-confidence correction without being given impossible prior knowledge. This is the central quality gate.
